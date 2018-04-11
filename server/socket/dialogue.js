var config = require('../config/config').gameConfig;
var synctimers = require('./synctimers');
var users = require('../db/queries/users');
var games = require('../db/queries/games');
var cardsHandler = require('../middleware/cardsHandler');
var errorHandler = require('../errors/errorHandler');
var RoundStore = require('./roundStore');
var InfoStorage = require('./infoStorage');

module.exports = {

	//TODO: where to call reject here?
	newPlayer: function(io, socket) {
		socket.on("NEW_PLAYER", (data) => {
			let roomId = String(data.gameId);
			socket._appdata.userId = data.user.id;
			
			socket.join(roomId);
			
			let response = {
				type: "NEW_PLAYER_JOINED",
				payload: {
					userId: data.user.id,
					gameId: data.gameId
				}
			};
			//console.log(io.sockets.adapter.rooms[String(data.gameId)]);

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
				console.log("level1");
				return games.getAllPlayers(data.gameId);
			})
			.then((results) => {
				console.log("level2");
				cardsHandler.generateInitialDeck(results);
				let promiseArray = [];

				console.log("card deck generated");
				for(let i = 0; i < results.length; i++) {
					promiseArray.push(users.saveDeck(results[i].id, results[i].cards));
				}

				console.log("here");
				Promise.all(promiseArray)
				.then((results) => {
					synctimers.bidTimer(io, socket, 30, data.gameId, "BID_TIMER", "BID_TIMER_RESET", "BID_END");
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
			games.updateHukumPartners(data)
			.then((results) => {
				return games.updateGameState(data.gameId, config.gameStates.WINNER_CHOOSE);
			})
			.then(() => {
				io.sockets.in(String(data.gameId)).emit("HUKUM_PARTNERS_RESULT", data);
				RoundStore(data.gameId, (roundStore) => {
						InfoStorage.put(data.gameId, roundStore);
						io.sockets.in(String(data.gameId)).emit("ROUND_TURN_START", roundStore.getInfo());
					});
				//TODO start the rounds
			});

			// games.updateHukumPartners(data, (results) => {
			// 	games.updateGameState(data.gameId, config.gameStates.WINNER_CHOOSE, () => {
			// 		io.sockets.in(String(data.gameId)).emit("HUKUM_PARTNERS_RESULT", data);
			// 		RoundStore(data.gameId, (roundStore) => {
			// 			InfoStorage.put(data.gameId, roundStore);
			// 			io.sockets.in(String(data.gameId)).emit("ROUND_TURN_START", roundStore.getInfo());
			// 		});
			// 	});
			// });
		});
	}
}