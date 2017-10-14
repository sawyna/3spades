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

games.insertNew = function(callback) {
	var game = {gameState: gameConfig.gameStates.GAME_INIT};
	console.log(game);
	client.runQuery(insertNewGame, game, (results, fields) => {
		var gameResponse = {};
		gameResponse.id = results.insertId;
		callback(gameResponse);
	});
}

games.updateHukumPartners = function(data, callback) {
	var cardDeck = {
		diamonds: cardsHandler.createDBFormatFromCard('-1'),
		spades: cardsHandler.createDBFormatFromCard('-1'),
		clubs: cardsHandler.createDBFormatFromCard('-1'),
		hearts: cardsHandler.createDBFormatFromCard('-1')
	};

	cardDeck[data.partnerInfo.firstPartner.suit] = cardsHandler.createDBFormatFromCard(data.partnerInfo.firstPartner.cards);

	users.insertNewCardState(cardDeck, (firstPartner) => {
		cardDeck = {
		diamonds: cardsHandler.createDBFormatFromCard('-1'),
		spades: cardsHandler.createDBFormatFromCard('-1'),
		clubs: cardsHandler.createDBFormatFromCard('-1'),
		hearts: cardsHandler.createDBFormatFromCard('-1')
		};

		cardDeck[data.partnerInfo.secondPartner.suit] = cardsHandler.createDBFormatFromCard(data.partnerInfo.secondPartner.cards);	
		users.insertNewCardState(cardDeck, (secondPartner) => {
			client.runQuery(updateHukumPartnersQuery, {
				gameId: data.gameId,
				hukum: data.partnerInfo.hukum,
				firstPartnerId: firstPartner.insertId,
				secondPartnerId: secondPartner.insertId
			}, (results, fields) => {
				callback(results);
			});
		});
	});
}

games.updateBidAndBidWinner = function(data, callback) {
	client.runQuery(updateBidAndBidWinnerQuery, {
		gameId: data.gameId,
		bid: data.bid,
		winnerId: data.winnerId
	}, function(results, fields) {
		callback();
	});
}

games.updateGameState = function(gameId, gameState, callback) {
	client.runQuery(updateGameStateQuery, {
		gameState: gameState,
		gameId: gameId
	}, function(results, fields) {
		//check for success and failure over here
		callback();
	});
}

games.updateOwner = function(gameId, ownerUserId, callback) {
	var game = {
		gameId: gameId,
		ownerId: ownerUserId
	};

	client.runQuery(updateOwnerQuery, game, callback);
}

games.increasePlayerCount = function(gameId, callback) {
	var game = {
		gameId: gameId
	};
	client.runQuery(updateNumOfUsersQuery, game, function(results, fields) {
		callback();
	});
}

games.getCurrentPlayerCount = function(gameId, callback) {
	client.runQuery(getPlayerCount, {gameId: gameId}, (results, fields) => {
		if(results.length > 0) {
			callback(results[0].users_count);
		}
		else {
			throw new Error("invalid query");
		}
	});
}

games.getAllPlayers = function(gameId, callback) {
	client.runQuery(getAllPlayers, {gameId: gameId}, function(results, fields) {
		callback(results);
	});
}

games.getGameState = function(gameId, callback) {
	client.runQuery(getGameStateQuery, {gameId: gameId}, function(results, fields) {
		if(results.length > 0) {
			callback(results[0].game_state);
		}
		else {
			throw new Error("query error");
		}
	});
}

games.getHukum = function(gameId, callback) {
	client.runQuery(getHukumQuery, {gameId: gameId}, function(results, fields) {
		callback(results, fields);
	});
}

games.getBidWinner = function(gameId, callback) {
	client.runQuery(getBidWinnerQuery, {gameId: gameId}, function(results, fields) {
		callback(results, fields);
	});
}


module.exports = games;