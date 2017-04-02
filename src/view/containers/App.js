import React, { Component, PropTypes } from 'react';//eslint-disable-line no-unused-vars
import { connect } from 'react-redux';//eslint-disable-line no-unused-vars
import Helmet from 'react-helmet';
import { routeActions } from 'react-router-redux';//eslint-disable-line no-unused-vars
import { asyncConnect } from 'redux-async-connect';//eslint-disable-line no-unused-vars

import config from '../../config';
import { queueInEventLoop } from '../../app-util';

@asyncConnect([{
	promise: () => {
		const promises = [];
		return Promise.all(promises);
	}
}])
@connect(
	state => ({
		userName: state.auth.userName
	}),
	{pushState: routeActions.push})
export default class App extends Component {
	static contextTypes = {
		store: PropTypes.object.isRequired
	};

	componentWillReceiveProps(nextProps) {
		if (!this.props.userName && nextProps.userName) {
			queueInEventLoop(() => {
				this.props.pushState('/');
			});
		} else if (this.props.userName && !nextProps.userName) {
			this.props.pushState('/login');
		}
	}

	handleLogout = (event) => {
		event.preventDefault();
	};

	render() {
		return (
			<div>
				<Helmet {...config.app.head}/>
				{this.props.children}
			</div>
		);
	}
}
