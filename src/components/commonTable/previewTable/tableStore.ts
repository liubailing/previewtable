/* eslint-disable react/no-find-dom-node */
/* eslint-disable array-callback-return */
import { observable, action } from 'mobx';
import { IPreviewTableHander } from './tableInterface';
import ReactDOM from 'react-dom';

export interface Column {
	id?: number;
	uid: string;
	title: string;
	dataIndex: string;
	editing: boolean;
	width?: number;
	fixed?: string;
	showmenu?: boolean;
	belongTo?: string;
	menuType?: string;
	editWarning?: boolean;
	highlight?: boolean;
}

export interface seletedDom {
	rowIndex: number;
	colIndex: number;
}

export class PreviewTableStore {
	/** 调用 对外的暴露的接口方法 */
	previewTableHander: IPreviewTableHander;
	tableRef: any;
	// currSpinDom: HTMLElement | null;
	spinRef: any;
	tableScoll: Element | null;
	taskId: string;
	constructor(handles: IPreviewTableHander) {
		this.previewTableHander = handles;
		this.spinRef = null;
		this.tableScoll = null;
		this.taskId = '';
	}

	@observable loading: boolean = false;
	@observable dataSource: { [key: string]: string | number }[] = [];

	// @observable tableHeight: number = 200;

	/** 选中的行 */
	@observable selectdRowIndex: number = -1;

	/** 选中的列 */
	@observable selectdColIndexUId: string = '';

	/** 打开菜单所在列 */
	@observable clickMenuColIndex: string = '';

	readonly _indexUId: string = 'table-index';
	readonly _indexWidth: number = 40;

	/** 列总宽度 */
	_colTotalWidth = 0;
	/** 单列最小宽度 */
	_colMinWidth = 100;
	/** 缓存宽度 */
	_mapWidth = new Map<string, number>().set('index', this._indexWidth);
	/** 正在被拖动的地段 */
	_dragingUid = '';

	/** 默认第一列 */
	readonly _columnIndex: Column[] = [
		{
			uid: this._indexUId,
			title: '#',
			dataIndex: 'index',
			width: 40,
			// fixed: 'left',
			editing: false
		}
	];

	/** 默认第一列 */
	readonly _baseData: { [key: string]: string | number }[] = [
		{
			key: 'table-row-index',
			dataIndex: 'index'
		}
	];

	/** 字段操作菜单已经被隐藏 */
	_feildMenuIsOpened = false;

	/**  */
	_editUId = '';

	@observable columns: Column[] = this._columnIndex;

	@action
	onInit() {
		this.columns = this.columns.slice(0, 1);

		// 第一列出现双边的bug
		if (this.columns.length === 1) {
			this.columns[0].fixed = '';
		}
		this.dataSource = this._baseData;
	}

	/**
	 * 新增一列
	 * @param column
	 */
	@action
	onAddColumn(column: Column[]): boolean {
		let res = true;
		column.forEach((x) => {
			if (this.columns.find((y) => y.dataIndex === x.dataIndex)) {
				res = false;
			}
			x.width = this._mapWidth.has(x.uid) ? this._mapWidth.get(x.uid) : this._colMinWidth;
		});

		if (res) {
			this.columns = this.columns.concat(column);
			this.columns.forEach((x) => {
				x.showmenu = false;
			});
			// 回调函数
			this.previewTableHander.handlerAddColumn(column);
		} else {
			console.error('列不能有相同的 dataIndex');
		}

		if (this.columns.length > 1) {
			// this.columns[0].fixed = 'left';
		}
		return res;
	}

	/**
	 * 修改字段名
	 * @param uid
	 * @param newName
	 * @param callbackHander
	 */
	@action
	onUpdateColunmName(uid: string, newName: string, callbackHander: boolean = false) {
		this.columns.forEach((column) => {
			if (column.uid === uid) {
				column.title = newName;
				if (callbackHander) {
					this.previewTableHander.handlerRename(uid, newName);
				}
			}
		});
	}

	/**
	 * 进入修改名称状态
	 * @param uid
	 * @param newName
	 * @param callbackHander
	 */
	@action
	onSetUpdateColunmName(uid: string, newName: string, warning: boolean = false) {
		this.columns.forEach((column) => {
			if (column.uid === uid) {
				column.title = newName;
				column.editing = true;
				column.editWarning = warning;
			} else {
				column.editing = false;
				column.editWarning = false;
			}
		});

		this._onSetInputFocus('input-write-warn');
	}

	/**
	 * 复制的列
	 * @param uid 被复制的ID
	 * @param colunm  复制后，要修改的参数，为一个类似colunm参数 object。用来覆盖被复制的列属性。主要是给 uid、dataIndex、title 赋值
	 */
	@action
	onCopyColunm(uid: string, colunm?: any): Column | null {
		let index = -1;
		let newColumn: Column | null = null;
		this.columns.some((column, ind) => {
			if (column.uid === uid) {
				newColumn = { ...column };
				index = ind;
				return true;
			}
		});

		if (index > -1 && newColumn) {
			newColumn = newColumn as Column;
			newColumn.uid = this.getRandomKey();
			newColumn.title = `${newColumn.title}_1`;
			newColumn.dataIndex = this.getRandomKey();
			this.columns = this.columns
				.slice(0, index + 1)
				.concat([{ ...newColumn, ...colunm }], [...this.columns.slice(index + 1)]);
		}
		return newColumn;
	}

	@action
	onDeleteColunm(uid: string) {
		let index = -1;
		this.columns.some((column, ind) => {
			if (column.uid === uid) {
				index = ind;
				return true;
			}
		});
		if (index > -1) {
			this.columns = this.columns.slice(0, index).concat([...this.columns.slice(index + 1)]);
		}
	}

	@action
	onShowColunmMenu(uid: string) {
		this._onClickColumnMenu(uid);
	}

	@action
	onHideColunmMenu() {
		this.columns.forEach((column, ind) => {
			column.showmenu = false;
		});
		this._feildMenuIsOpened = false;
	}

	onSetSelectedByIndex(selectdRowIndex: number, selectdColIndex: number) {
		this.columns.forEach((column, ind) => {
			if (ind === selectdColIndex - 1) {
				this.selectdColIndexUId = column.uid;
			}
		});
		this.selectdRowIndex = selectdRowIndex - 1;
		// 清除
		this._onChangeColumnEditing(this._editUId, false);
	}

	/** 设置选中的组（导出数据节点） */
	@action
	onSetSelectedByGroup(selectdGroup?: string) {
		this.columns.forEach((column, ind) => {
			if (selectdGroup) {
				column.highlight = column.belongTo === selectdGroup;
			} else {
				column.highlight = false;
			}
		});
		// 清除
		// this._onChangeColumnEditing(this._editUId, false);
	}

	onSetSelected(selectdRowIndex: number, selectdColIndexUId: string) {
		this.selectdColIndexUId = selectdColIndexUId;
		this.selectdRowIndex = selectdRowIndex;
		// 清除
		this._onChangeColumnEditing(this._editUId, false);
	}

	onClearSelected() {
		this.onSetSelected(-1, '');
	}

	@action
	onAddInsertColumn(uid: string, column: any) {}

	@action
	onInitColunms(column: Column[]) {
		let res = true;
		this.columns = this._columnIndex;
		this._mapWidth = new Map<string, number>().set('index', this._indexWidth);
		res = this.onAddColumn(column);
		return res;
	}

	@action
	onReRenderColunms(column: Column[]) {
		let res = true;
		this.columns = this._columnIndex;
		res = this.onAddColumn(column);
		return res;
	}

	/**
	 * 设置拖动值
	 * @param uid
	 */
	setDragFromUid = (uid: string) => {
		this._dragingUid = uid;
	};

	/**
	 * 滚动到某列
	 * @param uid
	 */
	scollTo(uid: string) {
		if (this.tableScoll) {
			let left = 0;
			for (const it of this.columns) {
				if (it.uid == uid) {
					break;
				}
				left += it.width || 40;
			}

			this.tableScoll.scrollLeft = left - 40;
			this.onSetSelected(-1, uid);
		}
	}

	/**
	 * 滚动到某组
	 * @param uid
	 */
	scollToGroup(belongTo: string) {
		if (this.tableScoll) {
			let left = 0;
			for (const it of this.columns) {
				if (it.belongTo == belongTo) {
					break;
				}
				left += it.width || 40;
			}

			this.tableScoll.scrollLeft = left - 40;
			this.onSetSelectedByGroup(belongTo);
		}
	}

	/** 初始化数据 */
	@action
	onInitData(dataSource: { [key: string]: string | number }[]) {
		this.dataSource = [...this._baseData, ...dataSource];
		// if (this.clickMenuColIndex && !this._feildMenuIsOpened) {
		// 	this.onShowColunmMenu(this.clickMenuColIndex);
		// }
	}

	@action
	onSetTableHeight(height: number = 0) {
		if (height > 50) {
			// this.tableHseight = height;
		}
	}

	onSetLoding() {
		this.setSpinDom();
	}

	onClearLoding() {
		this.clearSpin();
	}

	getColunms() {
		return this.columns;
	}

	/**  挂载生命周期 后台事件  */

	init(taskId: string) {
		this.taskId = taskId;
	}

	/**  后台事件  */
	getTable = (): HTMLElement | null => {
		if (this.tableRef) {
			// const element = document.getElementsByClassName(this.tableRef.current.props.className)[0] as HTMLElement;
			const element = ReactDOM.findDOMNode(this.tableRef) as HTMLElement;
			if (element) {
				return element;
			}
		}
		return null;
	};

	private getSpin = (): HTMLElement | null => {
		const element = ReactDOM.findDOMNode(this.spinRef) as HTMLElement;
		if (element) {
			return element;
		}
		return null;
	};

	// getTableBody = (): HTMLElement | null => {
	// 	const table = this.getTable();
	// 	if (table) {
	// 		const element = table.getElementsByClassName('ant-table-tbody')[0] as HTMLElement;
	// 		if (element) {
	// 			return element;
	// 		}
	// 	}
	// 	return null;
	// };

	private _onSetInputFocus = (classname: string): void => {
		setTimeout(() => {
			const table = this.getTable();
			if (table) {
				const element = table.getElementsByClassName(classname)[0] as HTMLInputElement;
				if (element) {
					element.focus();
				}
			}
		}, 20);
	};

	getTableNoPlaceholder = (): HTMLElement | null => {
		const table = this.getTable();
		if (table) {
			const element = table.getElementsByClassName('ant-table-placeholder')[0] as HTMLElement;
			if (element) {
				return element;
			}
		}
		return null;
	};

	@action
	_onResize = (index: string) => (e: any, { size }: any) => {
		if (index === this._indexUId) {
			return;
		}

		// const { columns } = this.props.store;
		this.columns.some((x, ind) => {
			if (index === x.uid) {
				this._mapWidth.set(x.uid, size.width);
				x.width = size.width;
				return true;
			}
		});
	};

	/** 显示菜单 */
	@action
	_onClickColumnMenu = (uid: string) => {
		this._feildMenuIsOpened = true;
		this.columns.forEach((x) => {
			x.showmenu = x.uid === uid && !x.showmenu;
		});
		this.clickMenuColIndex = uid;
	};

	/**
	 * 修改列头
	 */
	@action
	_onChangeColumnTitle = (uid: string, val: string) => {
		this.columns.forEach((x) => {
			if (x.uid === uid) {
				x.title = val;
				x.editWarning = false;
			}
		});
	};

	/**
	 * 修改列头
	 */
	@action
	_onChangeColumnEditing = (uid: string, val: boolean) => {
		this.columns.forEach((x) => {
			if (x.uid === uid) {
				x.editing = val;
				x.editWarning = false;
				this._editUId = val ? x.uid : '';
			}
		});
		this._onSetInputFocus(`th-input-${uid}`);
	};

	private setSpinDom = () => {
		// const bounding = dom.getBoundingClientRect();
		const spinDom = this.getSpin();
		if (spinDom) {
			spinDom.style.display = 'block';
			spinDom.style.top = `42px`;
			spinDom.style.left = `0px`;
			spinDom.style.bottom = `0px`;
			spinDom.style.right = `0px`;
		}
	};

	private clearSpin = () => {
		const spinDom = this.getSpin();
		if (spinDom) {
			spinDom.style.display = 'none';
		}
	};

	// 判断系统类型
	isMac(): boolean {
		const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
		if (isMac) {
			// your code
			return true;
		}
		return false;
	}

	private getRandomKey = (): string =>
		Math.random()
			.toString(36)
			.substring(2);
}
