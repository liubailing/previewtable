/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable accessor-pairs */
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import lang from '../../../locales';
import AppStore from '../appStore';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PreviewTableLineMenuProps {
	store: AppStore;
}

@observer
export class PreviewTableLineMenu extends Component<PreviewTableLineMenuProps> {
	constructor(props: PreviewTableLineMenuProps) {
		super(props);
	}

	// addNode() {
	// 	const nodekey = this.props.store.currentActionNodeKey;
	// 	this.props.store.handlerHideModal();
	// }
	render() {
		return (
			<div className="flow-chart-helper">
				<div className={`add-node-menu add-node-menu${this.props.store.taskId}`}>123</div>
			</div>
		);
	}
}
