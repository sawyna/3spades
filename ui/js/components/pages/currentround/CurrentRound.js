import React from 'react';
import CardDeck from '../game/CardDeck';
import currentRoundStore from './CurrentRoundStore';

export default class CurrentRound extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cards: currentRoundStore.getCards()
		};
		this.store = {};
	}

	clickedCard(card) {
		//NOOP
	}

	componentDidMount() {
		currentRoundStore.on("change", () => {
			this.setState({
				cards: currentRoundStore.getCards()
			});
		});
	}

	render() {
		var style = {
			"height": this.props.height,
			"margin": "0"
		};

		return (
				<div style = {style}>
					<CardDeck cards = {this.state.cards} clickedCard = {this.clickedCard.bind(this)}/>
				</div>
			);
	}
}