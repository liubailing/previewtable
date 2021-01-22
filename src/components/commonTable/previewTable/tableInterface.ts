import { column } from './tableStore';
export interface IPreviewTableHander {
	/**
	 * 点击列头
	 * @param index
	 */
	handlerOnClickMenu: (uid: string) => void;
	/**
	 * 右键列头
	 * @param index
	 */
	handlerOnContextClick: (uid: string) => void;
	/**
	 * 更新列名
	 * @param index
	 * @param newName
	 */
	handlerRename: (uid: string, newName: string) => void;
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
	handlerAddColumn: (column: column[]) => void;

	/**
	 * 点击单元格
	 * @param rowIndex
	 * @param colIndex
	 */
	handlerClickCell: (rowIndex: number, colIndex: number) => void;
	/**
	 * 点击行
	 * @param rowIndex
	 */
	handlerClickRow: (rowIndex: number) => void;
	/**
	 * 点击列头
	 * @param rowIndex
	 */
	handlerClickColumn: (colIndex: number) => void;
}
