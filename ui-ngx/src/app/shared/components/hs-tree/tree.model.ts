export type ITreeFeatureList =
  "copy" | 'cut' | 'paste' | 'rename' | 'remove' | 'createFile' | 'createFolder' | 'dnd' | 'blank' | "search";

export interface IFileTreeConfig {
  featureList: Array<ITreeFeatureList>,
}