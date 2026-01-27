import { NgModule } from '@angular/core';
import { FormlyRunModule } from '@src/app/modules/formly/formly-run.module';
import { CreateDataSourceComponent } from './create-data-source/create-data-source.component';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { HsLoadingModule } from '@src/app/shared/directive/loading/loading.module';
import { NgScrollbarModule } from "ngx-scrollbar";

@NgModule({
  declarations: [CreateDataSourceComponent], // 声明弹窗组件
  imports: [
    FormlyRunModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatRippleModule,
    FormlyRunModule,
    HsLoadingModule,
    NgScrollbarModule
],
  exports: [CreateDataSourceComponent], // 导出组件供其他模块使用
})
export class DataSourceSharedModule {}
