import { FileItem } from 'ng2-file-upload';

export enum IFileShowType {
  FORM = 'form',
  LIST = 'list',
  DETAIL = 'detail',
}

export interface UploadedFile extends FileItem {
  id: string;
  serverResponse?: {
    name: string;
    size: number;
    url: string;
    uploadDate: Date;
  };
}

export interface IFileData {
  id: string;
  name: string;
  url: string;
}

export interface IAnyPropObj {
  [key: string]: any;
}
