import io from 'socket.io-client';
import Config from 'AppConfig';

class SocketClient {
	constructor() {
		this.endPoint = Config.serverUrl;
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