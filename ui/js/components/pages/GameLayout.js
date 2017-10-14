import React from 'react';
import PlayArena from './game/PlayArena';
import GameInfo from './gameinfo/GameInfo';
import CurrentRound from './currentround/CurrentRound';
import BiddingArea from './bidding/BiddingArea';
import Chat from './chat/Chat';
import socketClient from '../socketClient';

export default class GameLayout extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			gameStarted: false
		};
	}

	componentDidMount() {
		socketClient.listen("BID_END", () => {
			this.setState({
				gameStarted: true
			});
		});
	}

	render() {

		var leftStyle = {
			float: "left",
			overflow: "hidden",
			"width": "70%"
		};

		var rightStyle = {
			// float: "left",
			overflow: "hidden",
			"width": "30%"
		};

		return (
				<div>
					<div style = {leftStyle}>
						<PlayArena height = "50%"/>
						{ this.state.gameStarted  ? <CurrentRound height = "50%"/> : <BiddingArea height = "50%"/> }
					</div>
					<div style = {rightStyle}>
						<GameInfo />
						<Chat/>
					</div>
				</div>
				
			);
	}
}