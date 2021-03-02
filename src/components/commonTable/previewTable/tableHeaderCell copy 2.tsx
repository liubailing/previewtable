/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import { Icon, Dropdown, Input } from 'antd';
import { Resizable } from 'react-resizable';
import {
	Droppable,
	Draggable,
	DroppableProvided,
	DroppableStateSnapshot,
	DraggableProvided,
	DraggableStateSnapshot
} from 'react-beautiful-dnd';
import { PreviewTableStore, Column } from './tableStore';
import lang from '../../../locales';
import IconFont from '../../IconFont/IconFont';
import ReactDOM from 'react-dom';

export interface PreviewTableCEllProps {
	index: number;
	store: PreviewTableStore;
	column: Column;
}

const ResizeableTitle: React.FC<any> = (props: PreviewTableCEllProps) => {
	const { index, store, column } = props;
	if (!column.width) {
		return <th />;
	}

	let innerRef: any;
	const saveFiled = (name: string) => {
		if (!name) {
			name = column.title;
		}
		store._onChangeColumnEditing(column.uid, false);
		store.previewTableHander.handlerRename(column.belongTo, column.uid, name);
	};

	const onContextMenu = (e: any) => {
		store.onSetSelected(-1, column.uid);
		store._onClickColumnMenu(column.uid);
		e.preventDefault();
		e.stopPropagation();
	};

	const onClickMenu = (e: any) => {
		store.onSetSelected(-1, column.uid);
		store._onClickColumnMenu(column.uid);
		e.preventDefault();
		e.stopPropagation();
		return false;
	};

	const onClickEdit = (e: any) => {
		store.onSetSelected(-1, column.uid);
		store._onChangeColumnEditing(column.uid, true);
		e.preventDefault();
		e.stopPropagation();
	};

	const onBlurInput = (e: any) => {
		saveFiled(e.target.value);
		e.preventDefault();
	};

	const onPressEnter = (e: any) => {
		saveFiled(e.target.value);
		e.preventDefault();
	};

	const onClickColumn = (e: any) => {
		store.previewTableHander.handlerClickColumn(column.uid, index);
		store.onSetSelected(-1, column.uid);
		e.preventDefault();
	};
	const onFocus = (e: any) => {
		if (innerRef) {
			const input = ReactDOM.findDOMNode(innerRef) as HTMLInputElement;
			input.setAttribute('value', column.title);
			setTimeout(() => {
				input.setSelectionRange(0, 100);
			}, 19);
		}
		e.preventDefault();
	};

	return (
		<>
			<Resizable
				width={column.width}
				height={0}
				minConstraints={[100, 42]}
				maxConstraints={[300, 42]}
				onResize={store._onResize(column.uid)}
				draggableOpts={{ enableUserSelectHack: false }}
			>
				{/* <th>ssssssss</th> */}

				<Droppable droppableId="droppable" direction="horizontal">
					{(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
						<React.Fragment>
							<th ref={provided.innerRef} {...provided.droppableProps}>
								ssssssss
							</th>
						</React.Fragment>
					)}
				</Droppable>

				{/* <Droppable droppableId="droppable" direction="horizontal">
					{(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
						<th ref={provided.innerRef} {...provided.droppableProps}>
							<Draggable key={index} draggableId={String(index)} index={index}>
								{(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
									<h4
										ref={provided.innerRef}
										{...provided.draggableProps}
										{...provided.dragHandleProps}
									>
										My draggable
									</h4>
								)}
							</Draggable>
						</th>
					)}
				</Droppable> */}
			</Resizable>
		</>
	);
};

export default ResizeableTitle;
