import * as React from 'react';
import { connect } from 'react-redux'; //eslint-disable-line no-unused-vars

import APClassSchedule from './APClassSchedule';
import Sunset from './sunset';
import RightBanner from './rightBanner';

const mapStateToProps = (state: any) => ({
	doInvert : state.apClassData.doInvert
})

const mapDispatchToProps = (dispatch: any) => ({
	invert: () => {
		dispatch({
			type: "INVERT"
		});
	}
})

class FO extends React.Component<ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>> {
	interval: any
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
			<table style={{width: "100%"}}><tbody><tr>
				<td style={{width: "70%"}}>
					<div style={{height: "100px"}}>
						<Sunset />
					</div>
					<APClassSchedule doInvert={false}/>
				</td>
				<td style={{verticalAlign: "top", textAlign: "right"}}>
					<RightBanner />
				</td>
			</tr></tbody></table>
		);

		var inverted = (
			<table style={{width: "100%"}}><tbody><tr>
				<td style={{verticalAlign: "top", textAlign: "left"}}>
					<RightBanner />
				</td>
				<td style={{width: "70%"}}>
					<div style={{float: "right", height: "100px", width: "900px"}}>
						<Sunset />
					</div>
					<APClassSchedule doInvert={true}/>
				</td>
			</tr></tbody></table>
		);

		return (this.props.doInvert ) ? inverted : normal;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(FO)
