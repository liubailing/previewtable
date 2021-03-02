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
			{column.uid !== store._indexUId ? (
				<Resizable
					width={column.width}
					height={0}
					minConstraints={[100, 42]}
					maxConstraints={[300, 42]}
					onResize={store._onResize(column.uid)}
					draggableOpts={{ enableUserSelectHack: false }}
				>
					<Droppable droppableId="droppable" direction="horizontal">
						{(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
							<th
								{...provided.droppableProps}
								ref={provided.innerRef}
								// {...restProps}
								className={`${column.highlight ? 'highlight-col' : ''} ${
									column.uid === store.selectdColIndexUId && store.selectdRowIndex === -1
										? 'selected-col'
										: ''
								}`}
							>
								<div
									className="react-resizable-th"
									onClick={(e) => onClickColumn(e)}
									onContextMenu={(e) => onContextMenu(e)}
									title={column.title}
								>
									{column.editing ? (
										<Input
											ref={(ref) => (innerRef = ref)}
											placeholder={column.title}
											onFocus={(e) => onFocus(e)}
											onBlur={(e) => onBlurInput(e)}
											onClick={(e) => e.stopPropagation()}
											onPressEnter={(e) => onPressEnter(e)}
											className={`th-input-write th-input-${column.uid} ${
												column.editWarning ? 'input-write-warn' : ''
											}`}
										/>
									) : (
										// <Droppable droppableId="droppable" direction="horizontal">
										// 	{(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
										// 		<div
										// 			className="th-input-read"
										// 			ref={provided.innerRef}
										// 			{...provided.droppableProps}
										// 			// {...provided.draggableProps}
										// 		>
										// 			<span>{column.title}</span>
										// 		</div>
										// 	)}
										// </Droppable>
										<div className="th-input-read">
											<span>{column.title}</span>
										</div>
									)}
									{!column.editing ? (
										<span className="resizable-th-action">
											<div style={{ position: 'relative' }}>
												<IconFont
													onClick={(e: React.MouseEvent) => onClickEdit(e)}
													title={lang.CustomTask.EditFieldName}
													type="icon-icon-checkin"
												/>
												<Dropdown
													getPopupContainer={() => store.getTable() || document.body}
													placement="bottomRight"
													// trigger={['click']}
													visible={column.showmenu}
													overlay={store.previewTableHander.handlerGetColumnMenu(
														column.uid,
														column.showmenu
													)}
													// onVisibleChange={store.previewTableHander.handlerGetColumnMenu(column.uid,	column.showmenu)}
												>
													<Icon
														type="ellipsis"
														onClick={(e) => onClickMenu(e)}
														className="iconClickMenu"
														title={lang.CustomTask.MoreFieldOperations}
													/>
												</Dropdown>
											</div>
										</span>
									) : null}
								</div>
							</th>
						)}
					</Droppable>
				</Resizable>
			) : (
				<th style={{ height: 38 }} className="th-index">
					#
				</th>
			)}
		</>
	);
};

export default ResizeableTitle;
