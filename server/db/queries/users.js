var promiseUtil = require('../../middleware/promiseUtil');
var client = require('../mysqlClient');
var format = require('string-format');
var cardsHandler = require('../../middleware/cardsHandler');

const insertNewUserQuery = "INSERT INTO USERS VALUES (0, {gameId}, '{name}', NULL, NULL, NULL)";
const deleteUserQuery = "DELETE FROM USERS WHERE id = {userId}";
const insertNewCardStateQuery = "INSERT INTO CARDS_STATE VALUES(0, '{diamonds}', '{spades}', '{clubs}', '{hearts}')";
const updateInitialCardStateQuery = "UPDATE USERS SET INITIAL_CARD_STATE = {initialCardStateId} WHERE id = {userId}";
const userInfoQuery = 
`SELECT  
	u.id as userId,
	u.name as userName,
	init_state.diamonds as diamonds,
	init_state.spades as spades,
	init_state.clubs as clubs,
	init_state.hearts as hearts
FROM USERS u JOIN CARDS_STATE init_state 
	ON u.initial_card_state = init_state.id 
WHERE u.id = {userId}`;

var users = {};

users.insertNew = function(userName, gameId) {
	var user = {
		name: userName,
		gameId: gameId
	};

	return promiseUtil.create((resolve, reject) => {
		client.runQuery(insertNewUserQuery, user)
		.then((results, fields) => {
			resolve({
				"userId": results.insertId,
				"gameId": gameId
			});
		})
		.catch((error) => {
			reject(error);
		});
	});
}

users.deleteUser = function(userId) {
	return promiseUtil.create((resolve, reject) => {
		client.runQuery(deleteUserQuery, {
			userId: userId
		})
		.then((results, fields) => {
			resolve(results, fields)
		})
		.catch((err) => {
			reject(err);
		})
	});
}

users.saveDeck = function(userId, cardDeck) {
	return promiseUtil.create((resolve, reject) => {
		users.insertNewCardState({
			diamonds: cardsHandler.convertDeckToString(cardDeck['D']),
			spades: cardsHandler.convertDeckToString(cardDeck['S']),
			clubs: cardsHandler.convertDeckToString(cardDeck['C']),
			hearts: cardsHandler.convertDeckToString(cardDeck['H'])
		})
		.then((results) => {
			return users.updateInitialCardState(userId, results.insertId);
		})
		.then((results) => {
			resolve(results);
		})
		.catch((err) => {
			reject(err);
		});
	});
}

users.getUserInfo = function(userId) {
	return promiseUtil.create((resolve, reject) => {
		client.runQuery(userInfoQuery, {
			userId: userId
		})
		.then((results, fields) => {
			resolve(results);
		})
		.catch((err) => {
			reject(err);
		})
	});
}

users.updateInitialCardState = function(userId, initialCardStateId) {
	return promiseUtil.create((resolve, reject) => {
		client.runQuery(updateInitialCardStateQuery, {
			userId: userId,
			initialCardStateId: initialCardStateId
		})
		.then((results, fields) => {
			resolve(results);
		})	
		.catch((err) => {
			reject(err);
		});
	});
}

users.insertNewCardState = function(cardDeck) {
	return promiseUtil.create((resolve, reject) => {
		client.runQuery(insertNewCardStateQuery, cardDeck)
		.then((results, fields) => {
			resolve(results);
		})
		.catch((err) => {
			reject(err);
		});
	});
}

module.exports = users;

