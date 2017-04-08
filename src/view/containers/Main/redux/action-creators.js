import { createActionFromAPIResponse } from '../../../../../reduxxor/ApiConnector';

const getClassesActionCreator = (config, dispatch) => {
	createActionFromAPIResponse({
		httpMethod: 'GET',
		apiEndpoint : '/ap-class-instances',
		config
	}).then((data) => {
		console.log(data);
		if (data) {
			dispatch({
				type: "AP_CLASSES_SUCCESS",
				data
			});
		} else {
			dispatch({
				type: "AP_CLASSES_FAIL"
			});
		}
	}).catch(e => console.log(e));
};

export default getClassesActionCreator;
