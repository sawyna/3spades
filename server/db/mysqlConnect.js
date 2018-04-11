var mysql = require('mysql');
var dbconfig = require('../config/config').dbConfig;

var DB = {};
module.exports = DB;

// DB.execute = function(query, callback) {
// 	var connection = mysql.createConnection(dbconfig);
// 	connection.query(query, function(error, results, fields) {
// 		if(error) {
// 			console.log("Error from db");
// 			console.log(error);
// 			callback(error, null, null);
// 		}
// 		else {
// 			callback(null, results, fields);
// 		}
// 	});
// 	connection.end();
// }


/*
	TODO move to promise based approach
*/
DB.execute = function(query) {
	return new Promise((resolve, reject) => {
		var connection = mysql.createConnection(dbconfig);
		connection.query(query, function(error, results, fields) {
			if(error) {
				console.log("Error from db");
				console.log(error);
				reject(error);
			}
			else {
				resolve(results, fields);
			}
		});
		connection.end();
	});
}