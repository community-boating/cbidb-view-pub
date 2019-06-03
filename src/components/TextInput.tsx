import * as React from "react";
import {ApexItemProps, ApexItem} from "./ApexItem"
import { none } from "fp-ts/lib/Option";

interface Props {
	isPassword?: boolean
	size?: number
	maxLength?: number
}

export default class TextInput<T> extends ApexItem<T, Props & ApexItemProps<T, string>, string> {
	getElement() {
		const onKeyPress = (e: React.KeyboardEvent) => {
			if (this.props.onEnter && (e.keyCode || e.which) == 13) {
				this.props.onEnter();
			}
		}
		
		const onChange = (
			this.props.reduxAction
			? (ev: React.ChangeEvent<HTMLInputElement>) => this.props.reduxAction(this.props.id, ev.target.value)
			: this.props.onChange
		);

		const size = this.props.size || 25

		return (<input 
			id={this.props.id} ref={this.props.innerRef}
			className="text_field apex-item-text"
			type={this.props.isPassword ? "password" : "text"}
			name={this.props.id}
			size={size}
			maxLength={this.props.maxLength || 100}
			onChange={onChange}
			onKeyPress={onKeyPress}
			value={(this.props.value || none).getOrElse("")}
		/>)
	}
}

