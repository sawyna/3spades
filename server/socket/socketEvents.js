var config = require('../config/config').gameConfig;
var synctimers = require('./synctimers');
var users = require('../db/queries/users');
var games = require('../db/queries/games');
var cardsHandler = require('../middleware/cardsHandler');
var async = require('async');
var RoundStore = require('./roundStore');
var InfoStorage = require('./infoStorage');

var dialogue = require('./dialogue');

module.exports = {
	bidEvents: function(io, socket) {
		dialogue.raiseBid(io, socket);
		dialogue.finalizeBid(io, socket);
	},

	joinHostEvents: function(io, socket) {
		dialogue.newPlayer(io, socket);
	},

	gameEvents: function(io, socket) {
		dialogue.distributeCards(io, socket);
		dialogue.chooseHukumAndPartners(io, socket);
	},

	roundEvents: function(io, socket) {
		socket.on("ROUND_TURN_DONE", (data) => {

			var roundStore = InfoStorage.get(data.gameId);
			console.log(roundStore);
			//check if there is really an object
			if(roundStore) {
				roundStore.advanceRound(data);
				io.sockets.in(String(data.gameId)).emit("ROUND_TURN_END", roundStore.getInfo());
				if(roundStore.getInfo().last) {
					roundStore.reset();
					io.sockets.in(String(data.gameId)).emit("ROUND_WINNER", roundStore.getWinnerInfo());
					if(!roundStore.isDone())
						io.sockets.in(String(data.gameId)).emit("ROUND_TURN_START", roundStore.getInfo());
				}
				else {
					roundStore.incrementTurn();
					io.sockets.in(String(data.gameId)).emit("ROUND_TURN_START", roundStore.getInfo());
				}
			}
		});
	}
};