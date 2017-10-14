var mysql = require('mysql');
var dbconfig = require('../config/config').dbConfig;

var DB = {};
module.exports = DB;

DB.execute = function(query, callback) {
	var connection = mysql.createConnection(dbconfig);
	connection.query(query, function(error, results, fields) {
		if(error) {
			console.log("Error from db");
			console.log(error);
			return;
		}
		callback(results, fields);
	});
	connection.end();
}