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

	componentDidMount() {
		if (!this.tableRef.current) {
			return;
		}
		this.props.store.didMountTable(this.tableRef);
		document.addEventListener('click', (e) => {
			if (this.props.store._editMore) {
				this.props.store.onHideColunmMenu();
			}
			this.props.store._editMore = true;
		});
	}

	components = {
		header: {
			cell: TableHeaderCell,
			row: TableHeaderRow
		}
	};

	handlerOnClickCell = (e: any, uid: string, rowIndex: number, colIndex: number) => {
		this.props.store.previewTableHander.handlerClickCell(uid, rowIndex, colIndex);
		this.props.store._onChangeColumnEditing(this.props.store._editUId, false);
		this.props.store.onSetSelected(rowIndex, uid);
		e.preventDefault();
	};

	handlerOnClickRow = (e: any, rowIndex: number) => {
		this.props.store.previewTableHander.handlerClickRow(rowIndex);
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
		const { loading, dataSource, columns, selectdRowIndex, selectdColIndexUId, tableHeight } = this.props.store;
		this.props.store._colTotalWidth = 0;
		const newColumns: any = columns.map((col, index) => {
			this.props.store._colTotalWidth += col.width || 0;
			return {
				...col,
				...{
					className: `${index < 1 ? 'react-resizable-index' : 'react-resizable-cell'} ${
						col.uid === selectdColIndexUId && selectdRowIndex === -1 ? 'selected-col' : ''
					}`
				},
				render: (text: any, record: any, ind: number) => (
					<div
						onClick={(e) => this.handlerOnClickCell(e, columns[index].uid, ind, index)}
						className={`${
							ind === selectdRowIndex && col.uid === selectdColIndexUId ? 'selected-cell' : ''
						}`}
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
			newColumns[0]['render'] = (text: any, record: any, index: number) => (
				<div onClick={(e) => this.handlerOnClickRow(e, index)} className="row-index">
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
					scroll={{ x: 'max-content', y: 'max-content' }}
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
