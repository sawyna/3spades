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

		playArenaStore.on("playEnabled", () => {
			this.setState({
				enablePlay: playArenaStore.getEnablePlay()
			});

			alert("Your turn dude");
		});
	}

	clickedCard(card) {
		this.store.clickedCard = card;
	}

	playCard() {
		if(playArenaStore.getActiveSuit() !== undefined) {
			let isActiveSuitCardPresent = false;
			
			for(let i = 0; i < this.state.cards[playArenaStore.getActiveSuit()].length; i++) {
				if(this.state.cards[playArenaStore.getActiveSuit()][i] === 1) {
					isActiveSuitCardPresent = true;
					break;
				}
			}

			if(isActiveSuitCardPresent && this.store.clickedCard.cardType !== playArenaStore.getActiveSuit()) {
				alert(`You need to play ${playArenaStore.getActiveSuit()}`);
			}
			else {
				playArenaActions.play(this.store.clickedCard);
				this.setState((state, props) => {
					state.cards[this.store.clickedCard.cardType][this.store.clickedCard.cardNum] = 0;
					return {
						cards: state.cards
					};
				});	
			}
		}
		else {
			playArenaActions.play(this.store.clickedCard);
			this.setState((state, props) => {
				state.cards[this.store.clickedCard.cardType][this.store.clickedCard.cardNum] = 0;
				return {
					cards: state.cards
				};
			});
		}
	}

	render() {
		var style = {
			"height": this.props.height,
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