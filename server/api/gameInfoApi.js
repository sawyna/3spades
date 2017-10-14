var express = require('express');
var router = express.Router();

var games = require('../db/queries/games');
var users = require('../db/queries/users');

router.get('/:gameId/allusers', function(req, res) {
	games.getAllPlayers(req.params.gameId, function(results) {
		console.log(results);
		res.send(results);
	});
});

module.exports = router;
