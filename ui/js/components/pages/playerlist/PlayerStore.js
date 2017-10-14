import { EventEmitter } from 'events';
import dispatcher from '../../core/dispatcher';
import gameStore from '../../GameStore';
import socketClient from '../../socketClient';

class PlayerStore extends EventEmitter {
	constructor() {
		super();
		this.players = [];
		this.startGameEnabled = false;
		this.handleSocketEvents();
	}

	updatePlayers(callback) {
		gameStore.getAllUsers((response) => {
			var newPlayers = [];
			response.forEach((element) => {
				newPlayers.push(element.userName);
			});
			this.players = newPlayers;
			this.startGameEnabled = ((this.players.length) >= 4 ? true : false);
			callback();
		});
	}

	handleActions(action) {
		switch(action.type) {
			case "NEW_PLAYER_JOINED" : {
				this.updatePlayers();
				this.emit("change");
			}
		}
	}

	handleSocketEvents() {
		socketClient.listen("NEW_PLAYER_JOINED", (data) => {
			console.log("Received new player joined");
			this.updatePlayers(() => {
				this.emit("change");	
			});
		});

		socketClient.listen("GAME_STARTED", (data) => {
			this.startGameEnabled = false;
			this.emit("change");
		});
	}

	getAllPlayers() {
		return this.players;
	}

	getStartGameEnabled() {
		return this.startGameEnabled;
	}
}

const playerStore = new PlayerStore();
dispatcher.register(playerStore.handleActions.bind(this));
export default playerStore;