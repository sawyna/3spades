import React from 'react';
import playerStore from './PlayerStore';
import playerActions from './PlayerActions';
import GameDetails from '../gamedetails/GameDetails';

export default class PlayerList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			players: [],
			startGameEnabled: false
		};
	}

	componentWillMount() {
		playerStore.on("change", () => {
			this.setState((state, props) => {
				return {
					players: playerStore.getAllPlayers(),
					startGameEnabled: playerStore.getStartGameEnabled()
				};
			});
		});
	}

	startGame() {
		playerActions.startGame();
	}

	render() {
		var style = {
			"width": this.props.width,
			"display": "inline-block",
			"verticalAlign": "top"
		};
		var playerList = [];
		for(let i = 0; i < this.state.players.length; i++) {
			playerList.push(<li key = {i}> {this.state.players[i] }</li>)
		}

		return (
			<div style = {style}>
				<h1>Players in the game</h1>
				<ul>
					{ playerList }
				</ul>
				<button disabled = {!this.state.startGameEnabled} onClick = {this.startGame.bind(this)}>Start Game</button>
			</div>
		);
	}
}