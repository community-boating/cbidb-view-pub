import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';
import {reducer as form} from 'redux-form';

import auth from './containers/Login/redux/reducer';


export default combineReducers({
	routing: routeReducer,
	reduxAsyncConnect,
	form,
	auth,
	config : function(state = {}) { return state; }
});
