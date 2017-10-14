import React from 'react';
import socketClient from '../socketClient';

export default class SyncTimer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showTimer: this.props.showTimer,
			countDown: 20
		}
	}

	componentWillReceiveProps(nextProps) {
		this.props = nextProps;
		this.setState({
			showTimer: this.props.showTimer,
		});
	}

	componentWillMount() {
		socketClient.listen(this.props.timeEvent, (data) => {
			if(data.countDown) {
				this.setState({
					countDown: data.countDown
				});
			}
		});
	}

	render() {
		var showTimer = this.state.showTimer;
		return (
				<div>
					{ showTimer && (<h1>{ this.state.countDown }</h1>) }
				</div>
		);
	}
}