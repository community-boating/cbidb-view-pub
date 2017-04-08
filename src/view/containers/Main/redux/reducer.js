const DEFAULT_STATE = {
	classes: []
};

const parseClassData = data => {
	return data.rows.map(row => {
		var rowObj = {};
		row.forEach((value, i) => {
			rowObj[data.metaData[i].name] = value;
		});
		return rowObj;
	});
};

export default function(state = DEFAULT_STATE, action) {
	switch (action.type) {
	case 'AP_CLASSES_SUCCESS':
		return {classes : parseClassData(action.data)};
	case 'AP_CLASSES_FAIL':
	default:
		return state;
	}
}
