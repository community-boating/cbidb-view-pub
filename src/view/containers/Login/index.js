import React from 'react';
import { connect } from 'react-redux';
//import { Link } from 'react-router';

import login from './redux/action-creators';

var config = {};

@connect(
	// mapStateToProps
	state => ({ config: state.config }),
	// mapDispathToProps
	dispatch => ({
		login: (userName, password) => {
			login(config, dispatch, {userName, password});
		}
	})
)
class Login extends React.Component {
	constructor() {
		super();
	}
	componentDidMount() { config = this.props.config; }
	handleSubmit = (event) => {
		event.preventDefault();
		const usernameField = this.refs.username;
		const passwordField = this.refs.password;
		this.props.login(usernameField.value, passwordField.value);
		usernameField.value = '';
		passwordField.value = '';
	}
	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				{/* <Link to="/home">Home</Link><br /> */ }
				<input type="text" ref="username" /><br />
				<input type="password" ref="password" /><br />
				<input type="submit" />
			</form>
		);
	}
}

module.exports = Login;
