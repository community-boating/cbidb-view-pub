import React from 'react';
import { connect } from 'react-redux'; //eslint-disable-line no-unused-vars


@connect(
	() => ({ }),
	() => ({ })
)
class RightBanner extends React.Component {
	constructor() {
		super();
	}
	componentDidMount() {
	}
	render() {
		return (
			<iframe height="900px" width="550px" id="gdocframe" scrolling="no" src="https://docs.google.com/document/d/1XtwNaOQju2VLNToLFU_Ku3UodmYsTznGse-W5-qSMig/pub?embedded=true"></iframe>
		);
	}
}

module.exports = RightBanner;

/*


*/
