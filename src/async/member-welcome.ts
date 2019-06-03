import * as t from 'io-ts'
import APIWrapper, { HttpMethod, ServerParams } from '../core/APIWrapper';

export const validator = t.type({
	parentPersonId: t.number,
	userName: t.string,
	hasEIIResponse: t.boolean,
	children: t.array(t.type({
		personId: t.number,
		nameFirst: t.string,
		nameLast: t.string,
		status: t.string,
		actions: t.string,
		ratings: t.string
	}))
})

type Result = t.TypeOf<typeof validator>

const path = "/member-welcome"

export const apiw = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
})

export default (serverParams: ServerParams) => apiw.send(serverParams)(null)
