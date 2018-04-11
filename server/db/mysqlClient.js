var db = require('./mysqlConnect');
var format = require('string-format');

module.exports = {
	runQuery : function(queryTemplate, input) {
		var query = format(queryTemplate, input);
		console.log(query);
		return new Promise((resolve, reject) => {
			db.execute(query)
			.then(function(results, fields) {
				resolve(results, fields);
			})
			.catch(function(error) {
				reject(error);
			});
		});

		// db.execute(query, function(err, results, fields) {
		// 	if(err) {
		// 		console.log("Unexpected error occured from db");
		// 	}
			
		// 	callback(results, fields);
			
		// });
	}
}