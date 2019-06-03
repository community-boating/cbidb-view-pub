import * as React from 'react';
import { connect } from 'react-redux'; //eslint-disable-line no-unused-vars
import { Table } from 'react-bootstrap';
import * as moment from 'moment';

import getClasses from './redux/action-creators';

var config = {};

const TOP_BAR_COLOR = "#b0cbe8";

const mapColor = (className: any) => {
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

const mapStateToProps = (state: any) => ({
	config: state.config,
	classes: state.jpClassData.classes,
	groupedByDate : state.jpClassData.groupedByDate
})

const mapDispatchToProps = (dispatch: any) => ({
	getClasses : () => {
		getClasses(config, dispatch);
	}
})

interface StaticProps {
	doInvert: boolean,
	location: any
}

class APClassSchedule extends React.Component<StaticProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>> {
	queueRefresh: any
	componentDidMount() {
		var self = this;
		var config: any = this.props.config;
		config.startDate = (function() {
			var startDate = self.props.location.query.startDate;
			if (!startDate || !/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/.test(startDate)) {
				return moment().format("MM/DD/YYYY");
			} else {
				return startDate;
			}
		}());
		config.hourOverride = (function() {
			var hour = self.props.location.query.hour;
			if (!hour || !/^[0-9]{1,2}$/.test(hour) || hour < 0 || hour > 23) {
				return null;
			} else {
				return hour;
			}
		}());
		config.dontFilter = (function() {
			return self.props.location.query.dontFilter == "true";
		}());
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
					{this.props.groupedByDate.map((day: any) => {
						var lastTime: any = null;
						return (<div key={day.date}>
							<Table bordered cellSpacing="5" style={this.props.doInvert ? Object.assign({}, tableStyle, {float:"right"}) : tableStyle}><tbody>
							<tr><td style={{fontSize:"30px", padding: "10px", backgroundColor: TOP_BAR_COLOR}}><b>
								TIME
							</b></td><td style={{fontSize:"30px", padding: "10px", backgroundColor: TOP_BAR_COLOR}}><b>
								CLASS
							</b></td></tr>
							{day.classes.map((c: any) => {
								var color = mapColor(c["TYPE_NAME"]);
								var time = (function() {
									if (lastTime == c["START_TIME"]) return "";
									else return c["START_TIME"];
								}());
								lastTime = c["START_TIME"];
								var timeStyleObj: any = {border: "none", fontSize: "30px", padding: "10px"};
								var classStyleObj: any = {fontSize: "30px", padding: "12px 10px 5px 10px", backgroundColor: color, lineHeight: "25px"};
								if (time != "") {
									timeStyleObj.borderTop = "3px solid black";
									classStyleObj.borderTop = "3px solid black";
								}
								return (<tr key={c["INSTANCE_ID"]}><td style={{...timeStyleObj, width: "90px"}}>
									{time}
								</td>
								<td style={classStyleObj}>
									<span style={{fontWeight: "bold"}}>{c["TYPE_NAME"].replace(/ /g,'\xa0')}</span>
									<br />
									<span style={{fontSize: "0.7em"}}>
										{"\xa0\xa0\xa0\xa0" + (c["INSTRUCTOR"] || "").replace(/ /g,'\xa0') +
										(c["LOCATION_NAME"] ? " @ " : "") + (c["LOCATION_NAME"] || "").replace(/ /g,'\xa0')}
									</span>
								</td>
							</tr>);
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

export default APClassSchedule;