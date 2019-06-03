import * as t from 'io-ts'
import APIWrapper, { HttpMethod, ServerParams, PostString } from '../core/APIWrapper';
import memberWelcome from "./member-welcome"

const path = "/authenticate-member"

const apiw = new APIWrapper<typeof t.boolean, PostString, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: t.boolean,
	extraHeaders: {
		"dont-redirect": "true"
	}
})

export const login = (serverParams: ServerParams) => (dispatch: (action: any) => void, userName: string, password: string) => {
	const payload = PostString("username=" + encodeURIComponent(userName) + "&password=" + encodeURIComponent(password))
	console.log("here we go")
	return apiw.send(serverParams)(payload)
	.then(data => {
		console.log("login result: ", data)
		if (String(data) == "false") {
			dispatch({type: "LOGIN_FAILURE"})
		} else {
			console.log("about to query welcome pkg")
			return memberWelcome(serverParams)
			.then(response => new Promise((resolve, reject) => {
				try {
					resolve(JSON.parse(response))
				} catch (e) {
					reject(e)
				}
			}))
			.then(data => {
				console.log("welcome package: ", data)
				dispatch({type: "LOGIN_SUCCESS", userName})
				dispatch({type: "WELCOME_PKG_UPDATE", ...((<any>data).data)})
			})	
		}
	})
	.catch((e) => {
		console.log("error: ", e)
		dispatch({type: "LOGIN_FAILURE"})
	})
}