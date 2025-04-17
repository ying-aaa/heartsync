import { HsUploadFileService, } from './upload-file.service';
import { Component, NgModule } from "@angular/core";
import { HsUploadFlieComponent } from './upload.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FileDialogComponent } from './file-dialog/file-dialog.component';
import { FileHandleComponent } from './file-handle/file-handle.component';
import { BrowserModule } from '@angular/platform-browser';
import { FileListComponent } from './file-list/file-list.component';
import { FileUploadModule } from 'ng2-file-upload';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const uploadFileComponents =[
  HsUploadFlieComponent,
  FileHandleComponent,
  FileDialogComponent,
  FileListComponent,
  FileUploadComponent
]

@NgModule({
  declarations: [...uploadFileComponents],
  providers: [
      HsUploadFileService
  ],
  imports: [
    CommonModule,
    MatIconModule,
    OverlayModule,
    MatDividerModule,
    PortalModule,
    MatButtonModule,
    NgScrollbarModule,
    MatDialogModule,
    MatListModule,
    MatDialogModule,
    FileUploadModule,
    MatProgressBarModule
  ],
  exports: [
    ...uploadFileComponents,    
  ],
})
export class HsUploadFileModule {}
