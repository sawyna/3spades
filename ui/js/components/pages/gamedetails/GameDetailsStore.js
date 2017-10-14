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

}

const gameDetailsStore = new GameDetailsStore();
export default gameDetailsStore;