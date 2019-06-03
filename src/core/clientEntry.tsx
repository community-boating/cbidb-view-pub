import * as React from 'react'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux';
import * as moment from "moment"
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import * as http from "http"
import * as https from "https"

import createStore from './createStore'
import App from '../containers/App'
import { setStore } from "./reducer/store"

import { makeRootReducer, StaticState } from '../rootReducer'
import { some, none } from 'fp-ts/lib/Option';
import {replaceWithOption} from '../util/deserializeOption';

require("../../lib/array-polyfill")

const arr1 = ['a', 'b', 'c']
const arr2 = arr1.zipWithIndex()
console.log(arr2)
const s = some("tssdf")
const n = none
console.log(s.map(e => e.length))


export const history = createBrowserHistory()

const seedState = replaceWithOption((window as any).initialStateFromServer)

console.log("seedstate from server: ", seedState)

const staticState: StaticState = {
	...seedState.staticState,
	isServer: false,
	getMoment: () => moment(),
	selfServerParams: {
		...seedState.staticState.serverConfig.SELF,
		makeRequest: (seedState.staticState.serverConfig.SELF.https ? https.request : http.request),
		port: (seedState.staticState.serverConfig.SELF.https ? 443 : 80)
	},
	apiServerParams: {
		...seedState.staticState.serverConfig.API,
		makeRequest: (seedState.staticState.serverConfig.API.https ? https.request : http.request),
	}
}

console.log("api https? ", seedState.staticState.serverConfig.SELF.https)

const rootReducer = makeRootReducer(history, staticState)

export const { store, initialState } = createStore({
	rootReducer,
	enhancers: [],
	middlewares: [routerMiddleware(history)],
	seedState
});

setStore(store)

hydrate(
	<Provider store={store}>
		<App history={history} />
	</Provider>,
	document.getElementById('app')
);