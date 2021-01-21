import { column } from './tableStore';
export interface IPreviewTableHander {
	/**
	 * 点击列头
	 * @param index
	 */
	handlerOnClickMenu(uid: string): void;
	/**
	 * 右键列头
	 * @param index
	 */
	handlerOnContextClick(uid: string): void;
	/**
	 * 更新列名
	 * @param index
	 * @param newName
	 */
	handlerRename(uid: string, newName: string): void;
	/**
	 * 删除列
	 * @param index
	 */
	handlerDeleteColumn(uid: string): void;
	/**
	 * 添加列
	 * @param index
	 * @param name
	 */
	handlerAddColumn(column: column[]): void;
}
