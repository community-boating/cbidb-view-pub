import * as React from "react";
import { RootState } from '../rootReducer';
import { Dispatch } from "redux";
import { DoublyLinkedList } from "../util/DoublyLinkedList";
import { set } from "../core/form/form";
import { Option } from "fp-ts/lib/Option";
import { connect, ConnectedComponentClass } from "react-redux";
import { push } from "connected-react-router";

export interface WizardNode {
	clazz: ConnectedComponentClass<any, any>,
	breadcrumbHTML: JSX.Element
}

export type ElementDLL = DoublyLinkedList<JSX.Element>

interface Config<T_CompProps> {
	formName: string,
	placeholder: JSX.Element,
	getDLL: (state: RootState) =>  Option<ElementDLL>,
	getComponentProps: (goNext: () => void, goPrev: () => void, prevNodes: WizardNode[], currNode: WizardNode, nextNodes: WizardNode[]) => T_CompProps,
	nodes: WizardNode[],
	start: string,
	end: string,
	getNextDLL: Option<(dll: ElementDLL) => ElementDLL>,
	getPrevDLL: Option<(dll: ElementDLL) => ElementDLL>
}

const mapStateToProps = (state: RootState) => ({
	state
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
	dispatch
})

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>


export default function<T_CompProps>(config: Config<T_CompProps>) {
	class WizardPageflow<T> extends React.PureComponent<T & Props> {
		personId: number
		placeholder: JSX.Element
		goNext: () => void
		goPrev: () => void
		dll: ElementDLL
		static getNextDLL: (dll: ElementDLL) => ElementDLL = dll => dll.next()
		static getPrevDLL: (dll: ElementDLL) => ElementDLL = dll => dll.prev()
		constructor(props: T & Props) {
			console.log("in wizard pageflow constructor")
			super(props)
			const self = this
			class Placeholder extends React.Component {
				render() {
					return config.placeholder
				}
			}
	
			this.placeholder = <Placeholder />
			this.dll = config.getDLL(self.props.state).getOrElse(DoublyLinkedList.from([this.placeholder]))
			console.log("wizard constructor: setting this.dll ", this.dll)
			this.goNext = () => {
				console.log("pushed goNext!")
				if (self.dll.hasNext()) {
					set(self.props.dispatch, config.formName, config.getNextDLL.getOrElse(WizardPageflow.getNextDLL)(this.dll))
				} else {
					console.log("going to end: ", config.end)
					self.props.dispatch(push(config.end))
				}
				
			}
			this.goPrev = () => {
				console.log("pushed goPrev!")
				if (self.dll.hasPrev()) {
					set(self.props.dispatch, config.formName, config.getPrevDLL.getOrElse(WizardPageflow.getPrevDLL)(this.dll))
				} else {
					console.log("going back to start: ", config.start)
					self.props.dispatch(push(config.start))
				}
				
			}

			const nodes = config.nodes.map((node, i, arr) => {
				const prevNodes = arr.filter((ee, ii) => ii < i)
				const nextNodes = arr.filter((ee, ii) => ii > i)
				const Clazz = node.clazz
				return <Clazz 
					{...config.getComponentProps(self.goNext, self.goPrev, prevNodes, node, nextNodes)}
				/>
			})
	
			const dll = DoublyLinkedList.from(nodes)
	
			console.log("about to set DLL in redux:  ", dll)
			this.dll = dll
			set(self.props.dispatch, config.formName, dll)
		}
		componentWillReceiveProps(props: Props) {
			this.dll = config.getDLL(props.state).getOrElse(DoublyLinkedList.from([this.placeholder]))
			console.log("in wizard CDU, updating this.dll", this.dll)
		}
		render() {
			console.log("rendering.....")
			console.log(this.dll)
			return this.dll.curr
		}
	}

	return connect(mapStateToProps, mapDispatchToProps)(WizardPageflow)
}

