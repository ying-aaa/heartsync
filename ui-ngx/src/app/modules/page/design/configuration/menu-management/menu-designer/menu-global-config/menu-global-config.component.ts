import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ColorPickerDirective } from 'ngx-color-picker';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'hs-menu-global-config',
  templateUrl: './menu-global-config.component.html',
  imports: [
    MatDivider,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerDirective,
    MatButtonModule,
  ],
})
export class MenuGlobalConfigComponent implements OnInit {
  avtiveTheme = '1';

  formControl = new FormControl<any>(null);

  menuThemes = [
    {
      id: '1',
      name: '苍曜之界',
      style: '科幻、未来、神秘、高端',
      colors: {
        primary: '#0B1F3B',
        secondary: '#C0C0C0',
        accent: '#FFD700',
      },
      // css background 从左到右三层渐变  primary: '#0B1F3B', secondary: '#C0C0C0', accent: '#FFD700',
      background: `linear-gradient(to right, #0B1F3B, #C0C0C0, #FFD700)`,
    },
    {
      id: '2',
      name: '枫烬诗章',
      style: '古典、悲壮、史诗、东方',
      colors: {
        primary: '#8B0000',
        secondary: '#3E2723',
        accent: '#1A1A1A',
      },
      background: `linear-gradient(to right, #8B0000, #3E2723, #1A1A1A)`,
    },
    {
      id: '3',
      name: '雾绒青语',
      style: '治愈、自然、文艺、温柔',
      colors: {
        primary: '#A8B5A0',
        secondary: '#F5F5F5',
        accent: '#D4C5A0',
      },
      background: `linear-gradient(to right, #A8B5A0, #F5F5F5, #D4C5A0)`,
    },
    {
      id: '4',
      name: '电光霓罪',
      style: '赛博朋克、叛逆、夜生活、数字艺术',
      colors: {
        primary: '#9D4EDD',
        secondary: '#00D9FF',
        accent: '#0A0A0A',
      },
      background: `linear-gradient(to right, #9D4EDD, #00D9FF, #0A0A0A)`,
    },
    {
      id: '5',
      name: '雪境缄默',
      style: '极简、纯净、疏离、高端科技',
      colors: {
        primary: '#E0F2F1',
        secondary: '#B2EBF2',
        accent: '#CFD8DC',
      },
      background: `linear-gradient(to right, #E0F2F1, #B2EBF2, #CFD8DC)`,
    },
  ];

  constructor() {}

  ngOnInit() {}
}
