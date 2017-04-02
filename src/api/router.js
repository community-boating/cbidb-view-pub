import login from './actions/login';

var openConnections = 0;

export default function(req) {
	// For safety, close() will get called on this thing no matter what.
	// Might as well make sure it always has a close() property so that never throws an exception
	req.conn = new function() {
		this.close = function() {};
	};

	return new Promise((resolve, reject) => {
		req.dbPool.getConnection((err, conn) => {
			if (err) reject(err);
			else {
				console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Opening connection #" + ++openConnections);
				req.conn = conn;
				resolve();
			}
		});
	})/*.then(() => {
		return new Promise((resolve) => {
			req.conn.execute("select * from boat_types", (err, result) => {
				if (err) console.log(err);
				else console.log(result);
				resolve();
			});
		});
	})*/.then(() => {
		var urlComponents = req.url.split('/');
		if (urlComponents[0] == '') urlComponents.splice(0,1); // may or may not start with a /

		switch (urlComponents[0]) {
		case 'login':
			return new Promise((resolve) => {
				resolve();
			}).then(() => {
				return login(req.conn, req.session, {
					userName: req.body.userName,
					password: req.body.password
				});
			}).then(data => {
				return Promise.resolve(data);
			});
		case 'logout':
			return new Promise((resolve) => {
				req.session.destroy(err => {
					if (err) console.log("Error destroying session: " + err);
					else {
						console.log("Destroyed session!");
						resolve();
					}
				});
			});
		case 'isLoggedIn':
			return new Promise((resolve) => {
				resolve(req.session.userName);
			});
		}
		return Promise.reject('couldnt match url ' + urlComponents[0]);
	}).then(result => {
		req.conn.close();
		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>  Closing connection #" + openConnections--);
		return Promise.resolve(result);
	}, err => {
		req.conn.close();
		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>  ERROR: Closing connection #" + openConnections--);
		return Promise.reject(err);
	}).catch(err => {
		console.log("Error closing connection: " + err);
		return Promise.reject(err);
	});
}
