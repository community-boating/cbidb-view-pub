import React from 'react';
import { connect } from 'react-redux'; //eslint-disable-line no-unused-vars

import getClasses from './redux/action-creators';

var config = {};

@connect(
	state => ({ config: state.config}),
	dispatch => ({
		getClasses : () => {
			getClasses(config, dispatch);
		}
	})
)
class Main extends React.Component {
	constructor() {
		super();
	}
	componentDidMount() {
		config = this.props.config;
		this.queueRefresh = () => {
			var self = this;
			window.setTimeout(() => {
				self.props.getClasses();
				self.queueRefresh();
			}, 30000);
		};
		this.queueRefresh();
	}
	render() {
		return (
			<span>Hi!</span>
		);
	}
}

module.exports = Main;
