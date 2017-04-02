const DEFAULT_STATE = {
	userName: null
};

export default function(state = DEFAULT_STATE, action) {
	switch (action.type) {
	case 'LOGIN_SUCCESS':
		return {
			userName: action.userName
		};
	case 'LOGOUT':
		return {
			userName: null
		};

	case 'LOGIN_FAIL':
	default:
		return state;
	}
}
