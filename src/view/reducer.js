import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';
import {reducer as form} from 'redux-form';

import apiData from './containers/Main/redux/reducer';

export default combineReducers({
	routing: routeReducer,
	reduxAsyncConnect,
	form,
	apiData,
	config : function(state = {}) { return state; }
});
