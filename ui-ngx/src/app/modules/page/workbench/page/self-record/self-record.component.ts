import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AddRecordComponent } from './add-record/add-record.component';

@Component({
  selector: 'app-self-record',
  templateUrl: './self-record.component.html',
  styleUrls: ['./self-record.component.less'],
  imports: [MatButtonModule, MatIconModule, MatDialogModule]
})
export class SelfRecordComponent implements OnInit {
  constructor(private dialog: MatDialog) { }

  addRecord() {
    const dialogRef = this.dialog.open(AddRecordComponent, {
      minWidth: '800px',
      height: '600px',

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
  }

}
