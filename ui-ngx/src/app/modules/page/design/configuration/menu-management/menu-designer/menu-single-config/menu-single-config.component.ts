import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ColorPickerDirective } from 'ngx-color-picker';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'hs-menu-single-config',
  templateUrl: './menu-single-config.component.html',
  imports: [
    MatDivider,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIcon
],
})
export class MenuSingleConfigComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
