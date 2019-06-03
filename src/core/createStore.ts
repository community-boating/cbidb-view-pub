import { createStore as reduxCreateStore, applyMiddleware, compose, Action } from 'redux';
import { RootReducer, RootState } from '../rootReducer'

interface CreateStoreParameters {
  rootReducer: RootReducer,
  enhancers?: any[],
  middlewares?: any[],
  seedState?: any
}

export default function createStore(params: CreateStoreParameters) {
	const DevTools = require('./DevTools').default;
	const middleware = params.middlewares || [];
	const enhancers = params.enhancers || [];

	//TODO: prod vs dev mode, i.e. dont initialize DevTools stuff


	const rootReducer: (state: RootState, action: Action) => RootState = function(state: RootState, action: Action) {
		return params.rootReducer(state, action);
	}

	const allEnhancers = [
		...enhancers,
		applyMiddleware(
		...middleware, // for dispatching history actions
		// ... other middlewares ...
		),
		DevTools.instrument()
	]
	console.log("opening with seed state: ", params.seedState)
	const initialState = rootReducer(params.seedState, {type: "whatever"})

	console.log(initialState)

	const store = reduxCreateStore(
		rootReducer, // new root reducer with router state
		initialState,
		compose(...allEnhancers),
	  )

	//reduxRouterMiddleware.listenForReplays(store);

	/*if (__DEVELOPMENT__ && module.hot) {
		module.hot.accept('../src/view/reducer', () => {
			store.replaceReducer(require('../src/view/reducer'));
		});
	}*/

	return {store, initialState};
}