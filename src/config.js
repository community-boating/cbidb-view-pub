require('babel-polyfill');

const environment = {
	development: {
		isProduction: false
	},
	production: {
		isProduction: true
	}
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
	host: process.env.HOST || 'localhost',
	port: process.env.PORT,
	apiHost: "api.community-boating.org", // process.env.APIHOST || 'localhost',
	apiPort: 443, // process.env.APIPORT,
	requireLogin : false,
	apiDirectConnection: false,
	app: {
		title: 'Timetracker',
		description: 'Timetracker',
		head: { }
	}
}, environment);
