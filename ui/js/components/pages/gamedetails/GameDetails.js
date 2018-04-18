import React from 'react';
import gameDetailsStore from './GameDetailsStore';
import gameDetailsActions from './GameDetailsActions';
import SelectInput from '../../core/selectInput';

export default class GameDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"bidWinnerName": "NA",
			"bidValue": "NA",
			"enable": false,
			partnerInfo : {},
			"roundWinners": []
		};

		this.selectedValues = {};
	}

	componentDidMount() {
		gameDetailsStore.on("change", () => {
			this.setState((state, props) => {
				return {
					bidWinnerName: gameDetailsStore.getBidWinnerInfo().name,
					bidValue: gameDetailsStore.getBidWinnerInfo().value,
					enable: gameDetailsStore.getEnable(),
					partnerInfo: gameDetailsStore.getPartnerInfo()
				}
			});
		});

		gameDetailsStore.on("updateWinners", () => {
			console.log(gameDetailsStore.getRoundWinners());
			this.setState({
				"roundWinners": gameDetailsStore.getRoundWinners()
			})
		});
	}

	selectHukum(selectData) {
		this.selectedValues.hukum = selectData.suit;
	}

	selectFirstPartner(selectData) {
		if(!this.selectedValues.hasOwnProperty("firstPartner"))
			this.selectedValues.firstPartner = {};
		
		if(selectData.suit !== undefined)
			this.selectedValues.firstPartner.suit = selectData.suit;

		if(selectData.cards !==  undefined)
			this.selectedValues.firstPartner.cards = selectData.cards;
	}

	selectSecondPartner(selectData) {
		if(!this.selectedValues.hasOwnProperty("secondPartner"))
			this.selectedValues.secondPartner = {};

		if(selectData.suit !== undefined)
			this.selectedValues.secondPartner.suit = selectData.suit;

		if(selectData.cards !==  undefined)
			this.selectedValues.secondPartner.cards = selectData.cards;
	}

	getFirstPartner() {
		if(this.state.partnerInfo.firstPartner)
			return this.state.partnerInfo.firstPartner.suit + "_of_" + this.state.partnerInfo.firstPartner.cards;
		return "NA";
	}

	getSecondPartner() {
		if(this.state.partnerInfo.secondPartner)
			return this.state.partnerInfo.secondPartner.suit + "_of_" + this.state.partnerInfo.secondPartner.cards;
		return "NA";
	}

	getHukum() {
		if(this.state.partnerInfo.hukum)
			return this.state.partnerInfo.hukum;
		return "NA";
	}

	finalize() {
		if(this.selectedValues.hukum === undefined) {
			alert("Choose hukum");
		}
		else if(this.selectedValues.firstPartner === undefined || this.selectedValues.firstPartner.suit === undefined || this.selectedValues.firstPartner.cards === undefined ) {
			alert("Choose first partner details");
		}
		else if(this.selectedValues.secondPartner === undefined || this.selectedValues.secondPartner.suit === undefined || this.selectedValues.secondPartner.cards === undefined ) {
			alert("Choose second partner details");
		}		
		else {
			gameDetailsStore.disableChoosing();
			gameDetailsActions.chosePartners(this.selectedValues);
		}
	}

	render() {
		var suits = ["diamonds", "clubs", "spades", "hearts"];
		var cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

		return (
				<div>
					<h3>Bid Winner</h3>
					<p>{this.state.bidWinnerName}: {this.state.bidValue}</p>
					<p>Hukum: {this.getHukum()} </p>
					<p> First Partner: {this.getFirstPartner()} </p>
					<p> Second Partner: {this.getSecondPartner()} </p>
					

					{
						this.state.enable && 
						<div>
							<SelectInput title = {"Choose Hukum"} options = { {suit: suits} } onChange = {this.selectHukum.bind(this)}/>
							<SelectInput title = {"Choose First Partner"}  options = { {suit: suits, cards: cards} } onChange = {this.selectFirstPartner.bind(this)}/>
							<SelectInput title = {"Choose Second Partner"} options = { {suit: suits, cards: cards} } onChange = {this.selectSecondPartner.bind(this)}/>
							<button onClick = {this.finalize.bind(this)}>Finalize</button>
						</div>
					}

					<div>
						<h3>Rounds</h3>
						<ul>
							{
								(() => {
									return this.state.roundWinners.map((roundWinnerInfo) => {
										return (<li>Winner: {roundWinnerInfo.name}, Score: {roundWinnerInfo.score}</li>);
									});
								})()
							}
						</ul>
					</div>
				</div>
			);
	}
}