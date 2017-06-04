import React from 'react';
import { connect } from 'react-redux'; //eslint-disable-line no-unused-vars
import { Table } from 'react-bootstrap';

import getClasses from './redux/action-creators';

var config = {};

const TOP_BAR_COLOR = "#b0cbe8";

const mapColor = className => {
	switch (className) {
	case "Learn-to-Sail & Kayak":
	case "Mercury Green Review":
		return "#a3ffa3";
	case "Mainsail":
		return "#ffffa3";
	case "Jib":
		return "#ffa3a3";
	case "Windsurfing":
		return "#a3a3ff";
	case "Laser":
	case "420":
		return "#ffd7a3";
	case "Kayak":
	case "Stand Up Paddleboard":
		return "#d1a3ff";
	case "Kayak Adventure":
		return "#d1a3ff";
	case "Race Team":
		return "#ffa3a3";
	case "Keelboat 1":
	case "Keelboat 2":
		return "#ffa3a3";
	case "Environmental Science":
		return "#a3ffff";
	default:
		return "#FFFFFF";
	}
};

@connect(
	state => ({
		config: state.config,
		classes: state.jpClassData.classes,
		groupedByDate : state.jpClassData.groupedByDate
	}),
	dispatch => ({
		getClasses : () => {
			getClasses(config, dispatch);
		}
	})
)
class APClassSchedule extends React.Component {
	constructor() {
		super();
	}
	componentDidMount() {
		config = this.props.config;
		this.queueRefresh = () => {
			var self = this;
			window.setTimeout(() => {
				self.props.getClasses();
				self.queueRefresh();
			}, 10000);
		};
		this.props.getClasses();
		this.queueRefresh();
	}
	render() {
		var tableStyle = {marginBottom: 0, width: "900px"};
		var dayComponents = {
			singleDay : (
				<div>
					{this.props.groupedByDate.map(day => {
						var lastTime = null;
						return (<div key={day.date}>
							<Table bordered condensed cellSpacing="5" style={this.props.doInvert ? Object.assign({}, tableStyle, {float:"right"}) : tableStyle}><tbody>
							<tr><td style={{fontSize:"30px", padding: "10px", backgroundColor: TOP_BAR_COLOR}}><b>
								TIME
							</b></td><td style={{fontSize:"30px", padding: "10px", backgroundColor: TOP_BAR_COLOR}}><b>
								CLASS
							</b></td><td style={{fontSize:"30px", padding: "10px", backgroundColor: TOP_BAR_COLOR}}><b>
								LOCATION
							</b></td><td style={{fontSize:"30px", padding: "10px", backgroundColor: TOP_BAR_COLOR}}><b>
								INSTRUCTOR
							</b></td></tr>
							{day.classes.map(c => {
								var color = mapColor(c["TYPE_NAME"]);
								var time = (function() {
									if (lastTime == c["START_TIME"]) return "";
									else return c["START_TIME"];
								}());
								lastTime = c["START_TIME"];
								return (<tr key={c["INSTANCE_ID"]}><td width="150px" style={{fontSize: "30px", padding: "10px"}}>
									{time}
								</td><td width="300px" style={{fontSize: "30px", padding: "10px", backgroundColor: color}}>
									{c["TYPE_NAME"].replace(/ /g,'\xa0')}
								</td><td width="450px" style={{fontSize: "30px", padding: "10px", backgroundColor: color}}>
									{(c["LOCATION_NAME"] || "").replace(/ /g,'\xa0')}
								</td><td width="450px" style={{fontSize: "30px", padding: "10px", backgroundColor: color}}>
									{(c["INSTRUCTOR"] || "").replace(/ /g,'\xa0')}
								</td></tr>);
							})}
							</tbody></Table>
					</div>);
					})}
				</div>
			)
		};
		return dayComponents.singleDay;
	}
}

module.exports = APClassSchedule;
