module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "semi": [
            "error",
            "always"
        ],
        'no-console': 'off',
        "react/jsx-uses-vars": 1,
    },
	"globals": {
	    "__DEVELOPMENT__": true,
	    "__CLIENT__": true,
	    "__SERVER__": true,
	    "__DISABLE_SSR__": true,
	    "__DEVTOOLS__": true,
	    "socket": true,
	    "webpackIsomorphicTools": true,
		"__ROOT_DIR__" : true
	  }
};
