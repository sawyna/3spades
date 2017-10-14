import {EventEmitter} from "events";
import socketClient from '../../socketClient';

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

	handleSocketEvents() {

	}
}

const currentRoundStore = new CurrentRoundStore();
export default currentRoundStore;