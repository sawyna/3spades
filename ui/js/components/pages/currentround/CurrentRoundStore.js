import {EventEmitter} from "events";
import socketClient from '../../socketClient';
import dispatcher from '../../core/dispatcher';

class CurrentRoundStore extends EventEmitter {
	constructor() {
		super();
		this.handleSocketEvents();
		this.cards = this.getInitialCards();
	}

	getInitialCards() {
		return {
			"spades": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			"clubs": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			"hearts": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			"diamonds": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		};
	}

	getCards() {
		return this.cards;
	}

	addCard(card) {
		this.cards[card.cardType][card.cardNum] = 1;
		this.emit("change");
	}

	handleSocketEvents() {
		socketClient.listen("ROUND_TURN_END", (data) => {
			var cards = this.getInitialCards();
			data.currentDeck.forEach((elem) => {
				console.log(elem);
				cards[elem.card.suit][elem.card.num] = 1;
			});
			this.cards = cards;
			this.emit("change");
		});

		socketClient.listen("ROUND_WINNER", (data) => {
			this.cards = this.getInitialCards();
			this.emit("change");
		});
	};
}

const currentRoundStore = new CurrentRoundStore();
window.currentRoundStore = currentRoundStore;
export default currentRoundStore;