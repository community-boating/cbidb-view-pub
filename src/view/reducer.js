import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';
import {reducer as form} from 'redux-form';

import apClassData from './containers/FO/APClassSchedule/redux/reducer';
import jpClassData from './containers/FO/JPClassSchedule/redux/reducer';

export default combineReducers({
	routing: routeReducer,
	reduxAsyncConnect,
	form,
	apClassData,
	jpClassData,
	config : function(state = {}) { return state; }
});
