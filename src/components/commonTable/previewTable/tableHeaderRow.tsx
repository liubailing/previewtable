import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { PreviewTableStore, Column } from './tableStore';

export interface PreviewTableRowProps {
	style: any;
	children: any;
	store: PreviewTableStore;
}
const TableRow: React.FC<any> = (props: PreviewTableRowProps) => {
	const { style, children, store } = props;
	/**
	 * 拖拽结束
	 */
	const handlerDragEnd = (result: any, a: any) => {
		console.log(`>>> handlerDragEnd `, result);
		if (!result.destination) {
			return;
		}

		console.log(`>>> handlerDragEnd `, result);
	};

	/**
	 * 拖拽更新
	 */
	const handlerDragUpdate = (initial: any) => {
		// console.log(`>>> handlerDragUpdate`, initial);
	};

	return (
		<DragDropContext onDragEnd={handlerDragEnd} onDragUpdate={handlerDragUpdate}>
			<tr {...props} />
		</DragDropContext>
	);
};

export default TableRow;
