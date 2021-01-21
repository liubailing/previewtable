/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable accessor-pairs */
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { AppStore } from '../appStore';
import { PreviewTableLineMenu } from './lineMeun';
import './index.css';

interface PreviewTableMenuProps {
	store: AppStore;
}

@observer
export default class PreviewTableMenu extends Component<PreviewTableMenuProps> {
	constructor(props: PreviewTableMenuProps) {
		super(props);
	}

	render() {
		// const { currentNodeMenuShowType, currentNodeMenuPosX, currentNodeMenuPosY } = this.props.store;
		return (
			<div
				style={{
					display: `none`,
					position: `absolute`
				}}
			>
				<PreviewTableLineMenu store={this.props.store} />
			</div>
		);
	}
}
