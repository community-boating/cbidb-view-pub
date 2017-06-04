import { createActionFromAPIResponse } from '../../../../../../reduxxor/ApiConnector';

const getClassesActionCreator = (config, dispatch) => {
	console.log("in action creator, startDate is " + config.startDate);
	createActionFromAPIResponse({
		httpMethod: 'GET',
		apiEndpoint : '/jp-class-instances?startDate=' + config.startDate,
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
