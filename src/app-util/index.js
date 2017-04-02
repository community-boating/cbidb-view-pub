import moment from 'moment';

const mapToEnterPress = (self, enterFunction, otherfunction) => {
	return e => {
		if ((e.keyCode || e.which) == 13){
			(enterFunction.bind(self))();
		} else if (otherfunction) {
			(otherfunction.bind(self))();
		}
	};
};

const roundToDecimalPlaces = (value, decimals) => Number(Math.round(value+'e'+decimals)+'e-'+decimals);

const sortPunches = (a,b) => moment(b.punchDate).format('x') - moment(a.punchDate).format('x');

var ArrayIterator = function(arr) {
	var i=0;
	this.hasNext = () => (i<arr.length);
	this.currentIndex = () => i-1;
	this.next = () => {
		if (i < arr.length) return arr[i++];
		else return null;
	};
};

// Say we need to run a function f, but there's a callback waiting in the event loop that really should run before f.
// Calling setTimeout with a waitTime of 0 has the effect of queueing f at the back of the eventloop and tacking to the next waiting callback.
// If there is no waiting callback, f will be run immediately (i.e. just as if you didn't do this crazy thing)
// In other words, since there is no ability for waiting callbacks to interrupt the running sync thread, calling this from the running thread
// gives waiting callbacks the ability to interrupt.  Kinda like when someone's waiting to get out of their driveway on a busy street and you let them in
// Watch this is you have no idea what I'm talking about:  https://www.youtube.com/watch?v=8aGhZQkoFbQ
const queueInEventLoop = f => {
	setTimeout(f,0);
};

export {
	mapToEnterPress,
	roundToDecimalPlaces,
	sortPunches,
	ArrayIterator,
	queueInEventLoop
};
