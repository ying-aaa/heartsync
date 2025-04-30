export type ITreeFeatureList =
  "copy" | 'cut' | 'paste' | 'rename' | 'remove' | 'createFile' | 'createFolder' | 'dnd' | 'blank' | "search";

export interface IFileTreeConfig {
  featureList: Array<ITreeFeatureList>,
  deleteEvent?: (node: any, jsTree: any) => boolean 
  selectEvent?: (node: any, jsTree: any) => void 
}