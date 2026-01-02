import { Component, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { HsDynamicTableModule } from '@shared/components/hs-table/hs-dynamic-table.module';
import {
  PageLink,
  IDynamicTable,
  TextColumn,
  ActionColumn,
  DateColumn,
} from '@src/app/shared/components/hs-table/table.model';
import { Observable, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { AuthHttpService } from '@src/app/core/http/auth.http.service';
import { IUserCredential, IUserInfo } from '@src/app/shared/models/user.model';
import { MatIconModule } from '@angular/material/icon';
import { HsSvgModule } from '@src/app/shared/components/hs-svg/hs-svg.module';

@Component({
  selector: 'hs-user-credentials',
  templateUrl: './user-credentials.component.html',
  imports: [
    CommonModule,
    MatButtonModule,
    HsDynamicTableModule,
    MatButtonModule,
    MatIconModule,
    HsSvgModule,
  ],
  standalone: true,
})
export class UserCredentialsComponent implements OnInit {
  userId = input<string | null>();

  userInfo = input<IUserInfo>({} as IUserInfo);

  pageLink = new PageLink(0, 10);

  tableConfig = signal<IDynamicTable>(
    new IDynamicTable({
      initExec: true,
      pageLink: this.pageLink,
      tableColumn: [
        new TextColumn('type', '类型', {}, 120),
        new TextColumn('userLabel', '用户标签', {}, 180),
        new DateColumn('createdDate', '创建时间', {}, 200),
        new TextColumn(
          'data',
          '数据',
          {
            styles: {
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            },
          },
          300,
        ),
        new ActionColumn(
          'actions',
          '操作',
          [
            {
              name: '重置密码',
              icon: 'vpn_key',
              action: this.onResetPassword.bind(this),
            },
            {
              name: '删除密码',
              icon: 'delete',
              moreName: '确认删除',
              action: this.onDeleteCredential.bind(this),
            },
          ],
          200,
        ),
      ],
      getData: () =>
        this.authHttpService.getUserCredentials(this.userId()!).pipe(map((data) => ({ data }))),
      layouts: ['paginator', 'total', 'first/last'],
      pageSizes: [5, 10, 20, 50],
    }),
  );

  constructor(
    private toastrService: ToastrService,
    private authHttpService: AuthHttpService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {}

  onResetPassword() {
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      width: '600px',
      data: {
        userId: this.userId(),
        userInfo: this.userInfo(),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.pageLink.getData();
      }
    });
  }

  onDeleteCredential(credential: IUserCredential) {
    this.authHttpService.deleteUserCredential(this.userId()!, credential.id).subscribe(() => {
      this.toastrService.success('凭证删除成功');
      this.pageLink.getData();
    });
  }
}
