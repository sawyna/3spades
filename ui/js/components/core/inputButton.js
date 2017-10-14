import React from 'react';

export default class InputButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"content": "",
			"disabled": props.disable,
			"error": props.error
		};
	}

	componentWillReceiveProps(props) {
		this.props = props;
		this.setState({
			disabled: props.disable,
			"error": props.error
		});
	}

	sendInputContent(e) {
		this.setState({
			"content": e.target.value
		});
	}

	buttonOnClick() {
		this.props.onButtonClick(this.state.content);
	}

	render() {
		return (
			<div>
				<input type = {this.props.type} onChange = {this.sendInputContent.bind(this)} placeholder = {this.props.placeholder} />
				<button disabled = {this.state.disabled} onClick = {this.buttonOnClick.bind(this)}>{this.props.buttonContent}</button>
				<span>{this.state.error}</span>
			</div>
			);
	}
}