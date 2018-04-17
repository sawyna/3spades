var infoMap = {};


/**
	Assuming gameId, userId are all strings passed
*/
module.exports = {

	initGameStorage: function(gameId) {
		if(!infoMap.hasOwnProperty(String(gameId))) {
			infoMap[String(gameId)] = {
				"sockets": {},
				"roundOperator": ""
			};
		}
	},

	putRoundOps: function(gameId, roundOperatorInstance) {
		this.initGameStorage(gameId);
		infoMap[String(gameId)].roundOperator = roundOperatorInstance;
	},

	getRoundOps: function(gameId) {
		if(infoMap[String(gameId)])
			return infoMap[String(gameId)].roundOperator;

		return undefined;
	},

	putSocket: function(gameId, userId, socket) {
		this.initGameStorage(gameId);
		console.log(infoMap);
		infoMap[String(gameId)].sockets[String(userId)] = socket;
	},

	getSocket: function(gameId, userId) {
		gameId = String(gameId);
		userId = String(userId);
		if(infoMap[gameId] && infoMap[gameId]["sockets"] && infoMap[gameId]["sockets"][userId])
			return infoMap[gameId]["sockets"][userId];

		return undefined;
	},

	deleteGame: function(gameId) {
		delete infoMap[String(gameId)];
	}
};