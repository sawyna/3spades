var config = require('../config/config').gameConfig;
var synctimers = require('./synctimers');
var users = require('../db/queries/users');
var games = require('../db/queries/games');
var cardsHandler = require('../middleware/cardsHandler');
var errorHandler = require('../errors/errorHandler');
var RoundOperator = require('./roundOperator');
var inMemoryStorage = require('./inMemoryStorage');

module.exports = {

	//TODO: where to call reject here?
	newPlayer: function(io, socket) {
		socket.on("NEW_PLAYER", (data) => {
			let roomId = String(data.gameId);
			let userId = data.user.id;

			socket._appdata.userId = userId;
			
			socket.join(roomId);
			
			let response = {
				type: "NEW_PLAYER_JOINED",
				payload: {
					userId: userId,
					gameId: data.gameId
				}
			};

			inMemoryStorage.putSocket(String(data.gameId), String(userId), socket);

			io.sockets.in(roomId).emit("NEW_PLAYER_JOINED", response);
		});

		socket.on("disconnect", () => {
			if(socket._appdata && socket._appdata.userId) {
				
				users.deleteUser(socket._appdata.userId)
				.then((results) => {
					console.log(`Deleted user ${socket._appdata.userId}`);
				})
				.catch((err) => {
					console.log(`Failed to delete user ${socket._appdata.userId}`);
				});
			}
		});
	},

	raiseBid: function(io, socket) {
		socket.on("BID_RAISE", function(data) {
			//console.log(socket);	
			console.log(`GameId: ${data.metaData.gameId}`);
			io.sockets.in(String(data.metaData.gameId)).emit("BID_ADDED", data);
		});
	},

	distributeCards: function(io, socket) {
		socket.on("START_GAME", function(data) {	

			games.updateGameState(data.gameId, config.gameStates.GAME_START)
			.then((results) => {
				return games.getAllPlayers(data.gameId);
			})
			.then((results) => {
				cardsHandler.generateInitialDeck(results);
				let promiseArray = [];

				for(let i = 0; i < results.length; i++) {
					promiseArray.push(users.saveDeck(results[i].id, results[i].cards));
				}

				Promise.all(promiseArray)
				.then((results) => {
					synctimers.bidTimer(io, socket, config.BID_COUNTDOWN, data.gameId, "BID_TIMER", "BID_TIMER_RESET", "BID_END");
					io.sockets.in(String(data.gameId)).emit("GAME_STARTED", {});
				})
				.catch((err) => {
					console.log(err);
				});
			});
		});
	},

	finalizeBid: function(io, socket) {
		socket.on("BID_WINNER", function(data) {
			games.updateGameState(data.gameId, config.gameStates.BID_END)
			.then(() => {
				return games.updateBidAndBidWinner({
					gameId: data.gameId,
					bid: data.bidding.bid,
					winnerId: data.bidding.userId
				});
			})
			.then(() => {
				io.sockets.in(String(data.gameId)).emit("HUKUM_PARTNERS", {
					bidWinner: {
						id: data.bidding.userId,
						name: data.bidding.userName,
						value: data.bidding.bid
					}
				});
			});
		});
	},

	chooseHukumAndPartners: function(io, socket) {
		socket.on("HUKUM_PARTNERS_CHOSEN", (data) => {
			var roomId = String(data.gameId);
			games.updateHukumPartners(data)
			.then((results) => {
				return games.updateGameState(data.gameId, config.gameStates.WINNER_CHOOSE);
			})
			.then(() => {
				io.sockets.in(roomId).emit("HUKUM_PARTNERS_RESULT", data);
				RoundOperator.load(data.gameId, (instance) => {
					inMemoryStorage
					.getSocket(data.gameId, instance.getCurrentPlayerId())
					.emit("ROUND_TURN_START", {
						currentDeck: instance.getCurrentDeck(),
						"first": instance.isFirst(),
						"activeSuit": instance.getActiveSuit(),
						"hukum": instance.getHukum()
					});
				});
			});
		});
	},

	/*
	{
		gameId: 1234,
		userId: 12345,
		card: {
			num: <1 to 13>,
			suit: <D, C, H, S>
		}
	}
	*/

	playRounds: function(io, socket) {
		socket.on("ROUND_TURN_PLAYED", (data) => {

			var roomId = String(data.gameId);
			var instance = inMemoryStorage.getRoundOps(roomId);
			//check if there is really an object
			if(instance) {
				instance.playTurn(data);
				var response = {
					"currentDeck": instance.getCurrentDeck()
				};


				io.sockets.in(roomId).emit("ROUND_TURN_END", response);

				if(instance.isDone()) {
					//rethink about this broadcast
					let winner = instance.getWinner();
					users.getUserInfo(winner.userId)
					.then((results) => {
						io.sockets.in(String(data.gameId)).emit("ROUND_WINNER", {
							"winner": winner,
							"score": cardsHandler.getScore(instance.getCurrentDeck()),
							"name": (results.length > 0 ? results[0].userName : "NA"),
							"roundNumber": instance.getRoundNumber()
						});
						let prevRoundWinnerId = instance.getWinner().userId;
						instance.reset(prevRoundWinnerId);
						inMemoryStorage
						.getSocket(data.gameId, prevRoundWinnerId)
						.emit("ROUND_TURN_START", {
							currentDeck: instance.getCurrentDeck(),
							"first": instance.isFirst(),
							"activeSuit": instance.getActiveSuit(),
							"hukum": instance.getHukum()
						});
					});
				}
				else {
					inMemoryStorage
					.getSocket(data.gameId, instance.getCurrentPlayerId())
					.emit("ROUND_TURN_START", {
						currentDeck: instance.getCurrentDeck(),
						"first": instance.isFirst(),
						"activeSuit": instance.getActiveSuit(),
					});
				}
			}
		});
	}
}