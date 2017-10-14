var syncTimers = {
	bidTimer: function(io, socket, initialCountDown, roomId, timerEvent, resetEvent, endEvent) {
		var countDown = initialCountDown;
		var intervalTimer = setInterval(() => {
			if(countDown === 0) {
				clearInterval(intervalTimer);
				io.sockets.in(String(roomId)).emit(endEvent, {});
				return;
			}

			io.sockets.in(String(roomId)).emit(timerEvent, {
				countDown: countDown--
			});	
		}, 1000);


		var clients = io.sockets.adapter.rooms[String(roomId)].sockets;
		var clientSocket;

		for(var clientId in clients) {
			clientSocket = io.sockets.connected[clientId];
			
			clientSocket.on(resetEvent, (data) => {
				if(String(data.gameId) === String(roomId)) {
					countDown = initialCountDown;
				}
			});
		}
	}
};

module.exports = syncTimers;