import * as React from 'react';

export default class Sunset extends React.Component {
	componentDidMount() {
		var doUpdate = function() {
			if ((window as any).updateSunset) (window as any).updateSunset();
		};

		var queueRefresh = () => {
			window.setTimeout(() => {
				doUpdate();
				queueRefresh();
			}, 10000);
		};
		doUpdate();
		queueRefresh();
	}
	render() {
		return (
			<div>
				<div className="sunset">
					<a href="http://time.is/Boston" id="time_is_link" style={{fontSize:"70px", textDecoration: "none", color: "black"}}>Sunset:</a>&nbsp;
					<span id="Boston_z161" style={{fontSize:"80px"}}></span>
					<script src="http://widget.time.is/en.js"></script>
					<script dangerouslySetInnerHTML={{__html: 'window.updateSunset = function() {time_is_widget.init({Boston_z161:{template:"SUN", sun_format:"ss12hour:ssminute ssAMPM", coords:"42.39,-71.1"}})}'}}></script>
				</div>
				<h1>Validate parking before sailing :)</h1>
			</div>
		);
	}
}
