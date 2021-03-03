/* eslint-disable no-return-assign */
/*
 *  Copyright (C) 1998-2020 by Northwoods Software Corporation. All Rights Reserved.
 */

import React from 'react';
import { observer } from 'mobx-react';
import { Table, Spin } from 'antd';
import { PreviewTableStore } from './tableStore';
import TableHeaderCell from './tableHeaderCell';
import TableHeaderRow from './tableHeaderRow';

// import 'antd/lib/table/style/index.css';
// import 'antd/lib/spin/style/index.css';
// import 'antd/lib/dropdown/style/index.css';

import './tableScroll.css';
import './table.css';

export interface PreviewTableProps {
	taskId: string;
	store: PreviewTableStore;
}

@observer
class PreviewTable extends React.Component<PreviewTableProps> {
	// Maps to store key -> arr index for quick lookup
	// table: Table<any> | undefined;
	isMac: boolean;
	constructor(props: PreviewTableProps) {
		super(props);
		this.props.store.init(this.props.taskId);
		this.isMac = this.props.store.isMac();
	}

	componentDidMount() {
		document.addEventListener('click', (e: any) => {
			if (this.props.store._feildMenuIsOpened) {
				const p = e.target.parentNode.className;
				// 阻止冒泡失败，先用这个方法做一下判断
				if (p && p.indexOf('iconClickMenu') < 0) {
					this.props.store.onHideColunmMenu();
				}
			}
		});

		const tableScoll = document.querySelector(`.div-previewTable${this.props.taskId} .ant-table-body`);
		if (tableScoll) {
			tableScoll.addEventListener('scroll', () => {
				if (this.props.store._feildMenuIsOpened) {
					this.props.store.onHideColunmMenu();
				}
			});
			this.props.store.tableScoll = tableScoll;
		}
	}

	components = {
		header: {
			cell: TableHeaderCell,
			row: TableHeaderRow
		}
	};

	handlerOnClickCell = (e: any, uid: string, rowIndex: number, colIndex: number) => {
		this.props.store.previewTableHander.handlerClickCell(uid, rowIndex - 1, colIndex);
		this.props.store._onChangeColumnEditing(this.props.store._editUId, false);
		this.props.store.onSetSelected(rowIndex, uid);
		e.preventDefault();
	};

	handlerOnClickRow = (e: any, rowIndex: number) => {
		this.props.store.previewTableHander.handlerClickRow(rowIndex - 1);
		this.props.store._onChangeColumnEditing(this.props.store._editUId, false);
		this.props.store.onSetSelected(rowIndex, '');
		e.preventDefault();
	};

	getRowClassName = (record: any, index: number): string => {
		const { selectdRowIndex, selectdColIndexUId } = this.props.store;
		const className = index === selectdRowIndex && selectdColIndexUId === '' ? 'selected-row' : '';
		return className;
	};

	render() {
		const { loading, dataSource, columns, selectdRowIndex, selectdColIndexUId } = this.props.store;
		this.props.store._colTotalWidth = 0;
		const newColumns: any = columns.map((col, index) => {
			this.props.store._colTotalWidth += col.width || 0;
			return {
				...col,
				...{
					className: `${index < 1 ? 'react-resizable-index' : 'react-resizable-cell'} ${
						dataSource.length > 1 && col.uid === selectdColIndexUId && selectdRowIndex === -1
							? 'selected-col'
							: ''
					}`
				},
				render: (text: any, record: any, ind: number) => (
					<div
						onClick={(e) => this.handlerOnClickCell(e, columns[index].uid, ind, index)}
						className={`${
							ind > 0 && ind === selectdRowIndex && col.uid === selectdColIndexUId ? 'selected-cell' : ''
						}`}
						title={text}
					>
						<span>{text}</span>
					</div>
				),
				onHeaderCell: (column: any) => ({
					index,
					column: { ...column, ...{ title: col.title } },
					uid: col.uid,
					store: this.props.store
				})
			};
		});

		if (newColumns.length) {
			newColumns[0]['render'] = (text: any, record: any, index: number) =>
				index > 0 ? (
					<div onClick={(e) => this.handlerOnClickRow(e, index)} className="row-index">
						{index}
					</div>
				) : (
					<div />
				);
		}

		return (
			<div className={`div-previewTable ${this.isMac ? 'div-inmac' : ''}`}>
				<Table
					size="small"
					className={`div-previewTable${this.props.taskId} ${
						dataSource.length === 1 ? 'div-previewTable-nodata' : ''
					}`}
					ref={(ref) => (this.props.store.tableRef = ref)}
					pagination={false}
					scroll={{ x: 'max-content', y: 'max-content' }}
					bordered={true}
					columns={newColumns}
					dataSource={dataSource}
					components={this.components}
					rowClassName={this.getRowClassName}
				/>
				<Spin
					ref={(ref) => (this.props.store.spinRef = ref)}
					spinning={loading}
					className={`div-previewTable-spin div-spin${this.props.taskId}`}
				/>
			</div>
		);
	}
}

export default PreviewTable;
