import React from 'react';

export default class Timer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			countDown: 20
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			countDown: nextProps.countDown
		});
	}

	componentDidMount() {
		console.log("componentDidMount of timer called");
		this.intervalTimer = setInterval((() => {
			console.log(this.state.countDown);
			if(this.state.countDown === 0) {
				clearInterval(this.intervalTimer);
				this.props.countDownEnded();
				return;
			}

			this.setState((state, props) => {
				return {
					countDown: state.countDown - 1
				};
			});
		}).bind(this), 1000);
	}

	componentWillUnmount() {
		clearInterval(this.intervalTimer);
	}

	render() {
		return (
				<div>
					<h1>{this.state.countDown}</h1>
				</div>
			);
	}
}