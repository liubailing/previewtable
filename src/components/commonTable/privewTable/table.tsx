/*
 *  Copyright (C) 1998-2020 by Northwoods Software Corporation. All Rights Reserved.
 */

import * as React from 'react';
import { observer } from 'mobx-react';
import { Table, Form, Spin } from 'antd';
import { TableProps } from 'antd/lib/table';
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
		// debugger;
		const { loading, dataSource, columns } = this.props.store;
		// debugger;
		// this.setState(({ columns }: any) => {
		// 	const nextColumns = [...columns];
		// 	nextColumns[index] = {
		// 		...nextColumns[index],
		// 		width: size.width
		// 	};
		// 	return { columns: nextColumns };
		// });

		columns.some((x, ind) => {
			if (index === ind) {
				x.width = size.width;
				return true;
			}
		});

		// this.props.store.columns = this.state.columns;
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
		this.setState(nextColumns);
	};

	render() {
		const { loading, dataSource, columns } = this.props.store;

		const newColumns = columns.map((col, index) => ({
			...col,
			...{ className: index < 1 ? 'react-resizable-index' : '' },
			onHeaderCell: (column: any) => ({
				index: index,
				uid: col.uid,
				title: col.title,
				width: column.width,
				editing: column.editing,
				store: this.props.store,
				callback: {
					handlerChangeColumnTitle: this.handlerChangeColumnTitle,
					handlerChangeColumnEdit: this.handlerChangeColumnEdit
				},
				onResize: this.handleResize(index)
			})
		}));

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
				>
					{/* <TableColunm editing={true} props={{}}></TableColunm> */}
				</Table>
				<Spin spinning={loading} className={`div-previewTable-spin div-spin${this.props.taskId}`}></Spin>
			</div>
		);
	}
}

export default PreviewTable;
