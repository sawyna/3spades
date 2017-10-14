import socketClient from '../../socketClient';
import gameStore from '../../GameStore';

class PlayerActions {
	startGame() {
		socketClient.send("START_GAME", {
			gameId: gameStore.data.gameId
		});
	}
}

export default new PlayerActions();