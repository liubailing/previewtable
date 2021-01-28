/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import { Icon, Dropdown } from 'antd';
import { Resizable } from 'react-resizable';
import { PreviewTableStore } from './tableStore';
import lang from '../../../locales';
import IconFont from '../../IconFont/IconFont';

const ResizeableTitle: React.FC<any> = (props: any) => {
	const {
		index,
		getMenu,
		showmenu,
		onResize,
		editing,
		menu,
		width,
		callback,
		title,
		uid,
		store,
		selectdRowIndex,
		selectdColIndex,
		...restProps
	} = props;
	const s = store as PreviewTableStore;
	// editing = false;
	if (!width) {
		return <th {...restProps} />;
	}

	const menuRef: any = React.createRef();

	const onContextMenu = (e: any) => {
		callback.handlerOnClickColumnMenu(uid);
		e.preventDefault();
		e.stopPropagation();
	};

	const onClickEdit = (e: any) => {
		if (callback && callback.handlerChangeColumnEdit) {
			callback.handlerChangeColumnEdit(index, !editing);
		}
		e.preventDefault();
		e.stopPropagation();
	};

	const onClickMenu = (e: any) => {
		callback.handlerOnClickColumnMenu(uid);
		e.preventDefault();
		e.stopPropagation();
	};

	const onBlurInput = (e: any) => {
		if (callback && callback.handlerChangeColumnEdit) {
			callback.handlerChangeColumnEdit(index, false);
		}
		s.previewTableHander.handlerRename(uid, e.target.value);
		e.preventDefault();
	};

	const onChangeInput = (e: any) => {
		const currTitle = e.target.value;
		if (callback && callback.handlerChangeColumnTitle) {
			// 防止卡死
			setTimeout(() => {
				callback.handlerChangeColumnTitle(index, currTitle);
			}, 16);
		}
		e.preventDefault();
	};

	const getColunmMenu = (): any => {
		const divMenu = s.previewTableHander.handlerGetColumnMenu(uid, index);
		return divMenu ? divMenu : <div />;
	};

	const onClickColumn = (e: any) => {
		store.previewTableHander.handlerClickColumn(index);
		s.onSetSelected(-1, index);
		callback.handlerClearColumnEdit();
		e.preventDefault();
	};

	return (
		<>
			{index > 0 ? (
				<Resizable
					width={width}
					height={0}
					minConstraints={[100, 42]}
					maxConstraints={[300, 42]}
					onResize={onResize}
					draggableOpts={{ enableUserSelectHack: false }}
				>
					<th
						{...restProps}
						className={`${
							index > 0 && index === selectdColIndex && selectdRowIndex === -1 ? 'selected-col' : ''
						}`}
					>
						<div
							className="react-resizable-th"
							onClick={(e) => onClickColumn(e)}
							onContextMenu={(e) => onContextMenu(e)}
							title={title}
						>
							{editing ? (
								<input
									onChange={(e) => onChangeInput(e)}
									onBlur={(e) => onBlurInput(e)}
									onClick={(e) => e.stopPropagation()}
									className="th-input-write"
									value={title}
								/>
							) : (
								<input className="th-input-read" value={title} disabled={true} readOnly={true} />
							)}
							{!editing ? (
								<span className="resizable-th-action" ref={menuRef}>
									<IconFont
										onClick={(e: React.MouseEvent) => onClickEdit(e)}
										title={lang.CustomTask.EditFieldName}
										type="icon-icon-checkin"
									/>
									<Dropdown
										getPopupContainer={() => s.getTableNoPlaceholder() || document.body}
										placement="bottomRight"
										// trigger={['click']}
										visible={showmenu}
										overlay={getColunmMenu()}
										// onVisibleChange={getColunmMenu1}
									>
										<Icon
											type="ellipsis"
											onClick={(e: React.MouseEvent) => onClickMenu(e)}
											title={lang.CustomTask.MoreFieldOperations}
										/>
									</Dropdown>
								</span>
							) : null}
						</div>
					</th>
				</Resizable>
			) : (
				<th style={{ width: '40' }} className="th-index" />
			)}
		</>
	);
};

export default ResizeableTitle;
