import { Component, OnInit } from '@angular/core';
import { FormEditorService } from '@src/app/core/services/form-editor.service';

@Component({
  selector: 'hs-form-design',
  templateUrl: './form-design.component.html',
  styleUrls: ['./form-design.component.less'],
})
export class FormDesignComponent implements OnInit {
  constructor(private formEditorService: FormEditorService) {}

  ngOnInit() {}
}
