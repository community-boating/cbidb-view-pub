import React from 'react';
import { connect } from 'react-redux'; //eslint-disable-line no-unused-vars
import { Table } from 'react-bootstrap';

import getClasses from './redux/action-creators';

var config = {};

@connect(
	state => ({
		config: state.config,
		classes: state.apiData.classes
	}),
	dispatch => ({
		getClasses : () => {
			getClasses(config, dispatch);
		}
	})
)
class Main extends React.Component {
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
			}, 5000);
		};
		this.props.getClasses();
		this.queueRefresh();
	}
	render() {
		return (
			<Table striped bordered condensed hover cellSpacing="5">
				<tbody>
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
				</tbody>
			</Table>
		);
	}
}

module.exports = Main;
