import { IPreviewTableHander } from '../commonTable/privewTable/tableInterface';
import { PreviewTableStore, column } from '../commonTable/privewTable/tableStore';

import { observable } from 'mobx';

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
	 * 点击列头
	 * @param index
	 */
	handlerOnClickMenu(uid: string): void {
		console.log(`>>>>>>>> handlerOnClickMenu`, uid);
	}
	/**
	 * 右键列头
	 * @param index
	 */
	handlerOnContextClick(uid: string): void {
		console.log(`>>>>>>>> handlerOnContextClick`, uid);
	}
	/**
	 * 更新列名
	 * @param index
	 * @param newName
	 */
	handlerRename(uid: string, newName: string): void {
		console.log(`>>>>>>>> handlerRename`, uid, newName);
	}

	/**
	 * 删除列
	 * @param index
	 */
	handlerDeleteColumn(uid: string): void {
		console.log(`>>>>>>>> handlerDeleteColumn`);
	}

	/**
	 * 添加列
	 * @param index
	 * @param name
	 */
	handlerAddColumn(column: column[]): void {
		console.log(`>>>>>>>> handlerAddColumn`);
	}

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
		}
	];

	dataSource = [
		{
			key: '1',
			index: '1',
			date: '胡彦斌',
			amount: 32,
			note: '西湖区湖底公园1号'
		},
		{
			key: '2',
			index: '2',
			date: '胡彦祖',
			amount: 42,
			note: '西湖区湖底公园1号'
		},
		{
			key: '3',
			index: '2',
			date: '胡彦祖',
			amount: 42,
			note:
				'西湖区湖底公园1号 西湖区湖底公园1号  西湖区湖底公园1号  西湖区湖底公园1号 西湖区湖底公园1号 西湖区湖底公园1号 西湖区湖底公园1号  da'
		},
		{
			key: '4',
			index: '2',
			date: '胡彦祖',
			amount: 42,
			note: '西湖区湖底公园1号'
		},
		{
			key: '5',
			index: '2',
			date: '胡彦祖',
			amount: 42,
			note: '西湖区湖底公园1号'
		}
	];
	test = (action: string) => {
		let addKey = '';
		switch (action) {
			case 'init':
				this.previewTableStore.onInit();

				break;
			case 'initData':
				this.previewTableStore.onInitData(this.dataSource);
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
			case 'addData':
				break;
			case 'setloading':
				this.previewTableStore.onSetLoding();
				break;
			case 'clearloading':
				this.previewTableStore.onClearLoding();
				break;
			default:
				this.log('未实现的操作');
				break;
		}
	};
}

export default AppStore;
