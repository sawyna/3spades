var express = require('express');
var router = express.Router();
const util = require('util');

var errorHandler = require('../errors/errorHandler');
var CustomError = require('../errors/CustomError');
var gameConfig = require('../config/config').gameConfig;
var users = require('../db/queries/users');
var games = require('../db/queries/games');
var gameConfig = require('../config/config').gameConfig;

router.get('/join', function(req, res) {
	var userName = req.query.userName;
	var gameId = req.query.gameId;
	var userId;

	if(userName === undefined || userName === "") {
		res.status(500).json({
			"message": "Username cannot be empty"
		});
	}
	else if(gameId === undefined || gameId === "") {
		res.status(500).json({
			"message": "game id cannot be empty"
		});
	}
	else {

		games.getCurrentPlayerCount(gameId)
		.then((playerCount) => {
			if(playerCount > gameConfig.MAX_PLAYERS) {
				throw errorHandler.createApiError({
					"status": 500,
					"message": util.format("Max players can be %d", gameConfig.MAX_PLAYERS)
				});
			}
			else {
				return games.getGameState(gameId);
			}
		})
		.then((gameState) => {
			if(gameState > gameConfig.gameStates.GAME_INIT) {
				throw errorHandler.createApiError({
					status: 500,
					"message": "Game has already started"
				});
			}
			else {
				return users.insertNew(userName, gameId);
			}
		})
		.then((userResponse) => {
			userId = userResponse.userId;
			return games.increasePlayerCount(gameId);
		})
		.then(() => {
			res.send({
				gameId: gameId,
				userId: userId
			});
		})
		.catch((err) => {
			console.log(err);
			try {
				if(err instanceof CustomError) {
					res.status(err.status).json({
						"message": err.message
					});
				}
				else {
					res.status(500).json({
						"message": "Unknown internal error occurred"
					});
				}
			}
			catch (unhandledError) {
				console.log(unhandledError);
				res.status(500).json({
					"message": "Unknown internal error occurred"
				});
			}
		}); 
	}
});

router.get('/host', function(req, res) {
	var userName = req.query.userName;
	var response = {};

	games.insertNew()
	.then((gameResponse) => {
		return users.insertNew(userName, gameResponse.id);
	})
	.then((userResponse) => {
		response.userId = userResponse.userId;
		response.gameId = userResponse.gameId;
		return games.updateOwner(userResponse.gameId, userResponse.userId);
	})
	.then((results, fields) => {
		res.send(response);
	})
	.catch((error) => {
		
	});
});

module.exports = router;