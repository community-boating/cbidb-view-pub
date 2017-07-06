import moment from 'moment';

const DEFAULT_STATE = {
	classes: [],
	groupedByDate : [],
	doInvert: false
};

const MS_MINUTE = 1000*60;
const MS_HOUR = MS_MINUTE * 60;

// Max # of classes that can be on the screen at once
const MAX_ON_SCREEN = 17;

// Always show classes between 1.5 hours ago and 1 hour from now.
var getMustShow = msAfterNow => {
	return (msAfterNow > (-2.5 * MS_HOUR) && msAfterNow < (1 * MS_HOUR));
};

const parseClassData = (data, hourOverride, dontFilter) => {
	var MS_NOW = (function() {
		if (null != hourOverride) {
			console.log("OVERRIDING HOUR TO BE " + hourOverride);
			return moment().hour(hourOverride).minute(0).valueOf();
		} else {
			return moment().valueOf();
		}
	}());

	var result = data.rows.map(row => {
		var rowObj = {};
		row.forEach((value, i) => {
			rowObj[data.metaData[i].name] = value;
		});
		if (!rowObj.INSTRUCTOR_NAME_FIRST && !rowObj.INSTRUCTOR_NAME_LAST) rowObj.INSTRUCTOR = "";
		else rowObj.INSTRUCTOR = (rowObj.INSTRUCTOR_NAME_FIRST || "");

		// generate moment out of start date and start time
		rowObj.MOMENT = moment(rowObj.START_DATE + " " + rowObj.START_TIME, "MM/DD/YYYY hh:mmA");
		rowObj.MOMENT_AS_IF_TODAY = moment(moment().format("MM/DD/YYYY") + " " + rowObj.START_TIME, "MM/DD/YYYY hh:mmA");
		rowObj.MS_AS_IF_TODAY = rowObj.MOMENT_AS_IF_TODAY.valueOf();
		rowObj.MS_AFTER_NOW = rowObj.MS_AS_IF_TODAY - MS_NOW;
		// For starters, only show the must-shows
		rowObj.DO_SHOW = getMustShow(rowObj.MS_AFTER_NOW);
		return rowObj;
	}).sort((a, b) => {
		if (a.MS_AFTER_NOW > b.MS_AFTER_NOW) return 1;
		else if (a.MS_AFTER_NOW < b.MS_AFTER_NOW) return -1;
		else return 0;
	});

	function getDistinctTimes(arr, rowObj) {
		if (arr.length == 0 || arr[arr.length-1] != rowObj.START_TIME) {
			// else if we haven't pushed this time yet, push it
			arr.push(rowObj.START_TIME);
			return arr;
		} else return arr; // else we already pushed this time.
	}

	var futureTimes = result.filter(rowObj => rowObj.MS_AFTER_NOW > 0 && !rowObj.DO_SHOW).reduce(getDistinctTimes, []);
	var pastTimes = result.filter(rowObj => rowObj.MS_AFTER_NOW < 0 && !rowObj.DO_SHOW).reduce(getDistinctTimes, []);

	// An array of the distinct start times of the non-must-show classes, in priority order.
	// First prioritize classes that start after now, moving away from now
	// Then prioritize classes that alreadty started, moved backward in time away from now
	// I.e. if it's 11:00am and the must show range is 10:00-12:00, this array would be
	// [12:30, 1:00, 1:30, 2:00, 9:30, 9:00, 8:30]  (all the future classes in asc order, then all the past classes desc)
	var startTimesToAddInOrder = futureTimes.concat(pastTimes.reverse());

	// For each time, add all the classes at that time if we can (i.e .never add some of the 9:30 classes and not others)
	// It's ok to add slightly too many future classes, but if adding old classes would put us over the max
	// that means potentially important classes could fall off the bottom which is not cool
	startTimesToAddInOrder.forEach((time, i) => {
		var numberOfShownClasses = result.filter(rowObj => rowObj.DO_SHOW).length;
		if (numberOfShownClasses > MAX_ON_SCREEN) return;

		var numberOfClassesWithThisTime = result.filter(rowObj => rowObj.START_TIME == time).length;

		if (
			numberOfShownClasses + numberOfClassesWithThisTime < MAX_ON_SCREEN ||  // we can add all these and still be below the max
			i < futureTimes.length  // adding these would put us over the max, but they are future classes so that is ok
		) result = result.map(rowObj => {
			if (rowObj.START_TIME == time) rowObj.DO_SHOW = true;
			return rowObj;
		});
	});

	return result.filter(rowObj => dontFilter || rowObj.DO_SHOW);
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
		var classes = parseClassData(action.data, action.hourOverride, action.dontFilter);
		var groupedByDate = classDataGroupedByDate(classes);
		return {classes, groupedByDate, doInvert: state.doInvert};
	case 'JP_CLASSES_FAIL':
	default:
		return state;
	}
}
