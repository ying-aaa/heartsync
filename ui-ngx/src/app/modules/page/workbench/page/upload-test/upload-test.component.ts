import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FileSelectDirective, FileDropDirective, FileUploader, FileUploadModule } from 'ng2-file-upload';

// const URL = '/api/';
const URLs = 'http://localhost:3000/api/';
 
@Component({
  selector: 'upload-test',
  templateUrl: './upload-test.component.html',
  styleUrls: ['./upload-test.component.less'],
  imports: [FileUploadModule, CommonModule]
})
export class UploadTestComponent {
 
  uploader:FileUploader;
  hasBaseDropZoneOver:boolean;
  hasAnotherDropZoneOver:boolean;
  response:string;
 
  constructor (){
    this.uploader = new FileUploader({
      url: URLs,
      disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item: any) => {
        return new Promise( (resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });
 
    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;
 
    this.response = '';
 
    this.uploader.response.subscribe( res => this.response = res );
  }
 
  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
 
  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }
}