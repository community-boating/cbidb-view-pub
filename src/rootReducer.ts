import { combineReducers } from 'redux';
import apClassData from './containers/FO/APClassSchedule/redux/reducer';
import jpClassData from './containers/FO/JPClassSchedule/redux/reducer';

export interface StaticState {
	isServer: boolean,
	jpDirectorNameFirst: string,
	jpDirectorNameLast: string,
	jpDirectorEmail: string,
	jpPriceCents: number,
	currentSeason: number,
	apiServerParams: any,
	selfServerParams: any,
	serverConfig: any
}

export const makeRootReducer = (history: any, staticState: any) =>  combineReducers({
	apClassData,
	jpClassData,
	config : function(state = {}) { return state; }
});
