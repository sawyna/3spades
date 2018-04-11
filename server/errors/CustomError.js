var util = require('util');

var CustomError = function (settings) {

	settings = (settings || {});

	this.name = "CustomError";

	this.type = (settings.type || "Application");
	this.message = (settings.message || "Error occurred");
	this.errorCode = (settings.errorCode || "DEFAULT");
	Error.captureStackTrace(this);
};

util.inherits(CustomError, Error);

module.exports = CustomError;