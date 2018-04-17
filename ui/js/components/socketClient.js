import io from 'socket.io-client';

class SocketClient {
	constructor() {
		this.endPoint = "http://35.200.156.243:9000";
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