import socketClient from '../../socketClient';
import gameStore from '../../GameStore';

class GameDetailsActions {

	chosePartners(partnerInfo) {
		socketClient.send("HUKUM_PARTNERS_CHOSEN", {
			gameId: gameStore.data.gameId,
			partnerInfo: partnerInfo
		});
	}
}

export default new GameDetailsActions();