var infoMap = {};

module.exports = {
	put: function(key, value) {
		infoMap[key] = value;
	},

	get: function(key) {
		return infoMap[key];
	}
};