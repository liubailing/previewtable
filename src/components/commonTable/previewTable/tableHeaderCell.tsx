import React from 'react';
import { Resizable } from 'react-resizable';
import { PreviewTableStore } from './tableStore';
import lang from '../../../locales';
import IconFont from '../../IconFont/IconFont';

const ResizeableTitle: React.FC<any> = (props: any) => {
	const {
		index,
		onResize,
		editing,
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

	const onContextMenu = (e: any, title: string) => {
		s.previewTableHander.handlerOnContextClick(uid);
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

	const onClickMenu = (e: any, title: string) => {
		s.previewTableHander.handlerOnClickMenu(uid);
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

	const onClickColumn = (e: any, colIndex: number) => {
		store.previewTableHander.handlerClickColumn(colIndex);
		s.onSetSelected(-1, colIndex);
		callback.handlerClearColumnEdit();
		e.preventDefault();
	};

	return (
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
				className={`${index > 0 && index === selectdColIndex && selectdRowIndex === -1 ? 'selected-col' : ''}`}
			>
				<div
					className="react-resizable-th"
					onClick={(e) => onClickColumn(e, index)}
					onContextMenu={(e) => onContextMenu(e, title)}
				>
					{index > 0 ? (
						editing ? (
							<input
								onChange={(e) => onChangeInput(e, title)}
								onBlur={(e) => onBlurInput(e, title)}
								onClick={(e) => e.stopPropagation()}
								className="resizable-th-title"
								value={title}
							/>
						) : (
							<span className="resizable-th-title">{title}</span>
						)
					) : null}
					{/* <span>{title}</span> */}
					{index > 0 && !editing ? (
						<span className="resizable-th-action">
							<IconFont
								onClick={(e: React.MouseEvent) => onClickEdit(e, title)}
								title={lang.CustomTask.EditFieldName}
								type="icon-icon-checkin"
								// onClick={(event: React.MouseEvent) => this.toggleEdit(event, col + 1)}
							/>
							{/* <span >修改</span> */}
							<span onClick={(e) => onClickMenu(e, title)}>... </span>
						</span>
					) : null}
				</div>
			</th>
		</Resizable>
	);
};

export default ResizeableTitle;
