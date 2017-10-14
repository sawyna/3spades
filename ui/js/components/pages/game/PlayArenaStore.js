import { EventEmitter } from 'events';
import socketClient from '../../socketClient';
import apiClient from '../../apiClient';
import gameStore from '../../GameStore';

class PlayArenaStore extends EventEmitter {
	constructor() {
		super();
		this.userInfo = {};
		this.handleSocketEvents();
	}

	handleSocketEvents() {
		socketClient.listen("GAME_STARTED", (data) => {
			console.log("Received game started event in PlayArenaStore");
			apiClient.get(`/userInfo/${gameStore.data.user.id}/all`, (err, results, body) => {
				console.log(body);
				this.userInfo = body;
				this.emit("change");
			});
		})
	}

	getCardsArray() {
		var deck = {
			diamonds: [],
			spades: [],
			clubs: [],
			hearts: []
		};

		console.log(this.userInfo);

		for(let i = 0; i < this.userInfo.diamonds.length; i++) {
			deck.diamonds.push(this.userInfo.diamonds[i]);
		}

		for(let i = 0; i < this.userInfo.clubs.length; i++) {
			deck.clubs.push(this.userInfo.clubs[i]);
		}

		for(let i = 0; i < this.userInfo.spades.length; i++) {
			deck.spades.push(this.userInfo.spades[i]);
		}

		for(let i = 0; i < this.userInfo.hearts.length; i++) {
			deck.hearts.push(this.userInfo.hearts[i]);
		}

		return deck;
	}
}

const playArenaStore = new PlayArenaStore();

export default playArenaStore;