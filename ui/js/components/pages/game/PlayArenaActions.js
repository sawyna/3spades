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

		socketClient.send("ROUND_TURN_PLAYED", {
			gameId: gameStore.data.gameId,
			userId: gameStore.data.user.id,
			card: {
				"num": card.cardNum,
				"suit": card.cardType
			}
		});
	}
}

export default new PlayArenaActions();