var config = require('../config/config').gameConfig;
var synctimers = require('./synctimers');
var users = require('../db/queries/users');
var games = require('../db/queries/games');
var cardsHandler = require('../middleware/cardsHandler');
var async = require('async');

module.exports = {
	bidEvents: function(io, socket) {
		socket.on("BID_RAISE", function(data) {
			//console.log(socket);	
			console.log(`GameId: ${data.metaData.gameId}`);
			io.sockets.in(String(data.metaData.gameId)).emit("BID_ADDED", data);
		});

		socket.on("BID_WINNER", function(data) {
			games.updateGameState(data.gameId, config.gameStates.BID_END, () => {
				games.updateBidAndBidWinner({
					gameId: data.gameId,
					bid: data.bidding.bid,
					winnerId: data.bidding.userId
				}, () => {
					io.sockets.in(String(data.gameId)).emit("HUKUM_PARTNERS", {
						bidWinner: {
							id: data.bidding.userId,
							name: data.bidding.userName,
							value: data.bidding.bid
						}
					});
				});
			});
		});
	},

	joinHostEvents: function(io, socket) {
		socket.on("NEW_PLAYER", function(data) {
			socket._appdata.userId = data.user.id;
			console.log("NEW_PLAYER received");
			socket.join(String(data.gameId));
			var response = {
				type: "NEW_PLAYER_JOINED",
				userInfo: data.user
			};
			console.log(io.sockets.adapter.rooms[String(data.gameId)]);
			io.sockets.in(String(data.gameId)).emit("NEW_PLAYER_JOINED", response);
		});

		socket.on("disconnect", () => {
			if(socket._appdata && socket._appdata.userId) {
				users.deleteUser(socket._appdata.userId, (results, fields) => {
					console.log(results);
				});
			}
		});
	},

	gameEvents: function(io, socket) {
		socket.on("START_GAME", function(data) {	
			games.updateGameState(data.gameId, config.gameStates.GAME_START, () => {
				games.getAllPlayers(data.gameId, (results) => {
					cardsHandler.generateInitialDeck(results);

					var fnArray = [];

					for(let i = 0; i < results.length; i++) {
						fnArray.push(function(callback) {
							users.saveDeck(results[i].id, results[i].cards, (results1) => {
								console.log(results1);
								callback(null, results1);
							});	
						});
					}

					async.parallel(fnArray, (err, results) => {
						synctimers.bidTimer(io, socket, 30, data.gameId, "BID_TIMER", "BID_TIMER_RESET", "BID_END");
						io.sockets.in(String(data.gameId)).emit("GAME_STARTED", {});
					});
				});
			});
		});

		socket.on("HUKUM_PARTNERS_CHOSEN", (data) => {

			games.updateHukumPartners(data, (results) => {
				games.updateGameState(data.gameId, config.gameStates.WINNER_CHOOSE, () => {
					io.sockets.in(String(data.gameId)).emit("HUKUM_PARTNERS_RESULT", data);
				});
			});
		});
	}
};