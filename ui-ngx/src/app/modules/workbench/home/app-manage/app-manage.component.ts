import { Component, OnInit, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HsTreeComponent } from '@src/app/shared/components/hs-tree/hs-tree.component';
import { HsTableComponent } from '@src/app/shared/components/hs-table/hs-table.component';
import { HsFancytreeComponent } from '../../../../shared/components/hs-fancytree/hs-fancytree.component';

@Component({
  selector: 'app-app-manage',
  templateUrl: './app-manage.component.html',
  imports: [
    MatDividerModule,
    // HsTreeComponent,
    // HsFancytreeComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    HsTableComponent,
  ],
})
export class AppManageComponent implements OnInit {
  treeConfig = signal({});
  fileName = new FormControl('');

  constructor() {}

  ngOnInit() {}
}
