var customError = require('./CustomError');

module.exports = {
	createApiError: function(message, errorCode, status) {
		var apiError = new customError({
			"type": "APIError",
			"message": message,
			"errorCode": errorCode
		});

		console.log(apiError.stack);

		apiError.status = ( status || 500);
		return apiError;
	},

	createSocketError: function(message, errorCode, status) {
		return new customError({
			"type": "SocketError",
			"message": message,
			"errorCode": errorCode
		});
	}
}