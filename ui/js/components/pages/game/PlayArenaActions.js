import socketClient from '../../socketClient';
import dispatcher from '../../core/dispatcher';
import gameStore from '../../GameStore';


class PlayArenaActions {

	play(card) {
		dispatcher.dispatch({
			type: "CARD_PLAYED",
			data: {
				card: card
			}
		});
		socketClient.send("ROUND_TURN_DONE", {
			gameId: gameStore.data.gameId,
			userInfo: {
				userId: gameStore.data.user.id
			},
			card: card
		});
	}
}

export default new PlayArenaActions();