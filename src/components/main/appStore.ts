import { IPreviewTableHander } from '../commonTable/previewTable/tableInterface';
import { PreviewTableStore, Column } from '../commonTable/previewTable/tableStore';
import PreviewTableMenu from './components/index';
import { observable, action } from 'mobx';

/**
 * Use a linkDataArray since we'll be using a GraphLinksModel,
 * and modelData for demonstration purposes. Note, though, that
 * both are optional props in ReactDiagram.
 */
export class AppStore implements IPreviewTableHander {
	previewTableStore: PreviewTableStore;
	constructor(taskId: string) {
		this.taskId = taskId;
		this.previewTableStore = new PreviewTableStore(this);
	}
	@observable logs: string[] = [];
	@observable taskId = '';

	// @action
	log(str: string) {
		this.logs.push(str);
	}

	/********** 回调函数 begin **********/

	/**
	 * 更新列名
	 * @param index
	 * @param newName
	 */
	handlerRename(uid: string, newName: string): void {
		this.log(`>>>>>>>> handlerRename, ${uid},${newName}`);
	}

	/**
	 * 删除列
	 * @param index
	 */
	handlerDeleteColumn(uid: string): void {
		this.log(`>>>>>>>> handlerDeleteColumn`);
	}

	/**
	 * 添加列
	 * @param index
	 * @param name
	 */
	handlerAddColumn(column: Column[]): void {
		this.log(`>>>>>>>> handlerAddColumn`);
	}

	/**
	 * 点击单元格
	 * @param rowIndex
	 * @param colIndex
	 */
	handlerClickCell(uid: string, rowIndex: number, colIndex: number): void {
		this.log(`>>>>>>>> handlerClickCell,${uid},${rowIndex},${colIndex}`);
	}
	/**
	 * 点击行
	 * @param rowIndex
	 */
	handlerClickRow(rowIndex: number): void {
		this.log(`>>>>>>>> handlerClickRow,${rowIndex}`);
	}

	/**
	 * 点击列头
	 * @param rowIndex
	 */
	handlerClickColumn(uid: string, colIndex: number): void {
		this.log(`>>>>>>>> handlerClickColunm,${uid},${colIndex}`);
	}

	handlerGetColumnMenu(uid: string, colIndex: number): any {}

	/********** 回调函数 bend **********/

	tempActionData: any = null;

	columns = [
		{
			uid: 'sss4',
			title: 'Date wqqwe  你好啊',
			dataIndex: 'date',
			width: 100,
			editing: false
		},
		{
			uid: 'sss3',
			title: 'Amount',
			dataIndex: 'amount',
			width: 100,
			editing: false
		},
		{
			uid: 'sss2',
			title: 'Type',
			dataIndex: 'type',
			width: 100,
			editing: false
		},
		{
			uid: 'sss1',
			title: 'Note',
			dataIndex: 'note',
			width: 100,
			editing: false
		},
		{
			uid: 'sss41',
			title: 'Date wqqwe  你好啊',
			dataIndex: 'date1',
			width: 100,
			editing: false
		}
		// {
		// 	uid: 'sss31',
		// 	title: 'Amount',
		// 	dataIndex: 'amount1',
		// 	width: 100,
		// 	editing: false
		// },
		// {
		// 	uid: 'sss21',
		// 	title: 'Type',
		// 	dataIndex: 'type1',
		// 	width: 100,
		// 	editing: false
		// },
		// {
		// 	uid: 'sss11',
		// 	title: 'Note',
		// 	dataIndex: 'note1',
		// 	width: 100,
		// 	editing: false
		// }
	];

	test = (action: string) => {
		switch (action) {
			case 'init':
				this.previewTableStore.onInit();
				this.previewTableStore.onSetTableHeight(100);
				this.previewTableStore.onAddColumn(this.columns);
				setTimeout(() => {
					this.previewTableStore.onInitData(this.getDataSource(10));
				}, 1000);
				// this.previewTableStore.onInitData(this.getDataSource(1));
				break;
			case 'initData':
				this.previewTableStore.onInitData(this.getDataSource(10));
				break;
			case 'add_colunm':
				this.previewTableStore.onAddColumn(this.columns);
				break;
			case 'update_colunmName':
				this.previewTableStore.onUpdateColunmName('sss1', '新的名字');
				break;
			case 'copy_colunm':
				this.previewTableStore.onCopyColunm('sss3');
				break;
			case 'delete_colunm':
				this.previewTableStore.onDeleteColunm('sss3');
				break;
			case 'setloading':
				this.previewTableStore.onSetLoding();
				break;
			case 'clearloading':
				this.previewTableStore.onClearLoding();
				break;
			case 'sel_cell':
				this.previewTableStore.onSetSelected(2, 4);
				break;
			case 'sel_col':
				this.previewTableStore.onSetSelected(-1, 3);
				break;
			case 'sel_row':
				this.previewTableStore.onSetSelected(1, -1);
				break;
			case 'sel_none':
				this.previewTableStore.onClearSelected();
				break;

			case 'show_menu':
				this.previewTableStore.onShowColunmMenu('sss1');
				break;
			default:
				this.log('未实现的操作');
				break;
		}
	};

	getDataSource(count: number = 0) {
		const data = [];
		for (let i = 0; i < count; i++) {
			data.push({
				key: `row_${i}`,
				index: i,
				date: '胡彦斌_' + i,
				amount: 32 + i,
				note: `西湖区湖底公园1号_${i}单元`
			});
		}
		return data;
	}
}

export default AppStore;
