/*
 *  Copyright (C) 1998-2020 by Northwoods Software Corporation. All Rights Reserved.
 */

import * as React from 'react';
import { observer } from 'mobx-react';
import { Table, Spin, Row } from 'antd';
import { PreviewTableStore } from './tableStore';
import TableHeaderCell from './tableHeaderCell';
import TableHeaderRow from './tableHeaderRow';

import 'antd/lib/table/style/index.css';
import 'antd/lib/spin/style/index.css';
import './table.css';

export interface PreviewTableProps {
	taskId: string;
	store: PreviewTableStore;
}

@observer
class PreviewTable extends React.Component<PreviewTableProps> {
	// Maps to store key -> arr index for quick lookups
	tableRef: React.RefObject<any>;
	// table: Table<any> | undefined;
	constructor(props: PreviewTableProps) {
		super(props);
		this.tableRef = React.createRef();
		this.props.store.init(this.props.taskId);
	}
	state = { columns: [] };

	_editIndex = -1;

	componentDidMount() {
		if (!this.tableRef.current) {
			return;
		}
		this.props.store.didMountTable(this.tableRef);
	}

	components = {
		header: {
			cell: TableHeaderCell,
			row: TableHeaderRow
		}
	};

	handleResize = (index: number) => (e: any, { size }: any) => {
		if (index < 1) return;
		const { columns } = this.props.store;
		columns.some((x, ind) => {
			if (index === ind) {
				x.width = size.width;
				return true;
			}
		});
	};

	/**
	 * 修改列头
	 */
	handlerChangeColumnTitle = (index: number, val: string) => {
		const nextColumns = [...this.props.store.columns];
		nextColumns[index].title = val;
		this.setState(nextColumns);
	};

	/**
	 * 修改列头是否编辑
	 */
	handlerChangeColumnEdit = (index: number, val: boolean) => {
		const nextColumns = [...this.props.store.columns];
		nextColumns.forEach((x) => {
			x.editing = false;
		});
		nextColumns[index].editing = val;
		if (val) {
			this._editIndex = index;
		}
		this.setState(nextColumns);
	};

	handlerClearColumnEdit = () => {
		if (this._editIndex > -1) {
			this.handlerChangeColumnEdit(this._editIndex, false);
			this._editIndex = -1;
		}
	};

	handlerOnClickCell = (e: any, rowIndex: number, colIndex: number) => {
		this.props.store.previewTableHander.handlerClickCell(rowIndex, colIndex);
		this.handlerClearColumnEdit();
		this.props.store.onSetSelected(rowIndex, colIndex);
		e.preventDefault();
	};

	handlerOnClickRow = (e: any, rowIndex: number) => {
		this.props.store.previewTableHander.handlerClickRow(rowIndex);
		this.handlerClearColumnEdit();
		this.props.store.onSetSelected(rowIndex, -1);
		e.preventDefault();
	};

	getRowClassName = (record: any, index: number): string => {
		const { selectdRowIndex, selectdColIndex } = this.props.store;
		const className = index === selectdRowIndex && -1 === selectdColIndex ? 'selected-row' : '';
		return className;
	};

	render() {
		const { loading, dataSource, columns, selectdRowIndex, selectdColIndex } = this.props.store;

		let newColumns: any = columns.map((col, index) => ({
			...col,
			...{
				className: `${index < 1 ? 'react-resizable-index' : ''} ${
					index === selectdColIndex && -1 === selectdRowIndex ? 'selected-col' : ''
				}`
			},
			render: (text: any, record: any, ind: number) => (
				<div
					onClick={(e) => this.handlerOnClickCell(e, ind, index)}
					className={`${ind === selectdRowIndex && index === selectdColIndex ? 'selected-cell' : ''}`}
				>
					{text}
				</div>
			),
			onHeaderCell: (column: any) => ({
				index: index,
				uid: col.uid,
				title: col.title,
				width: column.width,
				editing: column.editing,
				store: this.props.store,
				selectdRowIndex,
				selectdColIndex,
				callback: {
					handlerChangeColumnTitle: this.handlerChangeColumnTitle,
					handlerChangeColumnEdit: this.handlerChangeColumnEdit,
					handlerClearColumnEdit: this.handlerClearColumnEdit
				},
				onResize: this.handleResize(index)
			})
		}));

		if (newColumns.length) {
			newColumns[0]['render'] = (text: any, record: any, index: number) => (
				<div
					onClick={(e) => this.handlerOnClickRow(e, index)}
					style={{ backgroundColor: '#f0f3f8', textAlign: 'center' }}
				>
					{index + 1}
				</div>
			);
		}

		return (
			<div className="div-previewTable">
				<Table
					size="small"
					className={`div-previewTable${this.props.taskId}`}
					ref={this.tableRef}
					pagination={false}
					bordered={true}
					columns={newColumns}
					dataSource={dataSource}
					components={this.components}
					rowClassName={this.getRowClassName}
				>
					{/* <TableColunm editing={true} props={{}}></TableColunm> */}
				</Table>
				<Spin spinning={loading} className={`div-previewTable-spin div-spin${this.props.taskId}`}></Spin>
			</div>
		);
	}
}

export default PreviewTable;
