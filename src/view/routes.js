import React from 'react';//eslint-disable-line no-unused-vars
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import FO from './containers/FO';

export default () => {
	return (
		<Route path="/" component={App}>
			<Route path="/fo" component={FO} />
			<IndexRoute component={FO} />
		</Route>
	);
};
