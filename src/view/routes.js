import React from 'react';//eslint-disable-line no-unused-vars
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import Users from './containers/Users';
import Login from './containers/Login';


export default (store) => {
	const requireLogin = (nextState, replace, cb) => {
		let state = store.getState();
		if (!state.auth.userName) {
			replace('/login');
		}
		cb();
	};

	return (
		<Route path="/" component={App}>
			<Route path="login" component={Login} />
			<Route onEnter={requireLogin}>
				<IndexRoute component={Users} />
				<Route path="*" component={Users} status={404} />
			</Route>
		</Route>
	);
};
