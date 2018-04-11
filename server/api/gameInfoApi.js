var express = require('express');
var router = express.Router();

var games = require('../db/queries/games');
var users = require('../db/queries/users');

router.get('/:gameId/allusers', function(req, res) {
	games.getAllPlayers(req.params.gameId)
	.then((results) => {
		res.send(results);
	})
	.catch((err) => {
		console.log(err);
		res.status(500).json({
			"message": "Unexpected internal error occurred"
		});
	});
});

module.exports = router;
