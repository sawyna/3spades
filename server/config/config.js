var isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	dbConfig: {
		host: "localhost",
		port: isProduction ? 3306: 3307,
		user: "sawyna",
		password: "yaswanth",
		database: "3spades"
	},

	gameConfig: {
		gameStates: {
			GAME_INIT: -2,
			GAME_START: -1,
			BID_END: 0,
			WINNER_CHOOSE: 1
		},
		MAX_PLAYERS: 7,
		MIN_PLAYERS: 4,
		BID_COUNTDOWN: 10
	}
};


// {
// 	playerList: [],
// 	activeSuit: "",
// 	first: true,
// 	last: true,
// 	winner: {
// 		userId: 123,
// 		card: {
// 			suit: 
// 			number:
// 		}
// 	},
// 	currTurnIdx: 
// }