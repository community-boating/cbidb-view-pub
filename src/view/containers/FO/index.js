import React from 'react';
import { connect } from 'react-redux'; //eslint-disable-line no-unused-vars

import APClassSchedule from './APClassSchedule';
import Sunset from './sunset';
import RightBanner from './rightBanner';



@connect(
	state => ({
		doInvert : state.apiData.doInvert
	}),
	dispatch => ({
		invert: () => {
			dispatch({
				type: "INVERT"
			});
		}
	})
)
class FO extends React.Component {
	constructor() {
		super();
	}
	componentDidMount() {
		var self = this;
		const queueFlip = () => {
			console.log("running queueFlip");
			self.interval = window.setTimeout(() => {
				this.props.invert();
				queueFlip();
			}, 300000);
		};
		queueFlip();
	}
	componentWillUnmount() {
		clearInterval(this.interval);
	}
	render() {
		console.log("rendering inverted? " + (this.props.doInvert));
		var normal = (
			<table width="100%"><tbody><tr>
				<td width="70%">
					<div height="100px">
						<Sunset />
					</div>
					<APClassSchedule />
				</td>
				<td style={{verticalAlign: "top", textAlign: "right"}}>
					<RightBanner />
				</td>
			</tr></tbody></table>
		);

		var inverted = (
			<table width="100%"><tbody><tr>
				<td style={{verticalAlign: "top", textAlign: "left"}}>
					<RightBanner />
				</td>
				<td width="70%">
					<div height="100px" width="900px" style={{float: "right"}}>
						<Sunset />
					</div>
					<APClassSchedule doInvert={true}/>
				</td>
			</tr></tbody></table>
		);

		return (this.props.doInvert ) ? inverted : normal;
	}
}

module.exports = FO;
