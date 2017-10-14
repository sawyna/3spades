import React from 'react';
import CardDeck from './CardDeck';
import playArenaStore from './PlayArenaStore';

export default class PlayArena extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cards: {
				diamonds: [],
				clubs: [],
				hearts: [],
				spades: []
			}
		};
	}

	componentDidMount() {
		playArenaStore.on("change", () => {
			this.setState({
				cards: playArenaStore.getCardsArray()
			});
		});
	}

	playCard(card) {

	}

	render() {
		var style = {
			"height": this.props.height,
			"display": "inline-block",
			"margin": "0"
		};
		return (
		<div style = {style}>
			<CardDeck cards = {this.state.cards} onSelect = {this.playCard.bind(this)}/>
			<button>play</button>
		</div>
		);
	}
}