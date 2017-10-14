var db = require('./mysqlConnect');
var format = require('string-format');

module.exports = {
	runQuery : function(queryTemplate, input, callback) {
		var query = format(queryTemplate, input);
		console.log(query);
		db.execute(query, function(results, fields) {
			callback(results, fields);
		});
	}
}