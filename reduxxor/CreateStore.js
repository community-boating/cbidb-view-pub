import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import { syncHistory } from 'react-router-redux';

export default function createStore(history, client, data) {
	// Sync dispatched route actions to the history
	const reduxRouterMiddleware = syncHistory(history);

	const middleware = [reduxRouterMiddleware];

	let finalCreateStore;
	if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
		const { persistState } = require('redux-devtools');
		const DevTools = require('./DevTools');
		finalCreateStore = compose(
			applyMiddleware(...middleware),
			window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
			persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
		)(_createStore);
	} else {
		finalCreateStore = applyMiddleware(...middleware)(_createStore);
	}

	const reducer = require('../src/view/reducer');
	const store = finalCreateStore(reducer, data);

	reduxRouterMiddleware.listenForReplays(store);

	if (__DEVELOPMENT__ && module.hot) {
		module.hot.accept('../src/view/reducer', () => {
			store.replaceReducer(require('../src/view/reducer'));
		});
	}

	return store;
}
