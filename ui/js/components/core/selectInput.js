import React from 'react';

export default class SelectInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			disable: false,
			title: this.props.title,
			options: this.props.options
		};
	}

	componentWillReceiveProps(nextProps) {
		this.props = nextProps;
		this.state = {
			disable: false,
			title: this.props.title,
			options: this.props.options
		};
	}

	storeSelect(selectType, e) {
		var data = {};
		data[selectType] = e.target.value;
		console.log(this.props);
		this.props.onChange(data);
	}

	render() {

		var selectList = [];
		for(var select in this.state.options) {
			selectList.push(
				<select onChange = {this.storeSelect.bind(this, select)}>
					<option selected disabled>Choose</option>
					{
						(() => {
							return this.state.options[select].map((option) => {
								return (<option value = {option}>{option}</option>);
							});
						})()
					}
				</select>		
				);
		}

		return (
			<div>
				<h3> {this.state.title} </h3>
				{selectList}
			</div>
		);

	}
}