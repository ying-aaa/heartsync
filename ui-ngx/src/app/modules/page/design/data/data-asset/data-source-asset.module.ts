import { NgModule } from '@angular/core';
import { FormlyRunModule } from '@src/app/modules/formly/formly-run.module';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { HsLoadingModule } from '@src/app/shared/directive/loading/loading.module';
import { CreateDataAssetComponent } from './create-data-asset/create-data-asset.component';
import { EditDataAssetComponent } from './edit-data-asset/edit-data-asset.component';
import { MatTabsModule } from '@angular/material/tabs';
import { HsDynamicTableModule } from '@src/app/shared/components/hs-table/hs-dynamic-table.module';
import { AssetDataComponent } from './edit-data-asset/asset-data/asset-data.component';
// import { AssetFieldComponent } from './edit-data-asset/asset-field/asset-field.component';

@NgModule({
  declarations: [
    CreateDataAssetComponent,
    EditDataAssetComponent,
    AssetDataComponent,
    // AssetFieldComponent,
  ], // 声明弹窗组件
  imports: [
    FormlyRunModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatRippleModule,
    FormlyRunModule,
    HsLoadingModule,
    MatTabsModule,
    HsDynamicTableModule,
  ],
  exports: [
    CreateDataAssetComponent,
    EditDataAssetComponent,
    // AssetDataComponent,
    // AssetFieldComponent,
  ], // 导出组件供其他模块使用
})
export class DataAssetSharedModule {}
