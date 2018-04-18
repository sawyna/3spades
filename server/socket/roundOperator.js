var async = require('async');
var games = require('../db/queries/games');
var inMemory = require('./inMemoryStorage');

var RoundOperator = function(gameId, playerList, hukum, bidWinner) {
	inMemory.putRoundOps(String(gameId), this);

	//store all private methods and variables in this object
	var _ = {};

	_.initRoundInfo = function(playerList, hukum, firstPlayerId) {
		_.roundInfo = {
			playerList: playerList,
			startIdx: undefined,
			currTurnIdx: undefined,
			first: true,
			last: false,
			activeSuit: undefined,
			winner: {},
			currentDeck: [],
			hukum: hukum,
			roundSize: playerList.length,
			roundCount: 1
		};

		_.decideFirstPlayer(firstPlayerId);
	}

	_.updateWinner = function(data) {
		if(_.roundInfo.first) {
			_.roundInfo.winner = {
				userId: data.userId,
				card: data.card
			};
			_.updateActiveSuit(data);
		}
		else {
			if(_.roundInfo.winner.card.suit === _.roundInfo.hukum) {
				if(data.card.suit === _.roundInfo.hukum && data.card.num > _.roundInfo.winner.card.num) {
					_.roundInfo.winner = {
						userId: data.userId,
						card: data.card
					};
				}
			}
			else {
				if(data.card.suit === _.roundInfo.hukum) {
					_.roundInfo.winner = {
						userId: data.userId,
						card: data.card
					};	
				}
				else if(data.card.suit === _.roundInfo.winner.card.suit && data.card.num > _.roundInfo.winner.card.num) {
					_.roundInfo.winner = {
						userId: data.userId,
						card: data.card
					};
				}
			}
		}
	}

	_.incrementTurn = function() {
		_.roundInfo.first = false;
		_.roundInfo.currTurnIdx++;
		if(_.roundInfo.currTurnIdx === _.roundInfo.playerList.length)
				_.roundInfo.currTurnIdx = 0;

		var endIdx = (_.roundInfo.startIdx === 0) ? (_.roundInfo.playerList.length - 1) : (_.roundInfo.startIdx - 1);
		if(_.roundInfo.currTurnIdx === endIdx) {
			_.roundInfo.last = true;
		}

		_.safeDecrement();
	}

	_.safeDecrement = function() {
		if(_.roundInfo.roundSize <= 0) {
			//throw error
		}

		--_.roundInfo.roundSize;
	}

	_.updateActiveSuit = function(data) {
		_.roundInfo.activeSuit = data.card.suit;
	}

	_.decideFirstPlayer = function(firstPlayerId) {
		var startIdx;
		_.roundInfo.playerList.forEach((element, index) => {
			if(String(element.id) === String(firstPlayerId)) {
				startIdx = index;
			}
		});


		console.log(_.roundInfo.startIdx);
		console.log(_.roundInfo.currTurnIdx);
		_.roundInfo.startIdx = startIdx;
		_.roundInfo.currTurnIdx = startIdx;
	}

	this.getCurrentDeck = function() {
		return _.roundInfo.currentDeck;
	}

	this.getWinner = function() {
		return _.roundInfo.winner;
	}

	this.getActiveSuit = function() {
		return _.roundInfo.activeSuit;
	}

	this.playTurn = function(data) {

		if(this.isDone()) {
			//throw error
		}

		_.roundInfo.currentDeck.push({
			userId: data.userId,
			card: data.card
		});

		_.updateWinner(data);
		_.incrementTurn();
	}

	this.reset = function(firstPlayerId) {
		_.roundInfo.first = true;
		_.roundInfo.last = false;
		_.roundInfo.activeSuit = undefined;
		_.roundInfo.winner = {};
		_.roundInfo.currentDeck = [];
		_.roundInfo.hukum = hukum;
		_.roundInfo.roundSize = playerList.length;
		_.roundInfo.roundCount++;

		_.decideFirstPlayer(firstPlayerId);
	}

	this.isDone = function() {
		if(_.roundInfo.roundSize === 0)
			return true;

		return false;
	}

	this.isLast = function() {
		return _.roundInfo.last;
	}

	this.isFirst = function() {
		return _.roundInfo.first;
	}

	this.getCurrentPlayerId = function() {
		return _.roundInfo.playerList[_.roundInfo.currTurnIdx].id;
	}

	this.getHukum = function() {
		return _.roundInfo.hukum;
	}

	this.getRoundNumber = function() {
		return _.roundInfo.roundCount;
	}

	//TODO remove this before deploying
	this.print = function() {
		console.log(_.roundInfo);
	}

	/**
		initialization logic
	**/

	_.initRoundInfo(playerList, hukum, bidWinner);
 }

/*
	load method returns an instance of roundOperator in the callback after initialization
*/

RoundOperator.load = function(gameId, callback) {
	let promiseArray = [];
	promiseArray.push(games.getAllPlayers(gameId));
	promiseArray.push(games.getHukum(gameId));
	promiseArray.push(games.getBidWinner(gameId));

	return Promise.all(promiseArray)
	.then((values) => {
		return new RoundOperator(gameId, values[0], values[1], values[2]);
	})
	.then((roundOperatorInstance) => {
		callback(roundOperatorInstance);
	})
	.catch((err) => {
		//TODO call the error Handler
	});
}


/*
	Exposing only load method
*/

module.exports = {
	load: RoundOperator.load
};