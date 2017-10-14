var games = require('../db/queries/games');
var users = require('../db/queries/users');

var handler = {
	findPartnerIds: function(data) {
		games.getAllPlayers(data.gameId, (results) => {
			
		});
	}
};