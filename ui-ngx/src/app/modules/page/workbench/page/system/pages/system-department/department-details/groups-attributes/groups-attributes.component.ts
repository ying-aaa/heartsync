import {
  Component,
  computed,
  effect,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserHttpService } from '@src/app/core/http/user.service';
import { FormlyRunModule } from '@src/app/modules/formly/formly-run.module';
import { IAnyPropObj } from '@src/app/shared/models/common-component';
import { IGroupInfo } from '@src/app/shared/models/user.model';

@Component({
  selector: 'hs-groups-attributes',
  templateUrl: './groups-attributes.component.html',
  imports: [FormlyRunModule],
})
export class GroupsAttributesComponent implements OnInit {
  activeGroup = input<IAnyPropObj | null>();
  groupId = computed(() => this.activeGroup()?.['id']);

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

  constructor(private userHttpService: UserHttpService) {
    effect(() => {
      const groupId = this.groupId();
      groupId && this.loadGroupAttributes();
    });
  }

  loadGroupAttributes() {
    const groupId = this.groupId();
    this.userHttpService
      .getGroupAttributes(groupId)
      .subscribe((groupInfo: IGroupInfo) => {
        this.handlerGroupInfo(groupInfo);
      });
  }

  // 转换请求到的群组信息数据
  handlerGroupInfo(groupInfo: IGroupInfo) {
    const attributes = Object.entries(groupInfo.attributes || {}) as [
      string,
      string[],
    ][];

    const attr = attributes.map(([key, value]) => {
      return value.map((value) => ({ key, value }));
    });

    this.model.set({
      attributes: attr.flat(),
    });
  }

  ngOnInit() {}
}
