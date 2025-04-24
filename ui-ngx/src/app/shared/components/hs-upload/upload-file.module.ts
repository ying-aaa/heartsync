import { NgModule, Type } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { HsFileDialogComponent } from './file-dialog/file-dialog.component';
import { HsFileHandleComponent } from './file-handle/file-handle.component';
import { HsFileListComponent } from './file-list/file-list.component';
import { FileUploadModule } from 'ng2-file-upload';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HsFlieUploadComponent } from './file-upload.component';
import { HsImagePreviewModule } from '@shared/directive/image-preview/image-preview.module';

const uploadFileComponents: Type<any>[] = [
  HsFlieUploadComponent,
  HsFileHandleComponent,
  HsFileDialogComponent,
  HsFileListComponent,
];

@NgModule({
  declarations: [...uploadFileComponents],
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
    MatProgressBarModule,
    HsImagePreviewModule,
  ],
  exports: [...uploadFileComponents],
})
export class HsUploadFileModule {}
