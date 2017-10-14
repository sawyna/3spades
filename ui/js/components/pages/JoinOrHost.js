import React from 'react';
import apiClient from '../apiClient';
import socketClient from '../socketClient';
import gameStore from '../GameStore';

export default class JoinOrHost extends React.Component {

	constructor() {
		super();
		this.state = {
			userName: "<Empty>"
		};
	}

	handleJoinGameClick(userName, gameId) {
		var that = this;
		console.log("Join Game clicked");
		console.log(userName);
		const url = `/game/join?userName=${userName}&gameId=${gameId}`;
		apiClient.get(url, function(err, res, body) {
			if(res.status === 200) {

				gameStore.setUser({
					"id": body.userId,
					"name": userName
				});
				gameStore.setGameId(body.gameId);
				socketClient.send("NEW_PLAYER", gameStore.data);
				that.props.router.push(`game/${body.gameId}`);
			}
			else {
				console.log(body);
			}

		});
	}

	handleHostGameClick(userName) {
		var that = this;
		console.log("Host Game clicked");
		console.log(userName);
		const url = `/game/host?userName=${userName}`;
		apiClient.get(url, function(err, res, body) {
			if(err) {
				console.log(err);
				console.log("Unable to host a game");
				return;
			}

			gameStore.setUser({
				"id": body.userId,
				"name": userName
			});

			gameStore.setGameId(body.gameId);
			socketClient.send("NEW_PLAYER", gameStore.data);

			that.props.router.push(`game/${body.gameId}`);
		});
	}

	handleOnChange(e) {
		this.setState({
			userName: e.target.value
		});
	}

	handleOnChangeGameId(e) {
		this.setState({
			gameId: e.target.value
		});
	}


	render() {

		return (
			<div>
				<input type = "text" onChange = {this.handleOnChange.bind(this)} placeholder = {"Enter userHandle"}/>
				<button onClick = {this.handleJoinGameClick.bind(this, this.state.userName, this.state.gameId)}>Join a game</button>
				<button onClick = {this.handleHostGameClick.bind(this, this.state.userName)}>Host a game</button>
				<input type = "text" onChange = {this.handleOnChangeGameId.bind(this)} placeholder={"Enter the gameId"}/>
			</div>
			);
	}
}