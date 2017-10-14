const path = require('path');
const express = require('express');
var joinHost = require('./api/joinHostApi');
var gameInfo = require('./api/gameInfoApi');
var userInfo = require('./api/userInfoApi');

module.exports = {
	app: function() {
		const app = express();
		var httpServer = require('http').Server(app);
		var io = require('socket.io')(httpServer);
		require('./socket/socketManager').connector(io);

		const indexPath = path.join(__dirname, '/../ui/bundle/index.html');

		app.use(function(req, res, next) {
			res.io = io;
			next();
		});
		app.use(express.static(path.join(__dirname, '../ui/bundle')));
		app.use('/game', joinHost);
		app.use('/gameInfo', gameInfo);
		app.use('/userInfo', userInfo);
		app.get('/', function(req, resp) {
			resp.sendFile(indexPath);
		});
		
		return httpServer;
	}
}