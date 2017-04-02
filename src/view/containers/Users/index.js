import React from 'react';
import { connect } from 'react-redux'; //eslint-disable-line no-unused-vars

@connect(
	state => ({ config: state.config}),
	() => ({

	})
)
class Timetracker extends React.Component {
	constructor() {
		super();
	}
	componentDidMount() {
	}
	render() {
		return (
			<span>Hi!</span>
		);
	}
}

module.exports = Timetracker;
