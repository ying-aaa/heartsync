import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HsDynamicTableModule } from '@shared/components/hs-table/hs-dynamic-table.module';
import { AuthHttpService } from '@src/app/core/http/auth.http.service';
import { isMobile } from '@src/app/core/utils';
import {
  PageLink,
  IDynamicTable,
  TextColumn,
  ActionColumn,
  SelectionColumn,
  TagColumn,
} from '@src/app/shared/components/hs-table/table.model';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { CreateUserComponent } from './create-user/create-user.component';
import { IUserInfo } from '@src/app/shared/models/user.model';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ToastrService } from 'ngx-toastr';
import { UserDetailComponent } from './user-detail/user-detail.component';

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
      selection: true,
      multipleFiled: 'id',
      trRowStyle: { backgroundColor: 'var(--primary-bg-color)' },
      pageLink: this.pageLink,
      tableColumn: [
        new TextColumn('firstName', '姓名', {}, 300),
        new TextColumn('username', '账号', {}, 300),
        new TextColumn('email', '邮箱', {}, 300),
        new TextColumn(
          'department',
          '部门',
          {
            styles: {
              whiteSpace: 'pre-wrap',
            },
          },
          300,
        ),
        new TagColumn(
          'enabled',
          '状态',
          {
            tagMap: [
              { label: '启用', value: true, color: 'primary' },
              { label: '禁用', value: false, color: 'red' },
            ],
          },
          300,
        ),
        new ActionColumn(
          'actions',
          '操作',
          [
            {
              name: '编辑',
              icon: 'border_color',
              action: this.onEditUser.bind(this),
            },
            {
              name: '密码',
              icon: 'border_color',
              action: this.onResetPassword.bind(this),
            },
            {
              name: '删除',
              icon: 'delete',
              moreName: '确认删除',
              action: (row, event) => {
                this.authHttpService.deleteUser(row.id).subscribe(() => {
                  this.toastrService.success('删除成功');
                  this.pageLink.getData();
                });
              },
            },
          ],
          300,
        ),
      ],
      getData: () => {
        return this.getUsersWithDepartment().pipe(map((data) => ({ data })));
      },
      layouts: ['paginator', 'total', 'first/last'],
      pageSizes: [5, 10, 20, 50, 100],
    }),
  );

  getUsersWithDepartment(): Observable<IUserInfo[]> {
    return this.authHttpService.getUsers(this.pageLink).pipe(
      switchMap((users) => {
        if (users.length === 0) {
          return of([]);
        }

        const orgObservables = users.map((user) => this.authHttpService.getUserGroups(user.id));

        return forkJoin(orgObservables).pipe(
          map((department) => {
            return users.map((user, index) => ({
              ...user,
              department: department[index].reduce((acc, cur) => {
                return acc + cur.path + '\n';
              }, ''),
            }));
          }),
        );
      }),
    );
  }

  onQueryData() {
    this.pageLink.getData();
  }

  onResetData() {
    this.searchValue.setValue('');
    this.onQueryData();
  }

  onEditUser(userInfo: IUserInfo) {
    const width = isMobile() ? '100vw' : '1200px';
    const height = isMobile() ? '100vh' : '100vh';
    this.dialog.open(UserDetailComponent, {
      width,
      height,
      minWidth: width,
      minHeight: height,
      position: { right: '0' },
      panelClass: 'hs-drawer-container',
      autoFocus: false,
      data: {
        userInfo,
      },
    });
  }

  onAddUser() {
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

  // 重置密码
  onResetPassword(userInfo: IUserInfo) {
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      width: '600px',
      data: {
        userInfo,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.pageLink.getData();
    });
  }

  constructor(
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private authHttpService: AuthHttpService,
  ) {
    this.searchValue.valueChanges.subscribe((value) => {
      this.pageLink.changeSearch('search', value);
    });
  }

  ngOnInit() {}
}
