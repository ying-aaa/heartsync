import { Pipe, PipeTransform } from '@angular/core';
import { IFileData } from '@heartsync/types';
import { getImageUrl } from '@src/app/core/utils';

@Pipe({
  name: 'imgUrl',
  pure: false,
})
export class ImgUrlPipe implements PipeTransform {
  transform(fileList: IFileData | IFileData[] | undefined): any {
    if (!fileList) return fileList;
    
    const result = getImageUrl(fileList);

    return result;
  }
}
