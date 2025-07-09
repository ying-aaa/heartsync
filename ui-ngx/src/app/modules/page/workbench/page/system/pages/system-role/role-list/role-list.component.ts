import { Component, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HsDynamicTableModule } from '@shared/components/hs-table/hs-dynamic-table.module';
import { UserHttpService } from '@src/app/core/http/user.service';
import {
  ActionColumn,
  IDynamicTable,
  PageLink,
  TextColumn,
} from '@src/app/shared/components/hs-table/table.model';
import {} from '@src/app/shared/models/common-component';
import { map } from 'rxjs';
import { isMobile } from '@src/app/core/utils';
import { CreateRoleComponent } from './create-role/create-role.component';
import { Router } from '@angular/router';

@Component({
  selector: 'hs-role-list',
  templateUrl: './role-list.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    HsDynamicTableModule,
    MatButtonModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
})
export class RoleListComponent implements OnInit {
  searchValue = new FormControl('');

  pageLink = new PageLink(0, 20, [{ prop: 'search' }], []);

  tableConfig = signal<IDynamicTable>(
    new IDynamicTable({
      initExec: true,
      tableStyle: { padding: '0 24px' },
      pageLink: this.pageLink,
      tableColumn: [
        new TextColumn(
          'name',
          '角色名称',
          {
            click: (row) => {
              const roleId = row.id;
              const currentRouterUrl = this.router.url;
              this.router.navigate([`${currentRouterUrl}/${roleId}/detail`]);
            },
            styles: {
              color: '#2f90b9',
              lineHeight: '32px',
            },
          },
          300,
          'left',
          'hover-underline',
        ),
        new TextColumn('composite', '复合', {}, 300),
        new TextColumn('description', '描述', {}, 300),
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
        // 将返回数据包一层data
        return this.userHttpService
          .getRealmRoles(this.pageLink)
          .pipe(map((data) => ({ data })));
      },
      layouts: ['paginator', 'total', 'first/last'],
      pageSizes: [5, 10, 20, 50, 100],
    }),
  );

  constructor(
    private userHttpService: UserHttpService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.searchValue.valueChanges.subscribe((value) => {
      this.pageLink.changeSearch('search', value);
    });
  }

  onQueryData() {
    this.pageLink.getData();
  }

  onResetData() {
    this.searchValue.setValue('');
    this.onQueryData();
  }

  onAddRole() {
    // 打开用户添加对话框或页面
    const width = isMobile() ? '100vw' : '800px';
    const height = isMobile() ? '100vh' : 'auto';
    const dialogRef = this.dialog.open(CreateRoleComponent, {
      width,
      height,
      minWidth: width,
      minHeight: height,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.pageLink.getData();
    });
  }

  ngOnInit() {}
}
