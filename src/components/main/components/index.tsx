/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable accessor-pairs */
import React, { Component } from 'react';
import { Dropdown, Menu, Icon } from 'antd';
import { observer } from 'mobx-react';
import SubMenu from 'antd/lib/menu/SubMenu';
import { AppStore } from '../appStore';
import { PreviewTableLineMenu } from './lineMeun';
import 'antd/lib/menu/style/index.css';
import './index.css';
import ReactDOM from 'react-dom';

interface PreviewTableMenuProps {
	uid: string;
	colIndex: number;
	store: AppStore;
}

@observer
export default class PreviewTableMenu extends Component<PreviewTableMenuProps> {
	constructor(props: PreviewTableMenuProps) {
		super(props);
		this.init();
	}
	init() {}

	componentDidMount() {}

	render() {
		return (
			<div>
				<Menu className="preview-menu" onClick={() => this.props.store.previewTableStore.onHideColunmMenu()}>
					<Menu.Item>菜单项 {this.props.uid}</Menu.Item>
					<Menu.Item>index {this.props.colIndex}</Menu.Item>
					<SubMenu title="子菜单" className="preview-menu">
						<Menu.Item>子菜单项 {this.props.colIndex}</Menu.Item>
						<Menu.Item>子菜单项 3</Menu.Item>
						<SubMenu title="子菜单三" className="preview-menu">
							<Menu.Item>子菜单项 {this.props.colIndex}</Menu.Item>
							<Menu.Item>子菜单项3 1</Menu.Item>
							<Menu.Item>子菜单项3 4</Menu.Item>
							<Menu.Item>子菜单项3 5</Menu.Item>
						</SubMenu>
						<Menu.Item>子菜单项 4</Menu.Item>
						<Menu.Item>子菜单项 5</Menu.Item>
					</SubMenu>
				</Menu>
			</div>
		);
	}
}
