import { Action, combineReducers } from "redux";
import { connectRouter } from 'connected-react-router'

import {FormState, formReducer} from "./core/form/form"
import {LoginState, loginReducer} from "./core/reducer/loginStateReducer"

import {loginFormReducer, Form as LoginForm} from "./containers/LoginPage"
import {Form as RegistrationRequiredInfoForm, formName as registrationRequiredInfoFormName} from "./containers/registration/RequiredInfo"
import {Form as EmergencyContactForm, formName as emergencyContactFormName} from "./containers/registration/EmergencyContact"
import {Form as SwimProofForm, formName as swimProofFormName} from "./containers/registration/SwimProof"
import {Form as SurveyInfoForm, formName as surveyInfoFormName} from "./containers/registration/SurveyInfo"
import {Form as CreateAccountForm, formName as createAccountFormName} from "./containers/create-acct/CreateAccount"
import {Form as HomePageForm, formName as homePageFormName} from "./containers/HomePage"
import {Form as ScholarshipForm, formName as scholarshipFormName} from "./containers/Scholarship"
import {formName as registrationWizardFormName} from "./containers/registration/pageflow/RegistrationWizard"
import * as moment from "moment";
import {ServerConfig} from "./core/server/config"
import { ServerParams } from "./core/APIWrapper";
import { DoublyLinkedList } from "./util/DoublyLinkedList";
import { Option } from "fp-ts/lib/Option";

export interface StaticState {
	getMoment: () => moment.Moment,
	isServer: boolean,
	jpDirectorNameFirst: string,
	jpDirectorNameLast: string,
	jpDirectorEmail: string,
	jpPriceCents: number,
	currentSeason: number,
	apiServerParams: ServerParams,
	selfServerParams: ServerParams,
	serverConfig: ServerConfig
}

export interface RootState {
	staticState: StaticState,
	login: LoginState,
	router: any,
	loginForm: FormState<LoginForm>,
	createAcctForm: FormState<CreateAccountForm>,
	registrationRequiredInfoForm: FormState<RegistrationRequiredInfoForm>,
	emergencyContactForm: FormState<EmergencyContactForm>,
	swimProofForm: FormState<SwimProofForm>,
	surveyInfoForm: FormState<SurveyInfoForm>,
	scholarshipForm: FormState<ScholarshipForm>,
	homePageForm: FormState<HomePageForm>,
	registrationWizard: FormState<DoublyLinkedList<JSX.Element>>
}

export type RootReducer = (state: RootState, action: Action) => RootState

export const makeRootReducer: (history: any, staticState: StaticState) => RootReducer = 
(history, staticState) => {
	const rootReducer = combineReducers({
		router: connectRouter(history),
		staticState: () => staticState,
		login: loginReducer,
		loginForm: loginFormReducer,
		createAcctForm: formReducer<CreateAccountForm>(createAccountFormName),
		registrationRequiredInfoForm: formReducer<RegistrationRequiredInfoForm>(registrationRequiredInfoFormName),
		emergencyContactForm: formReducer<EmergencyContactForm>(emergencyContactFormName),
		swimProofForm: formReducer<SwimProofForm>(swimProofFormName),
		surveyInfoForm: formReducer<SurveyInfoForm>(surveyInfoFormName),
		scholarshipForm: formReducer<ScholarshipForm>(scholarshipFormName),
		homePageForm: formReducer<HomePageForm>(homePageFormName),
		registrationWizard: formReducer<DoublyLinkedList<JSX.Element>>(registrationWizardFormName),
	})
	return (state: RootState, action: Action<any>) => {
		if (action.type == "LOGOUT") return rootReducer(undefined, action)
		else return rootReducer(state, action)
	}
}
