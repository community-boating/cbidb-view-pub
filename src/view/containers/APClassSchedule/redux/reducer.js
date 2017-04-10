const DEFAULT_STATE = {
	classes: [],
	groupedByDate : []
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

const classDataGroupedByDate = data => {
	return data.reduce((days, row) => {
		if (days.length == 0 || days[days.length-1].date != row["START_DATE"]) {
			days.push({date: row["START_DATE"], classes: []});
		}
		days[days.length-1].classes.push(row);
		return days;
	}, []);
};


export default function(state = DEFAULT_STATE, action) {
	switch (action.type) {
	case 'AP_CLASSES_SUCCESS':
		var classes = parseClassData(action.data);
		var groupedByDate = classDataGroupedByDate(classes);
		return {classes, groupedByDate};
	case 'AP_CLASSES_FAIL':
	default:
		return state;
	}
}
