var express = require('express');
var router = express.Router();
var gameConfig = require('../config/config').gameConfig;

var users = require('../db/queries/users');
var games = require('../db/queries/games');
var gameConfig = require('../config/config').gameConfig;

router.get('/join', function(req, res) {
	var userName = req.query.userName;
	var gameId = req.query.gameId;

	
	games.getCurrentPlayerCount(gameId, (playerCount) => {
		if(playerCount > gameConfig.MAX_PLAYERS) {
			res.status(500).json({
				"message": "Max players can be 7"
			});
		}
		else {
			games.getGameState(gameId, (gameState) => {
				if(gameState > gameConfig.gameStates.GAME_INIT) {
					res.status(500).json({
						"message": "Game has already started"
					});
				}
				else {
					users.insertNew(userName, gameId, (userResponse) => {
						games.increasePlayerCount(gameId, ()  => {
							var response = {
								gameId: gameId,
								userId: userResponse.id
							};
							
							console.log(response);
							res.send(response);
						});
					});
				}
			});
		}
	});
});

router.get('/host', function(req, res) {
	var userName = req.query.userName;
	
	games.insertNew((gameResponse) => {
		users.insertNew(userName, gameResponse.id, (userResponse) => {
			games.updateOwner(gameResponse.id, userResponse.id, (UpdateGameResponse) =>  {
				var response = {
					gameId: gameResponse.id,
					userId: userResponse.id
				};
				res.send(response);
			});
		});
	});


});

module.exports = router;