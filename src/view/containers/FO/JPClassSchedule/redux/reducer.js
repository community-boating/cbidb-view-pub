const DEFAULT_STATE = {
	classes: [],
	groupedByDate : [],
	doInvert: false
};

const parseClassData = data => {
	return data.rows.map(row => {
		var rowObj = {};
		row.forEach((value, i) => {
			rowObj[data.metaData[i].name] = value;
		});
		if (!rowObj.INSTRUCTOR_NAME_FIRST && !rowObj.INSTRUCTOR_NAME_LAST) rowObj.INSTRUCTOR = "";
		else rowObj.INSTRUCTOR = (rowObj.INSTRUCTOR_NAME_FIRST || "") + " " + (rowObj.INSTRUCTOR_NAME_LAST || "");

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
	case 'JP_CLASSES_SUCCESS':
		var classes = parseClassData(action.data);
		var groupedByDate = classDataGroupedByDate(classes);
		return {classes, groupedByDate, doInvert: state.doInvert};
	case 'JP_CLASSES_FAIL':
	default:
		return state;
	}
}
