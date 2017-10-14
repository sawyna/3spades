import React from 'react';
import CardDeck from './CardDeck';
import playArenaStore from './PlayArenaStore';
import playArenaActions from './PlayArenaActions';

export default class PlayArena extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cards: {
				diamonds: [],
				clubs: [],
				hearts: [],
				spades: []
			},
			enablePlay: false
		};
		this.store = {};
	}

	componentDidMount() {
		playArenaStore.on("change", () => {
			this.setState({
				cards: playArenaStore.getCardsArray(),
				enablePlay: playArenaStore.getEnablePlay()
			});
		});
	}

	clickedCard(card) {
		this.store.clickedCard = card;
	}

	playCard() {
		
		playArenaActions.play(this.store.clickedCard);
		this.setState((state, props) => {
			state.cards[this.store.clickedCard.cardType][this.store.clickedCard.cardNum] = 0;
			return {
				cards: state.cards
			};
		});
	}

	render() {
		var style = {
			"height": this.props.height,
			"display": "inline-block",
			"margin": "0"
		};
		return (
		<div style = {style}>
			<CardDeck cards = {this.state.cards} clickedCard = {this.clickedCard.bind(this)}/>
			<button disabled = {!this.state.enablePlay} onClick = {this.playCard.bind(this)}>play</button>
		</div>
		);
	}
}