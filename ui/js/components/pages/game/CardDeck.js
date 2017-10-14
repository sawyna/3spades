import React from 'react';
import Card from './Card';

export default class CardDeck extends React.Component {
	
	constructor(props) {
		super(props);

	}

	addCards(cards, input, cardType) {
		for(let i = 0; i < input.length; i++) {
			if(input[i] === "1") {
				cards.push(<Card cardType={cardType} cardNum={i} key = {cardType + i} pressed = {false} onCardClicked = {this.selectCard.bind(this)}/>);
			}
		}		
	}

	selectCard(card, callback) {
		//this.props.playCard(card);
		this.forceUpdate(() => {
			callback();
		});

	}

	render() {
		var cards = [];
		var style = {
			"maxWidth": "100%",
			"maxHeight": "100%",
			"overflowX": "auto",
			"whiteSpace": "nowrap"
		};

		this.addCards(cards, this.props.cards.spades, "spades");
		this.addCards(cards, this.props.cards.clubs, "clubs");
		this.addCards(cards, this.props.cards.hearts, "hearts");
		this.addCards(cards, this.props.cards.diamonds, "diamonds");

		return (<div style = {style}>
			{cards}
		</div>);
	}
}