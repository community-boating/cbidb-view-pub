import * as React from "react";
import { ConnectedComponentClass } from "react-redux";
import { RouteComponentProps, StaticContext, Route } from "react-router";
import { Dispatch } from "redux";
import { push } from "connected-react-router";

export interface TransparentPageflowElement {
	path: string,
	clazz: ConnectedComponentClass<any, any>,
	breadcrumbHTML: JSX.Element
}

export interface Config {
	dispatch: Dispatch,
	start: string,
	end: string,
	elements: TransparentPageflowElement[]
}

type MapRoutePropsToComponentProps<T> = 
	(routeProps: RouteComponentProps<any, StaticContext, any>) => (config: Config) => T

export default class TransparentPageflow<T extends object> {
	routes: JSX.Element[]
	mapRouteToComponentProps: (routeProps: RouteComponentProps<any, StaticContext, any>) => (config: Config) => T
	getConcretePath: (path: string) => (componentProps: T) => string 
	constructor(
		config: Config,
		mapRoutePropsToComponentProps: MapRoutePropsToComponentProps<T>,
		getConcretePath: (path: string) => (componentProps: T) => string
	) {
		console.log("In TransparentPageflow constructor")
		this.mapRouteToComponentProps = mapRoutePropsToComponentProps
		this.getConcretePath = getConcretePath
		this.routes = config.elements.map((e, i) => {
			const Clazz = e.clazz
			const next = i==config.elements.length-1 ? () => config.end : this.getConcretePath(config.elements[i+1].path)
			const prev = i==0 ? () => config.start : this.getConcretePath(config.elements[i-1].path)
			return (<Route
				key={e.path}
				path={e.path}
				render={(routeProps) => {
					console.log("In route.render(), routeprops are ", routeProps)
					const componentProps = this.mapRouteToComponentProps(routeProps)(config)
					console.log("componentProps are ", componentProps)
					return (<Clazz
						{...componentProps}
						goNext={() => { config.dispatch(push(next(componentProps))) }}
						goPrev={() => { config.dispatch(push(prev(componentProps))) }}
					/>)}
				}
			/>)
		})
	}
}