import {EventEmitter} from "events";
import dispatcher from '../../core/dispatcher';
import socketClient from '../../socketClient';
import gameStore from '../../GameStore';

class BiddingStore extends EventEmitter {
	constructor() {
		super();
		this.biddings = [];
		this.disableBidding = true;
		this.maxBidding = {
			"bid": 0,
			"userId": -1
		};
		this.handleSocketEvents();
	}

	getAll() {
		return this.biddings;
	}

	getDisableBidding() {
		return this.disableBidding;
	}

	addBidding(user, bidValue) {
		this.biddings.push({
			"user": user.name,
			"value": bidValue
		});

		if(bidValue > this.maxBidding.bid) {
			this.maxBidding.bid = bidValue;
			this.maxBidding.userId = user.id;
			this.maxBidding.userName = user.name;
			//dispatcher.dispatch("BID_WINNER", this.maxBidding);
		}
		this.emit("change");
	}

	handleActions(action) {
		var type = action.type;
		switch(action.type) {
			case "ADD_BID" :  {
				this.addBidding(action.payload.user, action.payload.bidValue);
			}
		}
	}

	handleSocketEvents() {
		socketClient.listen("BID_ADDED", (data) => {
			console.log("Received a message from server");
			this.addBidding(data.metaData.user, data.payload.bidValue);
		});

		socketClient.listen("BID_END", (data) => {
			this.disableBidding = true;
			socketClient.send("BID_WINNER", {
				bidding: this.maxBidding,
				gameId: gameStore.data.gameId	
			});
			this.emit("change");
		});

		socketClient.listen("GAME_STARTED", (data) => {
			this.disableBidding = false;
			this.emit("change");
		});
	}
}

const biddingStore = new BiddingStore();
dispatcher.register(biddingStore.handleActions.bind(biddingStore));

export default biddingStore;