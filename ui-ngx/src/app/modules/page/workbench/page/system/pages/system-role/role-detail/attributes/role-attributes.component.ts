import { Component, computed, effect, input, OnInit, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthHttpService } from '@src/app/core/http/auth.http.service';
import { FormlyRunModule } from '@src/app/modules/formly/formly-run.module';
import { HsLoadingModule } from '@src/app/shared/directive/loading/loading.module';
import { IRoleMapping } from '@src/app/shared/models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'hs-role-attributes',
  templateUrl: './role-attributes.component.html',
  imports: [FormlyRunModule, HsLoadingModule, MatButtonModule, MatDividerModule],
})
export class GroupsAttributesComponent implements OnInit {
  roleMapping = input<IRoleMapping | null>(null);

  loadingStatus = signal<boolean>(false);

  model = signal<any>({
    attributes: [],
  });

  formGroup = new FormGroup({
    attributes: new FormGroup({}),
  });

  fields = [
    {
      type: 'fieldset',
      props: {
        label: '属性配置',
        icon: 'subheader',
        styles: {
          fontSize: 18,
          fontSizeUnits: 'px',
          paddingTop: 8,
          paddingTopUnits: 'px',
        },
      },
      fieldGroup: [
        {
          key: 'attributes',
          type: 'array',
          props: {
            typeName: '普通输入子表',
            placeholder: '',
            disabled: false,
            styles: {
              borderWidth: 0,
              borderRadius: 0,
              borderColor: 'transparent',
            },
          },
          fieldId: 'subtable_key_6566596701791895',
          id: 'formly_25_subtable_6566596701791895_2',
          fieldArray: {
            fieldGroup: [
              {
                key: 'key',
                type: 'input',
                props: {
                  type: 'text',
                  label: '键',
                  placeholder: '输入一个键',
                  appearance: 'outline',
                  density: 5,
                  row: 1,
                },
                className: 'hs-density--5 ',
              },
              {
                key: 'value',
                type: 'input',
                props: {
                  type: 'text',
                  label: '值',
                  placeholder: '输入一个值',
                  appearance: 'outline',
                  density: 5,
                  row: 1,
                },
                className: 'hs-density--5 ',
              },
            ],
          },
        },
      ],
    },
  ];

  constructor(
    private authHttpService: AuthHttpService,
    private toastr: ToastrService,
  ) {
    effect(() => {
      const roleMapping = this.roleMapping();
      if (roleMapping) {
        this.handlerGroupInfo(roleMapping);
      }
    });
  }

  // 转换请求到的群组信息数据
  handlerGroupInfo(roleMapping: IRoleMapping) {
    const attributes = Object.entries(roleMapping.attributes || {}) as [string, string[]][];

    const attr = attributes.map(([key, value]) => {
      return value.map((value) => ({ key, value }));
    });

    this.model.set({
      attributes: attr.flat(),
    });
  }

  onSubmit() {
    this.toastr.warning('权限不足', '', {
      // 居中
      positionClass: 'toast-top-center',
    });
  }

  ngOnInit() {}
}
