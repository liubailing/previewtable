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
import 'antd/dist/antd.css';
import './table.css';

export interface PreviewTableProps {
	taskId: string;
	store: PreviewTableStore;
	// getMenu: Function;
}

@observer
class PreviewTable extends React.Component<PreviewTableProps> {
	// Maps to store key -> arr index for quick lookups
	tableRef: React.RefObject<any>;
	// table: Table<any> | undefined;
	constructor(props: PreviewTableProps) {
		super(props);
		this.tableRef = React.createRef();
		this.props.store.init(this.props.taskId, this.handlerOnClickColumnMenu);
	}
	state = { columns: [] };

	_editIndex = -1;

	_editMore = true;

	componentDidMount() {
		if (!this.tableRef.current) {
			return;
		}
		this.props.store.didMountTable(this.tableRef);
		document.addEventListener('click', (e) => {
			if (this._editMore) {
				this.props.store.onHideColunmMenu();
			}
			this._editMore = true;
		});

		this.props.store._handlerOnClickColumnMenu = (uid: string) => {
			this.handlerOnClickColumnMenu(uid);
		};
	}

	components = {
		header: {
			cell: TableHeaderCell,
			row: TableHeaderRow
		}
	};

	handleResize = (index: number) => (e: any, { size }: any) => {
		if (index < 1) {
			return;
		}
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

	/**  */
	handlerOnClickColumnMenu = (uid: string) => {
		debugger;
		this._editMore = false;
		const nextColumns = [...this.props.store.columns];
		nextColumns.forEach((x) => {
			x.showmenu = x.uid === uid;
		});
		this.props.store.clickMenuColIndex = uid;
		this.setState(nextColumns);
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
		const className = index === selectdRowIndex && selectdColIndex === -1 ? 'selected-row' : '';
		return className;
	};

	render() {
		const { loading, dataSource, columns, selectdRowIndex, selectdColIndex, tableHeight } = this.props.store;
		this.props.store._columnWidth = 0;
		const newColumns: any = columns.map((col, index) => {
			this.props.store._columnWidth += col.width || 0;
			return {
				...col,
				...{
					className: `${index < 1 ? 'react-resizable-index' : ''} ${
						index === selectdColIndex && selectdRowIndex === -1 ? 'selected-col' : ''
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
					index,
					uid: col.uid,
					title: col.title,
					width: column.width,
					editing: column.editing,
					menu: column.editing,
					showmenu: column.showmenu,
					store: this.props.store,
					selectdRowIndex,
					selectdColIndex,
					callback: {
						handlerChangeColumnTitle: this.handlerChangeColumnTitle,
						handlerChangeColumnEdit: this.handlerChangeColumnEdit,
						handlerClearColumnEdit: this.handlerClearColumnEdit,
						handlerOnClickColumnMenu: this.handlerOnClickColumnMenu
					},
					onResize: this.handleResize(index)
				})
			};
		});

		if (newColumns.length) {
			newColumns[0]['render'] = (text: any, record: any, index: number) => (
				<div onClick={(e) => this.handlerOnClickRow(e, index)} className={'row-index'}>
					{index + 1}
				</div>
			);
		}

		return (
			<div className="div-previewTable">
				<Table
					// style={{ width: tableWidth, height: tableHeight }}
					size="small"
					className={`div-previewTable${this.props.taskId}`}
					ref={this.tableRef}
					pagination={false}
					scroll={{ x: 'max-content', y: tableHeight }}
					// scroll={{ x: columnWidth, y: tableHeight }}
					// scroll={{ x: dataSource.length > 0 ? 'max-content' : columnWidth, y: tableHeight }}
					bordered={true}
					columns={newColumns}
					dataSource={dataSource}
					components={this.components}
					rowClassName={this.getRowClassName}
				>
					{/* <TableColunm editing={true} props={{}}></TableColunm> */}
				</Table>
				<Spin spinning={loading} className={`div-previewTable-spin div-spin${this.props.taskId}`} />
			</div>
		);
	}
}

export default PreviewTable;
