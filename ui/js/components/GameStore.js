import api from './apiClient';

class GameStore {
	constructor() {
		this.data = {};
	}

	setUser(userInfo) {
		this.data.user = {
			"id": userInfo.id,
			"name": userInfo.name
		};
	}

	setGameId(gameId) {
		this.data.gameId = gameId;
	}

	getAllUsers(callback) {
		api.get(`/gameInfo/${this.data.gameId}/allusers`, (err, res, body) => {
			if(err) {
				console.log(err);
				console.log("Failed to fetch users in the game");
			}
			else {
				var response = [];
				body.forEach((element) => {
					response.push({
						userId: element.id,
						userName: element.name
					});
				});
				callback(response);
			}
		});
	}
}

var gameStore = new GameStore();
window.gameStore = gameStore;

export default gameStore;