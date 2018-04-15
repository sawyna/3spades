var promiseUtil = require('../../middleware/promiseUtil');
var client = require('../mysqlClient');
var users = require('./users');
var cardsHandler = require('../../middleware/cardsHandler');
var gameConfig = require('../../config/config').gameConfig;

const insertNewGame = "INSERT INTO games (num_of_players, game_state) VALUES (0, {gameState})";

const updateGameStateQuery = "UPDATE games SET game_state = {gameState} WHERE id = {gameId}";
const updateOwnerQuery = "UPDATE games SET game_owner = {ownerId}, num_of_players = 1 WHERE id = {gameId}";
const updateNumOfUsersQuery = "UPDATE games SET num_of_players = num_of_players + 1 WHERE id = {gameId}";
const updateBidAndBidWinnerQuery = "UPDATE games SET bid = {bid}, bid_winner = {winnerId} WHERE id = {gameId}";
const updateHukumPartnersQuery = "UPDATE games SET hukum = '{hukum}', first_partner = {firstPartnerId}, second_partner = {secondPartnerId} WHERE id = {gameId}";

const getGameStateQuery = "SELECT game_state from games where id = {gameId}";
const getPlayerCount = "SELECT count(*) as users_count from users where game_id = {gameId}";
const getAllPlayers = "SELECT * from users where game_id = {gameId}";
const getHukumQuery = "SELECT * from games where id = {gameId}";
const getBidWinnerQuery = "SELECT bid_winner from games where id = {gameId}";

var games = {};

games.insertNew = function() {
	var game = {gameState: gameConfig.gameStates.GAME_INIT};
	console.log(game);

	return promiseUtil.create((resolve, reject) => {
		client.runQuery(insertNewGame, game)
		.then((results, fields) => {
			var gameResponse = {};
			gameResponse.id = results.insertId;
			resolve(gameResponse);
		})
		.catch((error) => {
			reject(error);
		});
	});
}

games.updateHukumPartners = function(data) {
	var promiseResults = {};
	var cardDeck = cardsHandler.createCardDeck((emptyCardDeck) => {
		emptyCardDeck[data.partnerInfo.firstPartner.suit] = cardsHandler.createDBFormatFromCard(data.partnerInfo.firstPartner.cards);
	});

	return promiseUtil.create((resolve, reject) => {
		users.insertNewCardState(cardDeck)
		.then((firstPartner) => {
			promiseResults.firstPartner = firstPartner;
			cardDeck = cardsHandler.createCardDeck((emptyCardDeck) => {
				emptyCardDeck[data.partnerInfo.secondPartner.suit] = cardsHandler.createDBFormatFromCard(data.partnerInfo.secondPartner.cards);
			});
			return users.insertNewCardState(cardDeck);		
		})
		.then((secondPartner) => {
			promiseResults.secondPartner = secondPartner;
			return client.runQuery(updateHukumPartnersQuery, {
					gameId: data.gameId,
					hukum: data.partnerInfo.hukum,
					firstPartnerId: promiseResults.firstPartner.insertId,
					secondPartnerId: promiseResults.secondPartner.insertId
				});
		})
		.then((results, fields) => {
			resolve(results);
		})
		.catch((err) => {
			reject(err);
		});
	});

	// users.insertNewCardState(cardDeck, (firstPartner) => {
	// 	cardDeck = {
	// 	diamonds: cardsHandler.createDBFormatFromCard('-1'),
	// 	spades: cardsHandler.createDBFormatFromCard('-1'),
	// 	clubs: cardsHandler.createDBFormatFromCard('-1'),
	// 	hearts: cardsHandler.createDBFormatFromCard('-1')
	// 	};

	// 	cardDeck[data.partnerInfo.secondPartner.suit] = cardsHandler.createDBFormatFromCard(data.partnerInfo.secondPartner.cards);	
	// 	users.insertNewCardState(cardDeck, (secondPartner) => {
	// 		client.runQuery(updateHukumPartnersQuery, {
	// 			gameId: data.gameId,
	// 			hukum: data.partnerInfo.hukum,
	// 			firstPartnerId: firstPartner.insertId,
	// 			secondPartnerId: secondPartner.insertId
	// 		}, (results, fields) => {
	// 			callback(results);
	// 		});
	// 	});
	// });
}

games.updateBidAndBidWinner = function(data) {
	return promiseUtil.create((resolve, reject) => {
		client.runQuery(updateBidAndBidWinnerQuery, {
			gameId: data.gameId,
			bid: data.bid,
			winnerId: data.winnerId
		})
		.then((results, fields) => {
			resolve(results);
		})
		.catch((error) => {
			reject(error);
		})
	});

	// client.runQuery(updateBidAndBidWinnerQuery, {
	// 	gameId: data.gameId,
	// 	bid: data.bid,
	// 	winnerId: data.winnerId
	// }, function(results, fields) {
	// 	callback();
	// });
}

games.updateGameState = function(gameId, gameState) {

	return promiseUtil.create((resolve, reject) => {
		client.runQuery(updateGameStateQuery, {
			gameState: gameState,
			gameId: gameId
		})
		.then((results, fields) => {
			resolve(results);
		})
		.catch((error) => {
			reject(error);
		})
	});

	// client.runQuery(updateGameStateQuery, {
	// 	gameState: gameState,
	// 	gameId: gameId
	// }, function(results, fields) {
	// 	//check for success and failure over here
	// 	callback();
	// });
}

games.updateOwner = function(gameId, ownerUserId) {
	var game = {
		gameId: gameId,
		ownerId: ownerUserId
	};

	return promiseUtil.create((resolve, reject) => {
		client.runQuery(updateOwnerQuery, game)
		.then((results, fields) => {
			resolve(results);
		})
		.catch((error) => {
			reject(error);
		})
	});

	//client.runQuery(updateOwnerQuery, game, callback);
}

games.increasePlayerCount = function(gameId) {
	return promiseUtil.create((resolve, reject) => {
		client.runQuery(updateNumOfUsersQuery, {
			gameId: gameId
		})
		.then((results, fields) => {
			resolve(results);
		})
		.catch((error) => {
			reject(error);
		})
	});

	// client.runQuery(updateNumOfUsersQuery, game, function(results, fields) {
	// 	callback();
	// });
}

games.getCurrentPlayerCount = function(gameId) {
	return promiseUtil.create((resolve, reject) => {
		client.runQuery(getPlayerCount, {
			gameId: gameId
		})
		.then((results, fields) => {
			if(results.length > 0) {
				resolve(results[0].users_count);
			}
			else {
				throw new Error("invalid query");
			}
		})
		.catch((err) => {
			reject(err);
		});
	});

	// client.runQuery(getPlayerCount, {gameId: gameId}, (results, fields) => {
	// 	if(results.length > 0) {
	// 		callback(results[0].users_count);
	// 	}
	// 	else {
	// 		throw new Error("invalid query");
	// 	}
	// });
}

games.getAllPlayers = function(gameId) {
	return promiseUtil.create((resolve, reject) => {
		client.runQuery(getAllPlayers, {
			gameId: gameId
		})
		.then((results, fields) => {
			resolve(results);
		})
		.catch((err) => {
			reject(err);
		});
	});

	// client.runQuery(getAllPlayers, {gameId: gameId}, function(results, fields) {
	// 	callback(results);
	// });
}

games.getGameState = function(gameId) {
	return promiseUtil.create((resolve, reject) => {
		client.runQuery(getGameStateQuery, {
			"gameId": gameId
		})
		.then((results, fields) => {
			if(results.length > 0) {
				resolve(results[0].game_state);
			}
			else {
				throw new Error("query error");
			}	
		})
		.catch((err) => {
			reject(err);
		});
	});

	// client.runQuery(getGameStateQuery, {gameId: gameId}, function(results, fields) {
	// 	if(results.length > 0) {
	// 		callback(results[0].game_state);
	// 	}
	// 	else {
	// 		throw new Error("query error");
	// 	}
	// });
}

games.getHukum = function(gameId) {
	return promiseUtil.create((resolve, reject) => {
		client.runQuery(getHukumQuery, {
			gameId: gameId
		})
		.then((results, fields) => {
			resolve(results[0]["hukum"]);
		})
		.catch((err) => {
			reject(err);
		});
	});

	// client.runQuery(getHukumQuery, {gameId: gameId}, function(results, fields) {
	// 	callback(results, fields);
	// });
}

games.getBidWinner = function(gameId) {
	return promiseUtil.create((resolve, reject) => {
		return client.runQuery(getBidWinnerQuery, {gameId: gameId})
		.then((results, fields) => {
			resolve(results[0]["bid_winner"]);
		})
		.catch((error) => {
			reject(error);
		});
	});
}


module.exports = games;