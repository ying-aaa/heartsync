
import { NgModule, Type } from '@angular/core';
import { HsDynamicTableComponent } from './hs-dynamic-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatDividerModule } from '@angular/material/divider';
import { HsImagePreviewModule } from '@shared/directive/image-preview/image-preview.module';
import { MatChipsModule } from '@angular/material/chips';
import { HsLoadingModule } from '@shared/directive/loading/loading.module';

const dynamicTableComponents: Type<any>[] = [
  HsDynamicTableComponent,
];

@NgModule({
  declarations: [...dynamicTableComponents],
  imports: [
    CommonModule,
    MatChipsModule,
    MatTableModule,
    HsLoadingModule,
    MatButtonModule,
    MatDividerModule,
    NgScrollbarModule,
    MatCheckboxModule,
    MatPaginatorModule,
    HsImagePreviewModule,
    CdkVirtualScrollViewport
  ],
  exports: [...dynamicTableComponents],

})
export class HsDynamicTableModule { }
