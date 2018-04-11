var express = require('express');
var router = express.Router();

var games = require('../db/queries/games');
var users = require('../db/queries/users');

router.get('/:userId/all', function(req, res) {
	let userId = req.params.userId;

	console.log(`UserId received ${userId}`);
	users.getUserInfo(userId)
	.then((results) => {
		if(results.length > 0) {
			res.send(results[0]);
		}
		else {
			res.status(500).json({
				"message": `No user found with id: ${req.params.userId}`
			});
		}
	})
	.catch((err) => {
		res.status(500).json({
			"message": "Unexpected internal error occurred"
		});
	});
});

module.exports = router;