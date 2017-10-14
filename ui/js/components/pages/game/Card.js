import React from 'react';
import Image from 'react-image';

export default class Card extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"clicked": this.props.pressed
		};
	}

	componentWillReceiveProps(nextProps) {
		this.props = nextProps;
		this.setState({
			clicked: this.props.pressed
		});
	}

	onClick(e) {
		this.props.onCardClicked({
			cardType: this.props.cardType,
			cardNum: this.props.cardNum
		}, () => {
			console.log("callback called");
			console.log(this.state);
			this.setState((state, props) => {
				console.log(state);
				var newState =  {
					"clicked": !(state.clicked)
				};
				return newState;
			});
		});
	}

	render() {
		var imgStyle = {
			"maxWidth": "100%",
			"maxHeight": "100%"
		};

		var clickedButtonStyle = {
			"borderStyle": "inset"
		};

		var normalButtonStyle = {
			"borderStyle": "outset"
		};

		var cardNum = this.props.cardNum + 2;
		var cardName;
		if(cardNum <= 10) {
			cardName = `${cardNum}_of_${this.props.cardType}.png`;
		}
		else if(cardNum === 11) {
			cardName = `jack_of_${this.props.cardType}.png`;
		}
		else if(cardNum === 12) {
			cardName = `queen_of_${this.props.cardType}.png`;
		}
		else if(cardNum === 13) {
			cardName = `king_of_${this.props.cardType}.png`;
		}
		else if(cardNum === 14) {
			cardName = `ace_of_${this.props.cardType}.png`;
		}

		return <span style = {imgStyle}><button style = {this.state.clicked ? clickedButtonStyle : normalButtonStyle} onClick = {this.onClick.bind(this)}><img style = {imgStyle} draggable = "true" src={require('../../../../bundle/static/cards/' + cardName)} /></button></span>;
	}
}