import { ConnectedRouter } from 'connected-react-router';
import * as React from 'react';
import { connect } from "react-redux";
import { Route, Switch } from 'react-router';
import { Dispatch } from 'redux';

import { LoginState } from "../core/reducer/loginStateReducer";
import FO from "./FO/index"
import APClassSchedule from "./FO/APClassSchedule/index"
import JPClassSchedule from "./FO/JPClassSchedule/index"


const mapStateToProps = (state: any) => ({
	state,
	router: state.router,
	isServer: state.staticState.isServer,
	login: state.login
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
	dispatch
})

interface SelfProps {
	history: any
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & SelfProps

// TODO: make a wizard manager, call its update() in App constructor and SCU,
// wizard routes just call that route in the WM which returns HomePage if that route is not active in the WM
class App extends React.Component<Props> {
	render() {
		console.log("=========================================== in app render")
		console.log(this.props.state.router.location)
		const self = this;
		const devTools = (!this.props.isServer) ? (function(){
			const DevTools = require('../core/DevTools').default;	// TODO: should be import?
			return <DevTools />;
		}()) : undefined;
		console.log(this.props)

		return (
			<div>
				<ConnectedRouter history={this.props.history}>
					<Switch>
					<Route path="/" component={FO} />
					<Route path="/fo" component={FO} />
					<Route path="/ap-class-instances" component={APClassSchedule} />
					<Route path="/jp-class-instances" component={JPClassSchedule} />
					</Switch>
				</ConnectedRouter>
				{devTools}
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
