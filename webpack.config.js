const path = require('path');

module.exports = function (env, argv) {

	// default to the server configuration
	const base = {
		entry: './src/core/server/index.tsx',
		output: {
			filename: 'js/server.js',
			// path needs to be an ABSOLUTE file path
			path: __dirname + "/dist",
			publicPath: '/dist/'
		},
		mode: "development",	
		// Enable sourcemaps for debugging webpack's output.
//		devtool: 'source-map',
		resolve: {
			// Add '.ts' and '.tsx' as resolvable extensions.
			extensions: [".ts", ".tsx", ".js", ".json"],

			// The ./ is to make absolute paths work as if they were relative to __dirname
			// e.g. require("src/components/Thing") will work no matter the calling directory
			// Doesnt seem to work with import syntax though (i.e. typescript pitches a fit)
			modules: ['node_modules', './']
		},
		module: {
			rules: [
				// All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
				{ test: /\.tsx?$/, loader: "ts-loader" },
	
				// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
				{ enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
	
				{ test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/, loader: "file-loader" }
			]
		},
		// When importing a module whose path matches one of the following, just
		// assume a corresponding global variable exists and use that instead.
		// This is important because it allows us to avoid bundling all of our
		// dependencies, which allows browsers to cache those libraries between builds.
		/*externals: {
			"react": "React",
			"react-dom": "ReactDOM"
		}*/
	}

	// server-specific configuration
	if (env.platform === 'server') {
		base.target = 'node';
	}

	// client-specific configurations
	if (env.platform === 'web') {
		base.entry = './src/core/clientEntry.tsx';
		base.output.filename = 'js/client.js';
	}

	return base;
}