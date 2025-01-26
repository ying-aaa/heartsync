import { Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { HsTreeComponent } from "../../../../shared/components/hs-tree/hs-tree.component";
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-app-manage',
  templateUrl: './app-manage.component.html',
  imports: [
    MatDividerModule,
    HsTreeComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class AppManageComponent implements OnInit {
  fileName = new FormControl("");

  constructor() { }

  ngOnInit() {
  }

}
