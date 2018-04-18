import API from 'fetch-api';
import Config from 'AppConfig';

class APIClient {
	constructor() {
		this.baseURL = Config.serverUrl;
		this.api = new API({
			baseURI: this.baseURL
		});
	}

	get(uri, callback) {
		this.api.get(uri, (err, res, body) => {
			callback(err, res, body);
		});
	}

	post(uri, callback) {
		this.api.post(uri, (err, res, body) => {
			callback(err, res, body);
		});
	}
}

export default new APIClient();