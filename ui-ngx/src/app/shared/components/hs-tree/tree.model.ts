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
  featureList: Array<ITreeFeatureList>;
  deleteEvent?: (node: any, jsTree: any) => Promise<boolean>;
  selectEvent?: (node: any, jsTree: any) => void;
  createNodeSuccess?: (node: any, jsTree: any) => void;
  copyPasteNodeSuccess?: (node: any, jsTree: any) => void;
  deleteNodeSuccess?: (node: any, jsTree: any) => void;
  renameNodeSuccess?: (node: any, jsTree: any) => void;
}
