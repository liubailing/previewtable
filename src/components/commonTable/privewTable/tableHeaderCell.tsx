import React from 'react';
import { Resizable } from 'react-resizable';
import { PreviewTableStore } from './tableStore';

const ResizeableTitle: React.FC<any> = (props: any) => {
	let { index, onResize, editing, width, callback, title, uid, store, children, ...restProps } = props;
	const s = store as PreviewTableStore;
	// editing = false;
	if (!width) {
		return <th {...restProps} />;
	}

	const onContextMenu = (e: any, title: string) => {
		s.previewTableHander.handlerOnContextClick(uid);
		e.preventDefault();
	};

	const onClickEdit = (e: any, title: string) => {
		if (callback && callback.handlerChangeColumnEdit) {
			callback.handlerChangeColumnEdit(index, !editing);
		}
		e.preventDefault();
	};

	const onClickMenu = (e: any, title: string) => {
		s.previewTableHander.handlerOnClickMenu(uid);
		e.preventDefault();
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


	return (
		<Resizable
			width={width}
			height={0}
			minConstraints={[100, 42]}
			maxConstraints={[300, 42]}
			onResize={onResize}
			draggableOpts={{ enableUserSelectHack: false }}
		>
			<th {...restProps}>
				<div className="react-resizable-th" onContextMenu={(e) => onContextMenu(e, title)}>
					{index > 0 ? (
						editing ? (
							<input
								onChange={(e) => onChangeInput(e, title)}
								onBlur={(e) => onBlurInput(e, title)}
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
							<span onClick={(e) => onClickEdit(e, title)}>修改</span>
							<span onClick={(e) => onClickMenu(e, title)}>... </span>
						</span>
					) : null}
				</div>
			</th>
		</Resizable>
	);
};

export default ResizeableTitle;
