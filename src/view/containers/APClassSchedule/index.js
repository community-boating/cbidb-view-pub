import React from 'react';
import { connect } from 'react-redux'; //eslint-disable-line no-unused-vars
import { Table } from 'react-bootstrap';
import moment from 'moment';

import getClasses from './redux/action-creators';

var config = {};

@connect(
	state => ({
		config: state.config,
		classes: state.apiData.classes,
		groupedByDate : state.apiData.groupedByDate
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
		return (
			<div>
				{this.props.groupedByDate.map(day =>
					<div key={day.date}>
						<Table bordered condensed cellSpacing="5" style={{marginBottom: 0, width: "900px"}}>
							<tbody><tr><td colSpan="3" style={{fontSize:"30px", padding: "10px", backgroundColor: "#b0cbe8"}}><b>
								{moment(new Date(day.date)).format("dddd, MMMM Do")}
							</b></td></tr>
							</tbody>
						</Table>
						<Table bordered condensed cellSpacing="5" style={{marginBottom: 0, width: "900px"}}><tbody>
						{day.classes.map(c =>
							<tr key={c["INSTANCE_ID"]}><td width="150px" style={{fontSize: "30px", padding: "10px"}}>
								{c["START_TIME"]}
							</td><td widht="300px" style={{fontSize: "30px", padding: "10px"}}>
								{c["TYPE_NAME"]}
							</td><td width="450px" style={{fontSize: "30px", padding: "10px"}}>
								{c["LOCATION_STRING"]}
							</td></tr>
						)}
						</tbody></Table>
					</div>
				)}
			</div>
		);
	}
}

module.exports = APClassSchedule;
