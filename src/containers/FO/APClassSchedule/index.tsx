import * as React from 'react';
import { connect } from 'react-redux'; //eslint-disable-line no-unused-vars
import { Table } from 'react-bootstrap';
import * as moment from 'moment';

import getClasses from './redux/action-creators';

var config = {};

interface StaticProps {
	doInvert: boolean
}

const mapStateToProps = (state: any) => ({
	config: state.config,
	classes: state.apClassData.classes,
	groupedByDate : state.apClassData.groupedByDate
})

const mapDispatchToProps = (dispatch: any) => ({
	getClasses : () => {
		getClasses(config, dispatch);
	}
})

class APClassSchedule extends React.Component<StaticProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>> {
	queueRefresh: any
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
			multiDay : (
				<div>
					{this.props.groupedByDate.map((day: any) =>
						<div key={day.date}>
							<Table bordered cellSpacing="5" style={this.props.doInvert ? Object.assign({}, tableStyle, {float:"right"}) : tableStyle}>
								<tbody><tr><td colSpan={3} style={{fontSize:"30px", padding: "10px", backgroundColor: "#b0cbe8"}}><b>
									{moment(new Date(day.date)).format("dddd, MMMM Do")}
								</b></td></tr>
								</tbody>
							</Table>
							<Table bordered cellSpacing="5" style={this.props.doInvert ? Object.assign({}, tableStyle, {float:"right"}) : tableStyle}><tbody>
							{day.classes.map((c: any) =>
								<tr key={c["INSTANCE_ID"]}><td style={{fontSize: "30px", padding: "10px", width: "150px"}}>
									{c["START_TIME"]}
								</td><td style={{fontSize: "30px", padding: "10px", width: "300px"}}>
									{c["TYPE_NAME"]}
								</td><td style={{fontSize: "30px", padding: "10px", width: "450px"}}>
									{c["LOCATION_STRING"]}
								</td></tr>
							)}
							</tbody></Table>
						</div>
					)}
				</div>
			),
			singleDay : (
				<div>
					{this.props.groupedByDate.map((day: any) =>
						<div key={day.date}>
							<Table bordered cellSpacing="5" style={this.props.doInvert ? Object.assign({}, tableStyle, {float:"right"}) : tableStyle}><tbody>
							<tr><td style={{fontSize:"30px", padding: "10px", backgroundColor: "#b0cbe8"}}><b>
								TIME
							</b></td><td style={{fontSize:"30px", padding: "10px", backgroundColor: "#b0cbe8"}}><b>
								CLASS
							</b></td><td style={{fontSize:"30px", padding: "10px", backgroundColor: "#b0cbe8"}}><b>
								LOCATION
							</b></td></tr>
							{day.classes.map((c: any) =>
								<tr key={c["INSTANCE_ID"]}><td style={{fontSize: "30px", padding: "10px", width: "150px"}}>
									{c["START_TIME"]}
								</td><td style={{fontSize: "30px", padding: "10px", width: "300px"}}>
									{c["TYPE_NAME"]}
								</td><td style={{fontSize: "30px", padding: "10px", width: "450px"}}>
									{c["LOCATION_STRING"]}
								</td></tr>
							)}
							</tbody></Table>
						</div>
					)}
				</div>
			)
		};
		return dayComponents.singleDay;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(APClassSchedule)
