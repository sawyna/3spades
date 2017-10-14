import React from 'react';
import PlayerList from '../playerlist/PlayerList';
import GameDetails from '../gamedetails/GameDetails';

export default class GameInfo extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
				<div>
					<PlayerList />
					<GameDetails />
				</div>
			);
	}
}