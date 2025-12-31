import { Component, computed, effect, input, OnInit, signal } from '@angular/core';
import { HsDynamicTableModule } from '@shared/components/hs-table/hs-dynamic-table.module';
import { AuthHttpService } from '@src/app/core/http/auth.http.service';
import {
  ActionColumn,
  IDynamicTable,
  PageLink,
  TextColumn,
} from '@src/app/shared/components/hs-table/table.model';
import { IAnyPropObj } from '@src/app/shared/models/common-component';
import { map } from 'rxjs';

@Component({
  selector: 'hs-groups-members',
  templateUrl: './groups-members.component.html',
  imports: [HsDynamicTableModule],
})
export class GroupsMembersComponent implements OnInit {
  activeGroup = input<IAnyPropObj | null>();
  groupId = computed(() => this.activeGroup()?.['id']);

  pageLink = new PageLink(0, 10);

  tableConfig = signal<IDynamicTable>(
    new IDynamicTable({
      initExec: false,
      tableStyle: { },
      trRowStyle: { backgroundColor: 'var(--primary-bg-color)' },
      pageLink: this.pageLink,
      tableColumn: [
        new TextColumn('firstName', '姓名', {}, 300),
        new TextColumn('username', '账号', {}, 300),
        new TextColumn('email', '电子邮件', {}, 300),
        new ActionColumn(
          'actions',
          '操作',
          [
            {
              name: '重命名',
              icon: 'border_color',
              action: (row, event) => {},
            },
            {
              name: '删除',
              icon: 'delete',
              moreName: '确认删除',
              action: (row, event) => {},
            },
          ],
          300,
          'center',
        ),
      ],
      getData: () => {
        const groupId = this.groupId();
        // 将返回数据包一层data
        return this.authHttpService.getGroupMembers(groupId, {}).pipe(map((data) => ({ data })));
      },
      layouts: ['paginator', 'total', 'first/last'],
      pageSizes: [5, 10, 20, 50, 100],
    }),
  );

  constructor(private authHttpService: AuthHttpService) {
    effect(() => {
      const groupId = this.groupId();
      groupId && this.pageLink.getData();
    });
  }

  ngOnInit() {}
}
