import React from 'react';
import InputButton from '../../core/inputButton';
import SyncTimer from '../../core/synctimer';
import biddingActions from './BiddingActions';
import biddingStore from './BiddingStore';

export default class BiddingArea extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
				"bids": [],
				"disableBidding": true,
				"errorMessage": ""
		};
	}

	bidSubmitted(bidValue) {
		bidValue = parseInt(bidValue, 10);
		if(bidValue % 5 !== 0) {
			this.setState({
				"errorMessage": "bid should be only in multiples of 5"
			});
		}
		else if(bidValue > 480) {
			this.setState({
				"errorMessage": "bid cannot exceed 480"
			});	
		}
		else {
			this.setState({
				"errorMessage": ""
			});	
			biddingActions.raise("test", bidValue);
		}
	}

	timerCountDownEnd() {
		console.log("Count down end");
	}

	componentWillMount() {
		biddingStore.on("change", () => {
			this.setState({
				"bids": biddingStore.getAll(),
				"disableBidding": biddingStore.getDisableBidding()
			});
		});
	}

	listOfBids() {
		return this.state.bids.map((bid) => {
			return (
				<li>{ bid.user } : {bid.value}</li>
			);
		});
	}

	render() {
		var style = {
			"height": this.props.height,
			"display": "inline-block",
			"margin": "0"
		};

		var childStyle = {
			"display": "inline-block"
		};
		return (
				<div style = {style}>
					<InputButton type = {"number"} error = {this.state.errorMessage} disable = {this.state.disableBidding} placeholder = "Enter Your Bid" buttonContent = "Make your bid" onButtonClick = {this.bidSubmitted.bind(this)} />
					<div style = {childStyle}>
						<ul>
							{this.listOfBids()}
						</ul>
					</div>
					<SyncTimer showTimer = {!this.state.disableBidding} timeEvent = {"BID_TIMER"}/>
				</div>
			);
	}
}