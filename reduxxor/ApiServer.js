import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import session from 'express-session';
var RedisStore = require('connect-redis')(session);

//import http from 'http';
//import SocketIo from 'socket.io';

import config from '../src/config';
import router from '../src/api/router';
import { createPool } from '../src/api/db';
const app = express();

//const server = new http.Server(app);
/*
const io = new SocketIo(server);
io.path('/ws');
*/

var storeOptions = {

};

const SECRET = "dfgdfgdfgdfg";
const COOKIE_LIFE_MS = 1000 * 60 * 60 * 24;
const SESSION_LIFE_MS = 1000 * 60 * 60 * 1;

var dbPool;

createPool().then(pool => {
	dbPool = pool;
}, err => {
	console.log("Unable to create DB connection pool: " + err);
});

app.use(bodyParser.json());
app.use(cookieParser(SECRET));

app.use((function() {
	return session({
		secret: SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			expires: new Date((new Date()).getTime() + COOKIE_LIFE_MS),
			domain: "localhost",
			path : "/",
			secure: false
		},
		store: new RedisStore(storeOptions)
	});
}()));

app.use((req, res, next) => {
	if (req.method != 'OPTIONS') {
		next();
		return;
	}
	res.setHeader('Access-Control-Allow-Origin', 'http://' + config.host + ':' + config.port);
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Headers', [
		'Content-Type',
		'Content-Length'
	].join(','));
	res.status(200).end();
});

app.use((req, res, next) => {
	req.dbPool = dbPool;
	console.log("URL: " + req.url);
	console.log("SESSIONID: ", req.session.id);
	console.log("SESSION: ", req.session);
	// is this an old session that should be expired?
	if (req.session.valid && req.session.expires < (new Date()).getTime()) {
		req.session.valid = false;
		req.session.userName = null;
	}
	next();
});

app.use((req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://' + config.host + ':' + config.port);
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	// Valid reasons to execute this request:
	// - asking if session is logged in (i.e. is valid)
	// - trying to log in
	// - session is valid and not expired
	if (req.session.valid || req.url == "/login" || req.url == "/isLoggedIn" || req.url == 'logout') {
		router(req).then(data => {
			if (req.url == '/login' && !!data) {
				// successful login; activate this session
				req.session.userID = data.userID;
				req.session.userName = data.userName;
				req.session.valid = true;
				req.session.expires = (new Date()).getTime() + SESSION_LIFE_MS;
			}
			if (req.session && req.session.valid) {
				// did a thing in a valid session; bump the timeout
				req.session.cookie.expires = new Date((new Date()).getTime() + COOKIE_LIFE_MS);
				req.session.expires = (new Date()).getTime() + SESSION_LIFE_MS;
				req.session.views = req.session.views || 0;
				req.session.views++;
				console.log("views: " + req.session.views);
				console.log("Your session will die in " + ((req.session.expires - (new Date()).getTime()) / 1000) + " seconds");
			}
			res.send({data : data});
		}).catch(err => {
			console.error(err);
			res.status(404).end('NOT FOUND');
		});
	} else {
		// expired session; tell the browser so it can abort current action and nav to the login screen
		console.log("expiration: " + req.session.expires);
		console.log("request timestamp: " + (new Date()).getTime());
		console.log("!!!!!!!!!!!!!!!!   session is expired");
		res.send({data : {sessionExpired : true}});
	}
});

/*
const bufferSize = 100;
const messageBuffer = new Array(bufferSize);
let messageIndex = 0;
*/
if (config.apiPort) {
	/*const runnable =*/ app.listen(config.apiPort, (err) => {
		if (err) {
			console.error(err);
		}
		console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
		console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
	});
/*
	io.on('connection', (socket) => {
		socket.emit('news', {msg: `'Hello World!' from server`});

		socket.on('history', () => {
			for (let index = 0; index < bufferSize; index++) {
				const msgNo = (messageIndex + index) % bufferSize;
				const msg = messageBuffer[msgNo];
				if (msg) {
					socket.emit('msg', msg);
				}
			}
		});

		socket.on('msg', (data) => {
			data.id = messageIndex;
			messageBuffer[messageIndex % bufferSize] = data;
			messageIndex++;
					io.emit('msg', data);
		});
	});
	io.listen(runnable);*/
} else {
	console.error('==>     ERROR: No PORT environment variable has been specified');
}
