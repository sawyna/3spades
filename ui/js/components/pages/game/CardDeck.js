import React from 'react';
import Card from './Card';


/*

[
	{
		cardType: "",
		cardNum: ,
		pressed: ,
	}
]

*/

export default class CardDeck extends React.Component {
	
	constructor(props) {
		super(props);
		this.dummyCard = {
			cardType: "joker",
			cardNum: 13
		};

		this.state = {
			cards: this.createCards(props),
			clickedCard: this.dummyCard
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			cards: this.createCards(nextProps),
			clickedCard: this.dummyCard
		});
	}

	createCards(props) {
		var cards = [];

		props.cards.spades.forEach((elem, index) => {
			if(elem === 1) {
				cards.push({
					cardType: "spades",
					cardNum: index,
					clicked: false
				});
			}
		});

		props.cards.clubs.forEach((elem, index) => {
			if(elem === 1) {
				cards.push({
					cardType: "clubs",
					cardNum: index,
					clicked: false
				});
			}
		});

		props.cards.diamonds.forEach((elem, index) => {
			if(elem === 1) {
				cards.push({
					cardType: "diamonds",
					cardNum: index,
					clicked: false
				});
			}
		});

		props.cards.hearts.forEach((elem, index) => {
			if(elem === 1) {
				cards.push({
					cardType: "hearts",
					cardNum: index,
					clicked: false
				});
			}
		});

		return cards;
	}

	isPresent(card) {
		for(let i = 0; i < this.state.cards.length; i++) {
			if(this.state.cards[i].cardType === card.cardType && this.state.cards[i].cardNum === card.cardNum)
				return true;
		}
		return false;
	}

	addCard(card) {
		if(this.isPresent(card)) {
			this.setState((state, props) => {
				var cards = state.cards;
				cards.push(card);
				return {
					cards: cards
				};
			});
		}
	}

	removeCard(selectedCard) {
		this.setState((state, props) => {
			let cards = state.cards.map((card) => {
				if(!(selectedCard.cardType === card.cardType && selectedCard.cardNum === card.cardNum))
					return card;
			});

			return {
				cards: cards,
				clickedCard: this.dummyCard
			};
		});
	}

	removeClickedCard() {
		this.removeCard(this.state.clickedCard);
	}

	selectCard(selectedCard) {
		this.setState((state, props) => {
			let cards = state.cards.map((card) => {
				if(selectedCard.cardType === card.cardType && selectedCard.cardNum === card.cardNum)
					card.clicked = !(card.clicked);
				else
					card.clicked = false
				return card;
			});

			return {
				cards: cards,
				clickedCard: selectedCard
			};
		});

		this.props.clickedCard(selectedCard);
	}

	render() {
		var style = {
			"maxWidth": "100%",
			"maxHeight": "100%",
			"overflowX": "auto",
			"whiteSpace": "nowrap"
		};

		var cardElements = this.state.cards.map((card, index, cards) => {
			return (<Card cardType={card.cardType} cardNum={card.cardNum} key = {card.cardType + index} clicked = {card.clicked} onCardClicked = {this.selectCard.bind(this)}/>);
		});

		return (
			<div style = {style}>
				{cardElements}
			</div>
		);
	}
}