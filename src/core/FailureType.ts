export interface FailureType_Unauthorized {
	type: "Unauthorized"
}

export interface FailureType_BadReturn {
	type: "BadReturn"
}

export interface FailureType_Unknown {
	type: "Unknown"
}
export interface FailureType_NotJSON {
	type: "NotJSON"
}

export type FailureType = FailureType_Unauthorized | FailureType_BadReturn | FailureType_Unknown | FailureType_NotJSON