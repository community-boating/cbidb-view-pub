/*eslint no-console: "off" */

import Express from 'express';
import React from 'react';//eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom/server';
import compression from 'compression';
import httpProxy from 'http-proxy';
import path from 'path';
import { match } from 'react-router';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';
import createHistory from 'react-router/lib/createMemoryHistory';
import {Provider} from 'react-redux';
import PrettyError from 'pretty-error';
import http from 'http';

import getRoutes from '../src/view/routes';
import config from '../src/config';
import createStore from './CreateStore';
import ApiClient from './ApiClient';
import Html from './Html';

const targetUrl = 'http://' + config.apiHost + ':' + config.apiPort;
const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);
const proxy = httpProxy.createProxyServer({
	target: targetUrl,
	ws: true
});

app.use(compression());

app.use(Express.static(path.join(__dirname, '..', 'static')));

// Proxy to API server
app.use('/api', (req, res) => {
	proxy.web(req, res, {target: targetUrl});
});

app.use('/ws', (req, res) => {
	proxy.web(req, res, {target: targetUrl + '/ws'});
});

server.on('upgrade', (req, socket, head) => {
	proxy.ws(req, socket, head);
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
	let json;
	if (error.code !== 'ECONNRESET') {
		console.error('proxy error', error);
	}
	if (!res.headersSent) {
		res.writeHead(500, {'content-type': 'application/json'});
	}

	json = {error: 'proxy_error', reason: error.message};
	res.end(JSON.stringify(json));
});

app.use((req, res) => {
	new Promise((resolve) => {
		let options = {
			hostname: 'localhost',
			port: config.port,
			path: '/api/isLoggedIn',
			method: 'GET',
			headers: { }
		};

		if (req.headers.cookie) {
			options.headers.cookie = req.headers.cookie;
		}

		let apiReq = http.request(options, (apiRes) => {
			let resData = '';
			apiRes.on('data', (chunk) => {
				resData += chunk;
			});
			apiRes.on('end', () => {
				let response = JSON.parse(resData);
				console.log("api server returned ", resData);
				resolve(response.data);
			});
		});
		apiReq.on('error', () => {
			resolve(null);
		});

		apiReq.end();
	}).then(userName => {
		if (__DEVELOPMENT__) {
			// Do not cache webpack stats: the script file would change since
			// hot module replacement is enabled in the development env
			webpackIsomorphicTools.refresh();
		}
		const client = new ApiClient(req);
		const history = createHistory(req.originalUrl);

		const store = createStore(history, client, {
			config : {
				host : config.host,
				port : config.port
			},
			auth: {userName}
		});

		function hydrateOnClient() {
			res.send('<!doctype html>\n' +
				ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>));
		}

		if (__DISABLE_SSR__) {
			hydrateOnClient();
			return;
		}

		match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
			if (redirectLocation) {
				res.redirect(redirectLocation.pathname + redirectLocation.search);
			} else if (error) {
				console.error('ROUTER ERROR:', pretty.render(error));
				res.status(500);
				hydrateOnClient();
			} else if (renderProps) {
				loadOnServer({...renderProps, store, helpers: {client}}).then(() => {
					const component = (
						<Provider store={store} key="provider">
							<ReduxAsyncConnect {...renderProps} />
						</Provider>
					);

					res.status(200);

					global.navigator = {userAgent: req.headers['user-agent']};

					res.send('<!doctype html>\n' +
					ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>));
				});
			} else {
				res.status(404).send('Not found');
			}
		});
	}).catch(err => {
		console.log("Error in the new thing: " + err);
	});
});

if (config.port) {
	server.listen(config.port, (err) => {
		if (err) {
			console.error(err);
		}
		console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.apiPort);
		console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
	});
} else {
	console.error('==>     ERROR: No PORT environment variable has been specified');
}
