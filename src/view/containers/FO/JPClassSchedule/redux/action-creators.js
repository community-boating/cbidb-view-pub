import { createActionFromAPIResponse } from '../../../../../../reduxxor/ApiConnector';

const getClassesActionCreator = (config, dispatch) => {
	createActionFromAPIResponse({
		httpMethod: 'GET',
		apiEndpoint : '/jp-class-instances?startDate=06/12/2017',
		config
	}).then((data) => {
		if (data) {
			dispatch({
				type: "JP_CLASSES_SUCCESS",
				data
			});
		} else {
			dispatch({
				type: "JP_CLASSES_FAIL"
			});
		}
	}).catch(e => console.log(e));
};

export default getClassesActionCreator;
