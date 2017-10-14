import dispatcher from '../../core/dispatcher';
import socketClient from '../../socketClient';
import gameStore from '../../GameStore';

class BiddingActions {
	raise(user, bidValue) {
		var message = {
			type: "BID_RAISE",
			metaData: {
				"user": gameStore.data.user,
				"gameId": gameStore.data.gameId
			},
			payload: {
				"bidValue": bidValue
			}
		};
		
		socketClient.send("BID_RAISE", message);
		socketClient.send("BID_TIMER_RESET", {
			gameId: gameStore.data.gameId
		});
	}
}

export default new BiddingActions();