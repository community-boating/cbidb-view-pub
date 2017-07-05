import { createActionFromAPIResponse } from '../../../../../../reduxxor/ApiConnector';

const getClassesActionCreator = (config, dispatch) => {
	createActionFromAPIResponse({
		httpMethod: 'GET',
		apiEndpoint : '/jp-class-instances?startDate=' + config.startDate,
		config
	}).then((data) => {
		if (data) {
			dispatch({
				type: "JP_CLASSES_SUCCESS",
				data,
				hourOverride : config.hourOverride
			});
		} else {
			dispatch({
				type: "JP_CLASSES_FAIL"
			});
		}
	}).catch(e => console.log(e));
};

export default getClassesActionCreator;
