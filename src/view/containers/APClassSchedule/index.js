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
		console.log("### ", this.props.groupedByDate);
	/*	const getRowPair = day => {
			return ()
		}
			<tr><td colspan="2">
				{moment(new Date(day.date)).format("dddd, MMMM Do")}
			</td></tr>
			{day.classes.map(c =>
				<tr><td style={{fontSize: "30px"}}>
					{c["START_TIME"]}
				</td><td>
					{c["TYPE_NAME"]}
				</td></tr>
			);}
*/

		/*return (
			<Table striped bordered condensed hover cellSpacing="5">
				<tbody>
					<tr><th colSpan="2">Classes</th></tr>
					{this.props.groupedByDate.map(day => getRowPair(day))}
				</tbody>
			</Table>
		);*/

		return (
			<div>
				{this.props.groupedByDate.map(day =>
					<div>
						<Table bordered condensed cellSpacing="5" style={{marginBottom: 0, width: "400px"}}>
							<tbody><tr><td colSpan="2" style={{fontSize:"30px"}}><b>
								{moment(new Date(day.date)).format("dddd, MMMM Do")}
							</b></td></tr>
							</tbody>
						</Table>
						<Table bordered condensed cellSpacing="5" style={{marginBottom: 0, width: "400px"}}><tbody>
						{day.classes.map(c =>
							<tr><td width="80px" style = {{fontSize: "30px"}}>
								{c["START_TIME"]}
							</td><td style={{fontSize: "30px"}}>
								{c["TYPE_NAME"]}
							</td></tr>
						)}
						</tbody></Table>
					</div>
				)}
			</div>
		);
	}
}

/*

<tr>
	<th>Class</th>
	<th>Date</th>
	<th>Time</th>
	<th>Enrolled</th>
</tr>
{this.props.classes.map(c =>
	<tr key={c["INSTANCE_ID"]}>
		<td>{c["TYPE_NAME"]}</td>
		<td>{c["START_DATE"]}</td>
		<td>{c["START_TIME"]}</td>
		<td>{c["ENROLLEES"]}</td>
	</tr>
)}

*/module.exports = APClassSchedule;
