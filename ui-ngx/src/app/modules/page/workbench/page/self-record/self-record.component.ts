import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AddRecordComponent } from './add-record/add-record.component';
import { isMobile } from '@src/app/core/utils';
import { SelfRecordService } from '@src/app/core/http/self-record.service';
import { MatListModule } from '@angular/material/list';
import { DatePipe } from '@angular/common';
import { HsImagePreviewModule } from '@shared/directive/image-preview/image-preview.module';

@Component({
  selector: 'app-self-record',
  templateUrl: './self-record.component.html',
  styleUrls: ['./self-record.component.less'],
  imports: [
    HsImagePreviewModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatListModule,
    DatePipe,
  ],
})
export class SelfRecordComponent implements OnInit {
  recordData: any = [];

  constructor(
    private dialog: MatDialog,
    private selfRecordService: SelfRecordService,
  ) {}

  addRecord() {
    const width = isMobile() ? '100vw' : '800px';
    const height = isMobile() ? '100vh' : '600px';
    const dialogRef = this.dialog.open(AddRecordComponent, {
      width,
      height,
      minWidth: width,
      minHeight: height,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getRecordData();
    });
  }

  getRecordData() {
    this.selfRecordService.getAll().subscribe((res: any) => {
      this.recordData = res;
    });
  }

  ngOnInit() {
    this.getRecordData();
  }
}
