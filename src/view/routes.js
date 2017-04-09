import React from 'react';//eslint-disable-line no-unused-vars
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import APClassSchedule from './containers/APClassSchedule';


export default () => {
	return (
		<Route path="/" component={App}>
			<Route path="/ap-class-instances" component={APClassSchedule} />
			<IndexRoute component={APClassSchedule} />
		</Route>
	);
};
