import * as t from 'io-ts'
import APIWrapper, { HttpMethod } from '../core/APIWrapper';
const path = "/logout"

export const logout = new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: t.null
})

