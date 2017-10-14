var db = require('../mysqlConnect');
var client = require('../mysqlClient');
var format = require('string-format');
var cardsHandler = require('../../middleware/cardsHandler');

const insertNewUser = "INSERT INTO USERS VALUES (0, {gameId}, '{name}', NULL, NULL, NULL)";
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

users.insertNew = function(userName, gameId, callback) {
	var user = {
		name: userName,
		gameId: gameId
	};
	var query = format(insertNewUser, user);
	console.log(query);
	var response = {};
	db.execute(query, function(results, fields) {
		response.id = results.insertId;
		callback(response);
	});
}

users.deleteUser = function(userId, callback) {
	client.runQuery(deleteUserQuery, {userId: userId}, function(results, fields) {
		callback(results, fields);
	});
}

users.saveDeck = function(userId, cardDeck, callback) {
	users.insertNewCardState({
		diamonds: cardsHandler.convertDeckToString(cardDeck['D']),
		spades: cardsHandler.convertDeckToString(cardDeck['S']),
		clubs: cardsHandler.convertDeckToString(cardDeck['C']),
		hearts: cardsHandler.convertDeckToString(cardDeck['H'])
	}, (results) => {
		users.updateInitialCardState(userId, results.insertId, (results1) => {
			callback(results1);
		});
	});

	// client.runQuery(insertNewCardStateQuery, {
	// 	diamonds: cardsHandler.convertDeckToString(cardDeck['D']),
	// 	spades: cardsHandler.convertDeckToString(cardDeck['S']),
	// 	clubs: cardsHandler.convertDeckToString(cardDeck['C']),
	// 	hearts: cardsHandler.convertDeckToString(cardDeck['H'])
	// }, (results, fields) => {
	// 	client.runQuery(updateUsersWithGameState, {
	// 		initialCardState: results.insertId,
	// 		userId: userId
	// 	}, (results1, fields1) => {
	// 		callback(results1);
	// 	});
	// });
}

users.getUserInfo = function(userId, callback) {
	client.runQuery(userInfoQuery, {
		userId: userId
	}, (results, fields) => {
		callback(results);
	});
}

users.updateInitialCardState = function(userId, initialCardStateId, callback) {
	client.runQuery(updateInitialCardStateQuery, {
		userId: userId,
		initialCardStateId: initialCardStateId
	}, (results, fields) => {
		callback(results);
	});
}

users.insertNewCardState = function(cardDeck, callback) {
	client.runQuery(insertNewCardStateQuery, cardDeck, (results, fields) => {
		callback(results);
	});
}

console.log(users);

module.exports = users;

