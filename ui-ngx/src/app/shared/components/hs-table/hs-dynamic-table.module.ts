
import { NgModule, Type } from '@angular/core';
import { HsDynamicTableComponent } from './hs-dynamic-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

const dynamicTableComponents: Type<any>[] = [
  HsDynamicTableComponent,
];

@NgModule({
  declarations: [...dynamicTableComponents],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    NgScrollbarModule,
    MatCheckboxModule,
    MatPaginatorModule,
    CdkVirtualScrollViewport
  ],
  exports: [...dynamicTableComponents],

})
export class HsDynamicTableModule { }
