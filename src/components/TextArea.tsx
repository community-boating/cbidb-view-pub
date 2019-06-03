import * as React from "react";
import { ApexItemProps, ApexItem } from "./ApexItem"
import { none } from "fp-ts/lib/Option";

interface Props {
	isPassword?: boolean
	rows: number,
	cols: number,
	maxLength?: number,
	placeholder?: string
}

export default class TextArea<T> extends ApexItem<T, Props & ApexItemProps<T, string>, string> {
	getElement() {
		const onKeyPress = (e: React.KeyboardEvent) => {
			if (this.props.onEnter && (e.keyCode || e.which) == 13) {
				this.props.onEnter();
			}
		}

		const onChange =
			this.props.reduxAction
				? (ev: React.ChangeEvent<HTMLTextAreaElement>) => this.props.reduxAction(this.props.id, ev.target.value)
				: this.props.onChange;

		return (<textarea
			id={this.props.id} ref={this.props.innerRef}
			className="text_field apex-item-text"
			name={this.props.id}
			maxLength={this.props.maxLength || 100}
			onChange={onChange}
			onKeyPress={onKeyPress}
			value={(this.props.value || none).getOrElse("")}
			rows={this.props.rows}
			cols={this.props.cols}
			placeholder={this.props.placeholder}
		/>);
	}
}

