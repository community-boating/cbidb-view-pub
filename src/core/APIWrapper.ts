import * as t from 'io-ts'
import { PathReporter } from 'io-ts/lib/PathReporter'
import * as http from 'http';
import {FailureType} from "./FailureType";
import { Either } from 'fp-ts/lib/Either';
import * as https from "https"
import { Option, some, none } from 'fp-ts/lib/Option';
import { removeOptions } from '../util/deserializeOption';

export enum HttpMethod {
	GET = "GET",
	POST = "POST"
}

interface Success<T_Result> {
	type: "Success",
	result: T_Result
}

interface Failure {
	type: "Failure",
	failureType: FailureType
	err: string
}

type ApiResult<T_Result> = Success<T_Result> | Failure

interface ConfigCommon<T_Validator extends t.Any> {
	type: string & HttpMethod,
	path: string,
	extraHeaders?: object, 
	resultValidator: T_Validator
}

export interface GetConfig<T_Validator extends t.Any> extends ConfigCommon<T_Validator> {
	type: HttpMethod.GET,
}

export interface PostConfig<T_Validator extends t.Any, T_FixedParams> extends ConfigCommon<T_Validator> {
	type: HttpMethod.POST,
	fixedParams?: T_FixedParams
}

export type Config<T_Validator extends t.Any, T_FixedParams> = GetConfig<T_Validator> | PostConfig<T_Validator, T_FixedParams>;

export interface ServerParams {
	host: string,
	https: boolean,
	port: number,
	pathPrefix?: string,
	staticHeaders?: object
}

export interface PostString {
	type: "urlEncoded",
	urlEncodedData: string
}

export interface PostJSON<T_PostJSON> {
	type: "json",
	jsonData: T_PostJSON
}
export const PostString: (urlEncodedData: string) => PostString = urlEncodedData => ({type: "urlEncoded", urlEncodedData})
export const PostJSON: <T_PostJSON>(jsonData: T_PostJSON) => PostJSON<T_PostJSON> = jsonData => ({type: "json", jsonData})


export type PostType<T> = PostString | PostJSON<T>

export default class APIWrapper<T_Validator extends t.Any, T_PostJSON, T_FixedParams> {
	config: Config<T_Validator, T_FixedParams>
	constructor(config: Config<T_Validator, T_FixedParams>) {
		this.config = config;
	}
	parseResponse: (response: string) => ApiResult<t.TypeOf<T_Validator>> = response => {
		type Result = t.TypeOf<T_Validator>;

		let parsed;
		try {
			parsed = JSON.parse(response)
		} catch (e) {
			return {type: "Failure", failureType: {type: "NotJSON"}, err: response};
		}
		
		if (parsed["error"]) return {type: "Failure", failureType: {type: "Unknown"}, err: response}

		const decoded: Either<t.Errors, Result> = this.config.resultValidator.decode(parsed)
		if (decoded.isRight()) return {type: "Success", result: decoded.getOrElse(null)}
		else return {type: "Failure", failureType: {type: "BadReturn"}, err: PathReporter.report(decoded).join(", ")}
	}
	send: (serverParams: ServerParams) => (data: PostType<T_PostJSON>) => Promise<string> = serverParams => data => this.sendWithHeaders(serverParams, {})(data)
	sendWithHeaders: (serverParams: ServerParams, extraHeaders: object) => (data: PostType<T_PostJSON>) => Promise<string>
	= serverParams =>  data => {
		const self = this;
		return new Promise<string>((resolve, reject) => {
			interface PostValues {content: string, headers: {"Content-Type": string, "Content-Length": string}}
			const postValues: Option<PostValues> = (function() {
				if (self.config.type === HttpMethod.POST) {
					if (data.type == "urlEncoded") {
						const postData = data.urlEncodedData
						return some({
							content: postData,
							headers: {
								"Content-Type": "application/x-www-form-urlencoded",
								"Content-Length": String(postData.length)
							}
						})
					} else {
						const postData = JSON.stringify(removeOptions({
							...data.jsonData,
							...(self.config.fixedParams || {})
						}))
						console.log(postData)
						if (postData == undefined) return none;
						else return some({
							content: postData,
							headers: {
								"Content-Type": "application/json",
								"Content-Length": String(postData.length)
							}
						})
					}
				 } else return none;
			}())
	
			const options = {
				hostname: serverParams.host,
				port: serverParams.port,
				path: (serverParams.pathPrefix || "") + self.config.path,
				method: self.config.type,
				headers: <any>{
					...serverParams.staticHeaders,
					...(self.config.extraHeaders || {}),
					...postValues.map(v => v.headers).getOrElse(<any>{})
				}
			};
			
			console.log("making request to " + options.hostname + ":" + options.port + options.path)
			console.log(options)
			console.log("serverParams: ", serverParams)
	
	
			// TODO: should we embed the special case for logout directive on any response?  Seems heavy handed
			const reqCallback = (res: any) => {
				let resData = '';
				res.on('data', (chunk: any) => {
					resData += chunk;
				});
				res.on('end', () => {
					resolve(resData);
				});
			}
	
			// FIXME: figure out all this API vs SELF shit and why this function wont carry through
			//const req = serverParams.makeRequest(options, reqCallback);
			const req = (
				serverParams.https
				? https.request(options, reqCallback)
				: http.request(options, reqCallback)
			);
	
			req.on('error', (e: string) => {
				reject(e);
			});

			postValues.map(v => req.write(v.content))
	
			req.end();
		}) // .then(this.config.parseServerResponse, this.config.parseRequestFailure);
	}
}