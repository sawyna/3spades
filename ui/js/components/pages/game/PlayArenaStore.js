import { EventEmitter } from 'events';
import socketClient from '../../socketClient';
import apiClient from '../../apiClient';
import gameStore from '../../GameStore';
import dispatcher from '../../core/dispatcher';

class PlayArenaStore extends EventEmitter {
	constructor() {
		super();
		this.userInfo = {};
		this.cards = {};
		this.enablePlay = false;
		this.handleSocketEvents();
	}

	handleSocketEvents() {
		socketClient.listen("GAME_STARTED", (data) => {
			console.log("Received game started event in PlayArenaStore");
			apiClient.get(`/userInfo/${gameStore.data.user.id}/all`, (err, results, body) => {
				console.log(body);
				this.userInfo = body;
				this.createCardsArray();
				this.emit("change");
			});
		});

		socketClient.listen("ROUND_TURN_START", (data) => {
			console.log(data);
			if(data.playerList[data.currTurnIdx].userId === gameStore.data.user.id) {
				this.enablePlay = true;
				this.emit("change");
			}
		});
	}

	getCardsArray() {
		return this.cards;
	}

	createCardsArray() {
		var deck = {
			diamonds: [],
			spades: [],
			clubs: [],
			hearts: []
		};

		console.log(this.userInfo);

		for(let i = 0; i < this.userInfo.diamonds.length; i++) {
			deck.diamonds.push(parseInt(this.userInfo.diamonds[i]));
		}

		for(let i = 0; i < this.userInfo.clubs.length; i++) {
			deck.clubs.push(parseInt(this.userInfo.clubs[i]));
		}

		for(let i = 0; i < this.userInfo.spades.length; i++) {
			deck.spades.push(parseInt(this.userInfo.spades[i]));
		}

		for(let i = 0; i < this.userInfo.hearts.length; i++) {
			deck.hearts.push(parseInt(this.userInfo.hearts[i]));
		}

		this.cards = deck;
	}

	getEnablePlay() {
		return this.enablePlay;
	}

	handleActions(action) {
		switch(action.type) {
			case "CARD_PLAYED" :  {
				this.enablePlay = false;
				this.cards[action.data.card.cardType][action.data.card.cardNum] = 0;
				this.emit("change");
			}
		}
	}
}

const playArenaStore = new PlayArenaStore();
dispatcher.register(playArenaStore.handleActions.bind(playArenaStore));
export default playArenaStore;