var config = require('../config/config').gameConfig;
var synctimers = require('./synctimers');
var users = require('../db/queries/users');
var games = require('../db/queries/games');
var cardsHandler = require('../middleware/cardsHandler');
var async = require('async');
var dialogue = require('./dialogue');
var inMemoryStorage = require('./inMemoryStorage');

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
		dialogue.playRounds(io, socket);
	}
};