import React from 'react';//eslint-disable-line no-unused-vars
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import FO from './containers/FO';
import APClassSchedule from './containers/FO/APClassSchedule';
import JPClassSchedule from './containers/FO/JPClassSchedule';

export default () => {
	return (
		<Route path="/" component={App}>
			<Route path="/fo" component={FO} />
			<Route path="/ap-class-instances" component={APClassSchedule} />
			<Route path="/jp-class-instances" component={JPClassSchedule} />
			<IndexRoute component={FO} />
		</Route>
	);
};
