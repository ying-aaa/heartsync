import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { IRadioConfig } from '@src/app/shared/models/system.model';
import { ConcatUnitsPipe } from '@src/app/shared/pipes/units.pipe';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { HsRadioComponent } from '@src/app/shared/components/hs-radio/hs-radio.component';
import { HsUploadFileModule } from '@src/app/shared/components/hs-upload/upload-file.module';
import { IFileData, IFileShowType } from '@src/app/shared/models/common-component';

interface InputProps extends FormlyFieldProps {
  uploadUrl: string;
  authToken?: string;
  styles: object;
  maxCount?: number;
  disabled?: boolean;
  fileShowType?: IFileShowType;
  formData?: object;
  multiple?: boolean;
  autoUpload?: boolean;
  allowedFileType: string[] | undefined;
  maxFileSize?: number;
  fold?: boolean;
  foldStartIndex?: number;
  cols?: number;
  fileDataChange?: (fileData: IFileData[]) => void;
  delItemFile?: (fileData: IFileData) => void;
}

@Component({
  selector: 'formly-field-upload',
  template: `
    <div [style]="props['styles'] | concatUnits">
      <hs-file-upload
        [formControl]="formControl"
        [maxCount]="props.maxCount || 9"
        [disabled]="props.disabled || false"
        [fileShowType]="props.fileShowType || 'grid'"
        [uploadUrl]="props.uploadUrl"
        [formData]="props.formData"
        [multiple]="props.multiple || true"
        [autoUpload]="props.autoUpload || true"
        [authToken]="props.authToken || ''"
        [allowedFileType]="props.allowedFileType"
        [maxFileSize]="props.maxFileSize || 5"
        [fold]="props.fold || false"
        [foldStartIndex]="props.foldStartIndex || 3"
        [cols]="props.cols || 3"
        (fileDataChange)="props.fileDataChange && props.fileDataChange($event)"
        (delItemFile)="props.delItemFile && props.delItemFile($event)"
      ></hs-file-upload>
    </div>
  `,
  imports: [MatInputModule, ReactiveFormsModule, ConcatUnitsPipe, HsUploadFileModule],
})
export class FormlyFieldUpload extends FieldType<FieldTypeConfig<InputProps>> {}
