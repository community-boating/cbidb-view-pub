import * as t from 'io-ts'
import APIWrapper, { HttpMethod } from '../../core/APIWrapper';
import { OptionalString, OptionalStringList, OptionalBoolean } from '../../util/OptionalTypeValidators';

// TODO: this is just for debug

export const validator = t.type({

})

const path = "/junior/scholarship"

export const postWrapper = (personId: number) => new APIWrapper<typeof t.string, t.TypeOf<typeof validator>, {personId: number}>({
	path,
	type: HttpMethod.POST,
	resultValidator: t.string,
	fixedParams: {personId}
})