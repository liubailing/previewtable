import { Column } from './tableStore';
export interface IPreviewTableHander {
	/**
	 * 更新列名
	 * @param index
	 * @param newName
	 */
	handlerRename: (belongTo: string | undefined, uid: string, newName: string) => void;
	/**
	 * 删除列
	 * @param index
	 */
	handlerDeleteColumn: (uid: string) => void;
	/**
	 * 添加列
	 * @param index
	 * @param name
	 */
	handlerAddColumn: (column: Column[]) => void;

	/**
	 * 点击单元格
	 * @param rowIndex
	 * @param colIndex
	 */
	handlerClickCell: (uid: string, rowIndex: number, colIndex: number) => void;
	/**
	 *
	 * 点击行
	 * @param rowIndex
	 */
	handlerClickRow: (rowIndex: number) => void;
	/**
	 * 点击列头
	 * @param rowIndex
	 */
	handlerClickColumn: (uid: string, colIndex: number) => void;

	/**
	 * 获取菜单
	 * @param rowIndex
	 */
	handlerGetColumnMenu: (uid: string, show?: boolean) => any;
}
