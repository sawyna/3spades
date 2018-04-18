import socketClient from '../../socketClient';
import { EventEmitter } from 'events';
import gameStore from '../../GameStore';

class GameDetailsStore extends EventEmitter {

	constructor() {
		super();
		this.handleSocketEvents();
		this.bidWinner = {
			id: "",
			"name": ""
		};
		this.choosing = {
			enable: false
		};
		
		this.partnerInfo = {};
		this.roundWinners = [];
	}

	handleSocketEvents() {
		socketClient.listen("HUKUM_PARTNERS", (data) => {
			this.bidWinner.id = data.bidWinner.id;
			this.bidWinner.name = data.bidWinner.name;
			this.bidWinner.value = data.bidWinner.value;
			if(this.bidWinner.id === gameStore.data.user.id)
				this.choosing.enable = true;
			this.emit("change");
		});

		socketClient.listen("HUKUM_PARTNERS_RESULT", (data) => {
			this.partnerInfo = data.partnerInfo;
			this.emit("change");
		});

		socketClient.listen("ROUND_WINNER", (data) => {
			this.roundWinners.push(data);
			this.emit("updateWinners");
		});
	}

	getBidWinnerInfo() {
		return this.bidWinner;
	}

	getEnable() {
		return this.choosing.enable;
	}

	disableChoosing() {
		this.choosing.enable = false;
	}

	getPartnerInfo() {
		return this.partnerInfo;
	}

	getRoundWinners() {
		return this.roundWinners;
	}

}

const gameDetailsStore = new GameDetailsStore();
export default gameDetailsStore;