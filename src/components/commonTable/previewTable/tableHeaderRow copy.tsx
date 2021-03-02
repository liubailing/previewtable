import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { PreviewTableStore, Column } from './tableStore';

export interface PreviewTableHeaderProps {
	index: number;
	store: PreviewTableStore;
	column: Column;
	props: any;
}

const TableRow: React.FC<PreviewTableHeaderProps> = (props: PreviewTableHeaderProps) => {
	/**
	 * 拖拽结束
	 */
	const handlerDragEnd = (result: any) => {
		console.log(`>>>`, result);
	};

	/**
	 * 拖拽更新
	 */
	const handlerDragUpdate = (initial: any) => {
		console.log(`>>>`, initial);
	};

	return (
		<DragDropContext onDragEnd={handlerDragEnd} onDragUpdate={handlerDragUpdate}>
			<tr {...props.props} />
		</DragDropContext>
	);
};

export default TableRow;
