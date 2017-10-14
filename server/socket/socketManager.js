var events = require('./socketEvents');
var manager = {};
module.exports = manager;

manager.connector = function(io) {
	io.on('connect', (socket) => {
		console.log("New client connected");
		socket._appdata = {};
		events.bidEvents(io, socket);
		events.joinHostEvents(io, socket);
		events.gameEvents(io, socket);
		events.roundEvents(io, socket);
	});
}
