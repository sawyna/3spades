var express = require('express');
var router = express.Router();

var games = require('../db/queries/games');
var users = require('../db/queries/users');

router.get('/:userId/all', function(req, res) {
	users.getUserInfo(req.params.userId, function(results) {
		if(results.length > 0) {
			res.send(results[0]);
		}
		else {
			
			console.log(results);
			res.status(500).json({
				"message": `No user found with id: ${req.params.userId}`
			});
		}
	})
});

module.exports = router;