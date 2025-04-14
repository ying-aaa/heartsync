import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-add-record',
  templateUrl: './add-record.component.html',
  styleUrls: ['./add-record.component.css'],
  imports: [
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDividerModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatListModule
  ]
})
export class AddRecordComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
