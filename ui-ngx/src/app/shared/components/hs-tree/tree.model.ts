export type ITreeFeatureList =
  | 'copy'
  | 'cut'
  | 'paste'
  | 'rename'
  | 'remove'
  | 'createFile'
  | 'createFolder'
  | 'dnd'
  | 'blank'
  | 'search';

export interface IFileTreeConfig {
  // 是否禁止选择目录
  disableSelectFolder?: boolean;
  featureList: Array<ITreeFeatureList>;
  // 无数据时提示
  noDataText?: string;
  noDataCreate?: boolean;
  // 无数据时是否显示创建数据
  noDataCreateText?: string;
  deleteEvent?: (node: any, jsTree: any) => Promise<boolean>;
  selectEvent?: (node: any, jsTree: any) => void;
  createNodeSuccess?: (node: any, jsTree: any) => void;
  copyPasteNodeSuccess?: (node: any, jsTree: any) => void;
  deleteNodeSuccess?: (node: any, jsTree: any) => void;
  renameNodeSuccess?: (node: any, jsTree: any) => void;
}
