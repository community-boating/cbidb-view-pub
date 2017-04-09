import React from 'react';
import { connect } from 'react-redux'; //eslint-disable-line no-unused-vars

import APClassSchedule from '../APClassSchedule';
import Sunset from './sunset';
import RightBanner from './rightBanner';

@connect(
	() => ({ }),
	() => ({ })
)
class FO extends React.Component {
	constructor() {
		super();
	}
	componentDidMount() {
	}
	render() {
		return (
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
	}
}

module.exports = FO;
