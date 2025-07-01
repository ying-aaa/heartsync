import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HsDynamicTableModule } from '@shared/components/hs-table/hs-dynamic-table.module';
import { UserHttpService } from '@src/app/core/http/user.service';
import { isMobile } from '@src/app/core/utils';
import {
  PageLink,
  IDynamicTable,
  TextColumn,
  ActionColumn,
} from '@src/app/shared/components/hs-table/table.model';
import { map } from 'rxjs';
import { CreateUserComponent } from './create-user/create-user.component';

@Component({
  selector: 'hs-system-user',
  templateUrl: './system-user.component.html',
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
export class SystemUserComponent implements OnInit {
  searchValue = new FormControl('');

  pageLink = new PageLink(0, 20, [{ prop: 'search' }], []);

  tableConfig = signal<IDynamicTable>(
    new IDynamicTable({
      initExec: true,
      tableStyle: { padding: '0 24px' },
      pageLink: this.pageLink,
      tableColumn: [
        new TextColumn('firstName', '姓名', {}, 300),
        new TextColumn('username', '账号', {}, 300),
        new TextColumn('department', '部门', {}, 300),
        // new TagColumn(
        //   'lastName',
        //   '相关角色',
        //   {
        //     tagMap: [{ label: '管理员', value: 'active', color: 'green' }],
        //   },
        //   300,
        // ),
        new ActionColumn(
          'actions',
          '操作',
          [
            {
              name: '编辑',
              icon: 'border_color',
              action: (row, event) => {
                event.stopPropagation();
              },
            },
            {
              name: '密码',
              icon: 'border_color',
              action: (row, event) => {
                event.stopPropagation();
              },
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
        return this.userHttpService
          .getUsers(this.pageLink)
          .pipe(map((data) => ({ data })));
      },
      layouts: ['paginator', 'total', 'first/last'],
      pageSizes: [5, 10, 20, 50, 100],
    }),
  );

  onQueryData() {
    this.pageLink.getData();
  }

  onResetData() {
    this.searchValue.setValue('');
    this.onQueryData();
  }

  // 新增用户
  onAddUser() {
    // 打开用户添加对话框或页面
    const width = isMobile() ? '100vw' : '800px';
    const height = isMobile() ? '100vh' : 'auto';
    const dialogRef = this.dialog.open(CreateUserComponent, {
      width,
      height,
      minWidth: width,
      minHeight: height,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.pageLink.getData();
    });
  }

  constructor(
    private userHttpService: UserHttpService,
    private dialog: MatDialog,
  ) {
    this.searchValue.valueChanges.subscribe((value) => {
      this.pageLink.changeSearch('search', value);
    });
  }

  ngOnInit() {
    this.onAddUser();
  }
}
