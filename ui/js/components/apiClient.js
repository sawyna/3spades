import API from 'fetch-api';

class APIClient {
	constructor() {
		this.baseURL = "http://35.200.156.243:9000";
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