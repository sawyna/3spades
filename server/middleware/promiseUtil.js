module.exports = {
	create: function(callback) {
		return new Promise((resolve, reject) => {
			callback(resolve, reject);
		});
	}
}