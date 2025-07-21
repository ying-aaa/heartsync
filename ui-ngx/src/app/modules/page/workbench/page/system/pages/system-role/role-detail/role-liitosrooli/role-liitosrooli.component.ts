import {
  Component,
  computed,
  effect,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { HsDynamicTableModule } from '@shared/components/hs-table/hs-dynamic-table.module';
import { UserHttpService } from '@src/app/core/http/user.service';
import {
  ActionColumn,
  IDynamicTable,
  PageLink,
  TextColumn,
} from '@src/app/shared/components/hs-table/table.model';
import { map } from 'rxjs';

@Component({
  selector: 'hs-role-liitosrooli',
  templateUrl: './role-liitosrooli.component.html',
  imports: [HsDynamicTableModule],
})
export class RoleLiitosrooliComponent implements OnInit {
  roleId = input.required<string | null>();

  pageLink = new PageLink(0, 10);

  tableConfig = signal<IDynamicTable>(
    new IDynamicTable({
      initExec: false,
      tableStyle: { padding: '0 24px' },
      pageLink: this.pageLink,
      tableColumn: [
        new TextColumn('name', '名称', {}, 300),
        new TextColumn('composite', '继承', {}, 300),
        new TextColumn('description', '描述', {}, 300),
        new ActionColumn(
          'actions',
          '操作',
          [
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
        const roleId = this.roleId()!;
        // 将返回数据包一层data
        return this.userHttpService
          .getRoleLiitosrooliById(roleId, this.pageLink)
          .pipe(
            map((data) => {
              return { data };
            }),
          );
      },
      layouts: ['paginator', 'total', 'first/last'],
      pageSizes: [5, 10, 20, 50, 100],
    }),
  );

  constructor(
    private userHttpService: UserHttpService,
  ) {
    effect(() => {
      const roleId = this.roleId()!;
      roleId && setTimeout(() => {
        this.pageLink.getData();
      }, 100);
    });
  }

  ngOnInit() {}
}
