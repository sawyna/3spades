import io from 'socket.io-client';

class SocketClient {
	constructor() {
		this.endPoint = "http://localhost:9000";
		this.socket = io(this.endPoint);
	}

	listen(messageId, callback) {
		this.socket.on(messageId, (data) => {
			callback(data);
		});
	}

	send(messageId, data) {
		this.socket.emit(String(messageId), data);
	}
}

const socketClient = new SocketClient();
export default socketClient;