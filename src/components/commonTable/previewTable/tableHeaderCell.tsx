import React from 'react';
import { Resizable } from 'react-resizable';
import { PreviewTableStore } from './tableStore';
import lang from '../../../locales';
import IconFont from '../../IconFont/IconFont';
import { Icon, Dropdown, Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';

const ResizeableTitle: React.FC<any> = (props: any) => {
	let {
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

	let menuRef: any = React.createRef();
	let visible = false;

	const onContextMenu = (e: any, title: string) => {
		callback.handlerOnClickColumnMenu(uid);
		e.preventDefault();
		e.stopPropagation();
	};

	const onClickEdit = (e: any, title: string) => {
		if (callback && callback.handlerChangeColumnEdit) {
			callback.handlerChangeColumnEdit(index, !editing);
		}
		e.preventDefault();
		e.stopPropagation();
	};

	const onClickMenu = (e: any) => {
		callback.handlerOnClickColumnMenu(uid);
		console.log(`------------->>>>>>`);
		e.preventDefault();
		e.stopPropagation();
	};

	const onBlurInput = (e: any, title: string) => {
		if (callback && callback.handlerChangeColumnEdit) {
			callback.handlerChangeColumnEdit(index, false);
		}
		s.previewTableHander.handlerRename(uid, e.target.value);
		e.preventDefault();
	};

	const onChangeInput = (e: any, title: string) => {
		title = e.target.value;
		if (callback && callback.handlerChangeColumnTitle) {
			callback.handlerChangeColumnTitle(index, title);
		}
		e.preventDefault();
	};

	const getColunmMenu = (): any => {
		const ss = s.previewTableHander.handlerGetColumnMenu(uid, index);
		return ss ? ss : <div></div>;
	};

	// const getColunmMenu1 = (show: boolean): any => {
	// 	// debugger;
	// 	// return getMenu(uid, index);
	// 	// getColunmMenu = s.previewTableHander.handlerGetColumnMenu(uid, index);
	// 	callback.handlerGetColumnMenu(index, title);
	// };

	const onClickColumn = (e: any, colIndex: number) => {
		store.previewTableHander.handlerClickColumn(colIndex);
		s.onSetSelected(-1, colIndex);
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
							style={{ width: width < 100 ? 100 : width -5 }}
							className="react-resizable-th"
							onClick={(e) => onClickColumn(e, index)}
							onContextMenu={(e) => onContextMenu(e, title)}
						>
							{editing ? (
								<input
									onChange={(e) => onChangeInput(e, title)}
									onBlur={(e) => onBlurInput(e, title)}
									onClick={(e) => e.stopPropagation()}
									className="resizable-th-title"
									value={title}
								/>
							) : (
								<span
									style={{ width: width < 100 ? 100 : width - 5 }}
									title={title}
									className="resizable-th-title"
								>
									{title}
								</span>
							)}
							{!editing ? (
								<span className="resizable-th-action" ref={menuRef}>
									<IconFont
										onClick={(e: React.MouseEvent) => onClickEdit(e, title)}
										title={lang.CustomTask.EditFieldName}
										type="icon-icon-checkin"
									/>
									<Dropdown
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
				<th style={{ width: 40 }}></th>
			)}
		</>
	);
};

export default ResizeableTitle;
