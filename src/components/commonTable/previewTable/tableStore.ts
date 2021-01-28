/* eslint-disable array-callback-return */
import { IPreviewTableHander } from './tableInterface';
import { observable, action } from 'mobx';

export interface Column {
	uid: string;
	title: string;
	dataIndex: string;
	width?: number;
	editing: boolean;
	fixed?: string;
	showmenu?: boolean;
	menu?: any;
	belongTo?: string;
}

export interface seletedDom {
	rowIndex: number;
	colIndex: number;
}

export class PreviewTableStore {
	/** 调用 对外的暴露的接口方法 */
	previewTableHander: IPreviewTableHander;
	tableRef: any;
	currSpinDom: HTMLElement | null;
	spinDom: HTMLElement | null;
	taskId: string;
	constructor(handles: IPreviewTableHander) {
		this.previewTableHander = handles;
		this.spinDom = null;
		this.currSpinDom = null;
		this.taskId = '';
	}

	@observable loading: boolean = false;
	@observable dataSource = [];

	@observable tableHeight: number = 200;

	@observable selectdRowIndex: number = -1;
	@observable selectdColIndex: number = -1;

	@observable clickMenuColIndex: string = '';

	_columnWidth = 0;

	_columnIndex: Column[] = [
		{
			uid: 'index',
			title: '#',
			dataIndex: 'index',
			width: 40,
			fixed: 'left',
			editing: false
		}
	];

	@observable columns: Column[] = this._columnIndex;

	@observable
	_handlerOnClickColumnMenu: Function = (uid: string) => {};

	@action
	onInit() {
		this.columns = this.columns.slice(0, 1);
	}

	/**
	 * 新增一列
	 * @param column
	 */
	@action
	onAddColumn(column: Column[]): boolean {
		let res = true;
		column.some((x) => {
			if (this.columns.find((y) => y.dataIndex === x.dataIndex)) {
				res = false;
				return true;
			}
		});

		if (res) {
			this.columns = this.columns.concat(column);
			// 回调函数
			this.previewTableHander.handlerAddColumn(column);
		} else {
			console.error('列不能有相同的 dataIndex');
		}
		if (this.columns.length > 1) {
			delete this.columns[this.columns.length - 1].width;
		}
		return res;
	}

	@action
	onUpdateColunmName(uid: string, newName: string, callbackHander: boolean = false) {
		this.columns.some((column) => {
			if (column.uid === uid) {
				column.title = newName;
				if (callbackHander) {
					this.previewTableHander.handlerRename(uid, newName);
				}
				return true;
			}
		});
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
		// let index = -1;
		// this.columns.forEach((column, ind) => {
		// 	column.showmenu = column.uid === uid;
		// });
		this._handlerOnClickColumnMenu(uid);
		debugger;
	}

	@action
	onHideColunmMenu() {
		const index = -1;
		this.columns.forEach((column, ind) => {
			column.showmenu = false;
		});
	}

	onSetSelected(selectdRowIndex: number, selectdColIndex: number) {
		this.selectdColIndex = selectdColIndex;
		this.selectdRowIndex = selectdRowIndex;
	}

	onClearSelected() {
		this.onSetSelected(-1, -1);
	}

	@action
	onAddInsertColumn(uid: string, column: any) {}

	@action
	onInitColunms(column: Column[]) {
		let res = true;
		this.columns = this._columnIndex;
		column.some((x) => {
			if (this.columns.find((y) => y.dataIndex === x.dataIndex)) {
				res = false;
				return true;
			}
		});

		if (res) {
			this.columns = this.columns.concat(column);
		} else {
			console.error('列不能有相同的 dataIndex');
		}
		if (this.columns.length > 1) {
			delete this.columns[this.columns.length - 1].width;
		}
		return res;
	}

	@action
	onInitData(dataSource: any) {
		this.dataSource = dataSource;
		if (this.clickMenuColIndex) {
			this.onShowColunmMenu(this.clickMenuColIndex);
		}
	}

	@action
	onSetTableHeight(height: number = 0) {
		if (height > 50) {
			this.tableHeight = height;
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

	init(taskId: string, callbackHander: Function) {
		this.taskId = taskId;
		this._handlerOnClickColumnMenu = callbackHander;
	}

	didMountTable(tableRef: any) {
		this.tableRef = tableRef;
		this.spinDom = this.getSpin();
	}

	/**  后台事件  */
	private getTable = (): HTMLElement | null => {
		if (this.tableRef) {
			const element = document.getElementsByClassName(this.tableRef.current.props.className)[0] as HTMLElement;

			if (element) {
				return element;
			}
		}
		return null;
	};

	private getSpin = (): HTMLElement | null => {
		const element = document.getElementsByClassName(`div-spin${this.taskId}`)[0] as HTMLElement;
		if (element) {
			return element;
		}
		return null;
	};

	getTableBody = (): HTMLElement | null => {
		const table = this.getTable();
		if (table) {
			const element = table.getElementsByClassName('ant-table-tbody')[0] as HTMLElement;
			if (element) {
				return element;
			}
		}
		return null;
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

	private setSpinDom = () => {
		const tableBody = this.getTableBody();

		if (tableBody) {
			this.setSpin(tableBody);
		}
	};

	private setSpin = (dom: HTMLElement) => {
		const bounding = dom.getBoundingClientRect();
		if (this.spinDom && bounding) {
			const table = this.getTable();
			let maxWidth = bounding.width;
			if (table) {
				if (maxWidth > table.getBoundingClientRect().width) {
					maxWidth = table.getBoundingClientRect().width;
				}
			}
			this.spinDom.style.display = 'block';
			this.spinDom.style.height = `${this.tableHeight}px`;
			this.spinDom.style.width = `${maxWidth}px`;
			this.spinDom.style.top = `${bounding.y}px`;
			this.spinDom.style.left = `${bounding.x}px`;
			this.currSpinDom = dom;
		}
	};

	private resetSpin = () => {
		if (this.currSpinDom) {
			const bounding = this.currSpinDom.getBoundingClientRect();
			if (this.spinDom && bounding) {
				this.spinDom.style.display = 'block';
				this.spinDom.style.height = `${this.tableHeight}px`;
				this.spinDom.style.width = `${bounding.width - 10}px`;
				this.spinDom.style.top = `${bounding.y}px`;
				this.spinDom.style.left = `${bounding.x}px`;
			}
		}
	};

	private clearSpin = () => {
		if (this.spinDom) {
			this.spinDom.style.display = 'none';
			this.currSpinDom = null;
			this.spinDom.style.height = `0px`;
			this.spinDom.style.width = `0px`;
		}
	};

	private getRandomKey = (): string =>
		Math.random()
			.toString(36)
			.substring(2);
}
