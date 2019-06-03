import * as React from "react";

import PlaceholderLink from "./PlaceholderLink";
import {getReduxState, getDispatch} from "../core/reducer/store"
import {logout} from "../async/logout"

export default () => (<React.Fragment>
	System Time:  <span id="systime">12:12:35 PM</span> (refresh your browser to update!)
	<PlaceholderLink>&nbsp;&nbsp;&nbsp;Adult Program</PlaceholderLink>
	<a href="#" onClick={() => {
		console.log("clicked logout!")
		const selfServerParams = getReduxState().staticState.selfServerParams;
		logout.send(selfServerParams)({type: "json", jsonData: {}}).then(() => getDispatch()({type: "LOGOUT"}))
	}}>&nbsp;&nbsp;&nbsp;Logout</a>
</React.Fragment>);