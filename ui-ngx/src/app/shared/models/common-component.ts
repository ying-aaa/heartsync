import { FileItem } from 'ng2-file-upload';

export type IFileShowType = 'detail' | 'fold-detail' | 'grid' | 'form' | 'more';

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
