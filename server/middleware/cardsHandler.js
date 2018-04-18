var util = require('./commonUtil');
var randomNumber = require("random-number");
var handler = {};
module.exports = handler;

// [
// 	{
// 		userId: 1234,
// 		deck: [
// 			{
// 				value: 2,
// 				suit: 'A'
// 			}
// 		];
// 	},
// 	{},

// ]

var NormalToDBMapping = {
	'-1': "0000000000000",
	'2':  "1000000000000",
	'3':  "0100000000000",
	'4':  "0010000000000",
	'5':  "0001000000000",
	'6':  "0000100000000",
	'7':  "0000010000000",
	'8':  "0000001000000",
	'9':  "0000000100000",
	'10': "0000000010000",
	'J':  "0000000001000",
	'Q':  "0000000000100",
	'K':  "0000000000010",
	'A':  "0000000000001"	
};

var scores = {
	"3": 5,
	"8": 10,
	"9": 15,
	"10": 20,
	"11": 25,
	"12": 30
};

/**
	card : {
		num: <1 to 13>
		suit: <D, C, H, S>
	}
**/
handler.isSpecialCard = function(card) {
	if(card.num === 1 && card.suit === 'spades')
		return true;

	return false;
}

handler.generateInitialDeck = function(users) {
	var values = [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
	var suits = ['D', 'H', 'C', 'S'];
	var usersCount = users.length;
	var cardCount = 52;
	if(usersCount === 5)
		cardCount = 50;
	else if(usersCount === 6 || usersCount === 8)
		cardCount = 48;
	else if (usersCount === 7)
		cardCount = 49;

	console.log(cardCount);
	for(let i = 0; i < users.length; i++) {
		users[i].deck = [];
	}

	var temp = [];
	for(let i = 0; i < cardCount; i++) {
		temp.push(i);
	}

	util.createARandomArray(temp, cardCount, 10);
	console.log(temp);

	var j = 0;
	for(let i = cardCount - 1; i >= 0; i--) {
		users[j].deck.push({
			value: values[temp[i] % 13],
			suit: suits[Math.floor(temp[i] / 13)]
		});
		j++;
		if(j === usersCount)
			j = 0;
	}

	var cards;
	console.log("here");
	for(let i = 0; i < users.length; i++) {
		//console.log(users[i]);
		cards = {};
		for(let j = 0; j < 4; j++)
			cards[suits[j]] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		for(let j = 0; j < users[i].deck.length; j++) {
			cards[users[i]["deck"][j].suit][users[i]["deck"][j].value - 2] = 1;
		}
		users[i].cards = cards;
		console.log(cards);
	}

	return users;

}

handler.convertDeckToString = function(cardArr) {
	var cardString = "";
	for(let i = 0; i < cardArr.length; i++) {
		cardString += String(cardArr[i]);
	}
	return cardString;
}

handler.convertStringToDeck = function(cardString) {
	var cardArr = [];
	for(let i = 0; i < cardString.length; i++) {
		cardArr.push(cardString[i]);
	}
	return cardArr;
}

handler.createDBFormatFromCard = function(card) {
	if(NormalToDBMapping.hasOwnProperty(card))
		return NormalToDBMapping[card];

	return "NA";
}

/*
	If callback is not passed, empty card deck is returned by default
*/
handler.createCardDeck = function(callback) {
	var emptyCardDeck = {
		diamonds: handler.createDBFormatFromCard('-1'),
		spades: handler.createDBFormatFromCard('-1'),
		clubs: handler.createDBFormatFromCard('-1'),
		hearts: handler.createDBFormatFromCard('-1')
	};


	if(util.isFunction(callback))
		callback(emptyCardDeck);

	return emptyCardDeck;
}

handler.getScore = function(deck) {
	var score = 0;
	deck.forEach((element) => {
		let card =  element.card;
		if(handler.isSpecialCard(card))
			score += 60;
		else if(scores.hasOwnProperty(String(card.num)))
			score += scores[String(card.num)];
	});

	return score;
}


// handler.generateInitialDeck([
// 		{id: 1},
// 		{id: 2},
// 		{id: 3},
// 		{id: 4}
// 	]);