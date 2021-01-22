/*
 *  Copyright (C) 1998-2020 by Northwoods Software Corporation. All Rights Reserved.
 */

import * as React from 'react';
import { observer } from 'mobx-react';
import PreviewTable from '../commonTable/previewTable/index';
import PreviewTableMenu from './components';
import AppStore from './appStore';
import './app.css';
/**
 * Use a linkDataArray since we'll be using a GraphLinksModel,
 * and modelData for demonstration purposes. Note, though, that
 * both are optional props in ReactDiagram.
 */

export interface MainProps {
	taskId: string;
}

@observer
class MainTest extends React.Component<MainProps> {
	appStore: AppStore;
	constructor(props: MainProps) {
		super(props);
		this.appStore = new AppStore(this.props.taskId);
	}

	componentDidMount() {
		this.appStore.test('render');
	}

	render() {
		return (
			<>
				<div className="div-preview-main" id={`div-Main${this.props.taskId}`}>
					<div className="div-preview">
						<div
							style={{
								position: `relative`
							}}
						>
							<PreviewTableMenu store={this.appStore} />
						</div>
						<PreviewTable taskId={this.props.taskId} store={this.appStore.previewTableStore}></PreviewTable>
					</div>
					<div className="div-logs">
						<ul>
							{this.appStore.logs.reverse().map((x, i) => {
								return (
									<li className={'div-log-item'} key={x + i}>
										{x}
									</li>
								);
							})}
						</ul>
					</div>
				</div>

				<div className="divActions">
					<div id="div-actions" className="divActionItem" style={{ marginTop: '5px' }}>
						<div>
							<label>初始：</label>
						</div>

						<div>
							<button
								onClick={() => {
									this.appStore.test('init');
								}}
							>
								初始化
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									this.appStore.test('initData');
								}}
							>
								初始化数据
							</button>
						</div>
					</div>

					<div className="divActionItem">
						<div>
							<label>列操作：</label>
						</div>
						<div>
							<button
								onClick={() => {
									this.appStore.test('add_colunm');
								}}
							>
								新增列
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									this.appStore.test('update_colunmName');
								}}
							>
								修改列名
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									this.appStore.test('copy_colunm');
								}}
							>
								复制列
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									this.appStore.test('delete_colunm');
								}}
							>
								删除列
							</button>
						</div>
					</div>
					<div className="divActionItem">
						<div>
							<label>刷操作：</label>
						</div>
						<div>
							<button
								onClick={() => {
									this.appStore.test('add_smiple');
								}}
							>
								刷新列
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									this.appStore.test('setloading');
								}}
							>
								刷新全部
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									this.appStore.test('clearloading');
								}}
							>
								清除刷新
							</button>
						</div>
					</div>
					<div className="divActionItem">
						<div>
							<label>样式操作：</label>
						</div>
						<div>
							<button
								onClick={() => {
									this.appStore.test('sel_cell');
								}}
							>
								选择 2 4 单元格
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									this.appStore.test('sel_row');
								}}
							>
								选择第2行
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									this.appStore.test('sel_col');
								}}
							>
								选择第3列
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									this.appStore.test('sel_none');
								}}
							>
								删除样式
							</button>
						</div>
						<div> 列操作 (0开始计算)</div>
					</div>
				</div>
			</>
		);
	}
}

export default MainTest;
