var async = require('async');
var games = require('../db/queries/games');

module.exports = function(gameId, callback) {
	var roundInfo = {};
	var roundCount = 13;
	var roundStore = {
		getInfo: function() {
			return roundInfo;
		},

		reset: function() {
			roundInfo.first = true;
			roundInfo.last = false;
			roundInfo.playerList.map((elem, index) => {
				if(elem.userId === roundInfo.winner.userId)
					roundInfo.startIdx = index;		
			});
			roundInfo.winner = {};
			roundInfo.currentDeck = [];
		},

		advanceRound: function(data) {
			if(roundInfo.first) {
				roundInfo.winner = {
					userId: data.userInfo.userId,
					card: data.card
				};
				roundInfo.first = false;
			}
			else {
				if(data.card.cardType === roundInfo.winner.card.cardType && data.card.cardNum > roundInfo.winner.card.cardNum) {
					roundInfo.winner = {
						userId: data.userInfo.userId,
						card: data.card
					};
				}
				else if(data.card.cardType !== roundInfo.winner.card.cardType && data.card.cardType === roundStore.hukum) {
					roundInfo.winner = {
						userId: data.userInfo.userId,
						card: data.card
					};
				}
			}

			roundInfo.currentDeck.push({
				card: data.card,
				userId: data.userInfo.userId
			});
		},

		incrementTurn: function() {
			roundInfo.currTurnIdx++;
			if(roundInfo.currTurnIdx === roundInfo.playerList.length)
					roundInfo.currTurnIdx = 0;

			var endIdx = (roundInfo.startIdx === 0) ? (roundInfo.playerList.length - 1) : (roundInfo.startIdx - 1);
			if(roundInfo.currTurnIdx === endIdx) {
				roundInfo.last = true;
			}
		},

		isDone: function() {
			roundCount--;
			if(roundCount === 0)
				return true;

			return false;
		},

		//TODO
		getWinnerInfo: function() {
			return {};
		}
	};

	async.parallel({
		playerList: function(callback) {
			games.getAllPlayers(gameId, (results, fields) => {
				callback(null, results.map((element) => {
					return {
						userId: element.id,
						userName: element.name
					};
				}));
			});
		},
		hukum: function(callback) {
			games.getHukum(gameId, (results) => {
				callback(null, results[0].hukum);
			});
		},
		bidWinner: function(callback) {
			games.getBidWinner(gameId, (results) => {
				callback(null, results[0].bid_winner);
			});
		}
	},
	(err, results) => {
		var startIdx;
		console.log(results);
		results.playerList.forEach((elem, index) => {

			if(elem.userId === results.bidWinner) {
				console.log(index);
				startIdx = index;
			}
		});

		roundInfo = {
			playerList: results.playerList,
			startIdx: startIdx,
			currTurnIdx: startIdx,
			first: true,
			last: false,
			activeSuit: "",
			winner: {},
			currentDeck: [],
			hukum: results.hukum
		};

		callback(roundStore);
	});
}