import React from 'react';//eslint-disable-line no-unused-vars
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import Main from './containers/Main';


export default () => {
	return (
		<Route path="/" component={App}>
			<IndexRoute component={Main} />
		</Route>
	);
};
