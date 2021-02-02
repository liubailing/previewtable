/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect } from 'react';
import { Icon, Dropdown } from 'antd';
import { Resizable } from 'react-resizable';
import { PreviewTableStore, Column } from './tableStore';
import lang from '../../../locales';
import IconFont from '../../IconFont/IconFont';

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

	// const inputRef: any = React.createRef();

	// useEffect(() => {
	// 	store._onSetRef(inputRef);
	// 	// 请求或者弹窗的处理
	// }, []);

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
	};

	const onClickEdit = (e: any) => {
		store.onSetSelected(-1, column.uid);
		store._onChangeColumnEditing(column.uid, true);
		e.preventDefault();
		e.stopPropagation();
	};

	const onBlurInput = (e: any) => {
		store._onChangeColumnEditing(column.uid, false);
		store.previewTableHander.handlerRename(column.uid, e.target.value);
		e.preventDefault();
	};

	const onChangeInput = (e: any) => {
		const currTitle = e.target.value;
		setTimeout(() => {
			store._onChangeColumnTitle(column.uid, currTitle);
		}, 16);
		e.preventDefault();
	};

	const onClickColumn = (e: any) => {
		store.previewTableHander.handlerClickColumn(column.uid, index);
		store.onSetSelected(-1, column.uid);
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
					<th
						// {...restProps}
						className={`${
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
								<input
									onChange={(e) => onChangeInput(e)}
									onBlur={(e) => onBlurInput(e)}
									onClick={(e) => e.stopPropagation()}
									className={`th-input-write th-input-${column.uid} ${
										column.editWarning ? 'input-write-warn' : ''
									}`}
									value={column.title}
								/>
							) : (
								<div className="th-input-read">
									<span>{column.title}</span>
								</div>
							)}
							{!column.editing ? (
								<span className="resizable-th-action" ref={column.menuRef}>
									<div style={{ position: 'relative' }}>
										<IconFont
											onClick={(e: React.MouseEvent) => onClickEdit(e)}
											title={lang.CustomTask.EditFieldName}
											type="icon-icon-checkin"
										/>
										<Dropdown
											getPopupContainer={() => {
												return store.getTableNoPlaceholder() || document.body;
											}}
											placement="bottomRight"
											// trigger={['click']}
											visible={column.showmenu}
											overlay={store.previewTableHander.handlerGetColumnMenu(column.uid, index)}
											// onVisibleChange={getColunmMenu1}
										>
											<Icon
												type="ellipsis"
												onClick={(e) => onClickMenu(e)}
												title={lang.CustomTask.MoreFieldOperations}
											/>
										</Dropdown>
									</div>
								</span>
							) : null}
						</div>
					</th>
				</Resizable>
			) : (
				<th style={{ width: '40' }} className="th-index">
					#
				</th>
			)}
		</>
	);
};

export default ResizeableTitle;
