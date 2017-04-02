import { createActionFromAPIResponse } from '../../../../../reduxxor/ApiConnector';

const loginActionCreator = (config, dispatch, params) => {
	let {userName, password} = params;
	createActionFromAPIResponse({
		httpMethod: 'POST',
		apiEndpoint : '/login',
		postData :  { userName, password },
		config
	}).then((data) => {
		if (data) {
			dispatch({
				type: "LOGIN_SUCCESS",
				userName
			});
		} else {
			dispatch({
				type: "LOGIN_FAIL"
			});
		}
	}).catch(e => console.log(e));
};

export default loginActionCreator;
