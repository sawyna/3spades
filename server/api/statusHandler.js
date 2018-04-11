module.exports = {
	handle: function (error, response) {
		response.status(error.status).json({
			"message": error.message
		});
	}
}