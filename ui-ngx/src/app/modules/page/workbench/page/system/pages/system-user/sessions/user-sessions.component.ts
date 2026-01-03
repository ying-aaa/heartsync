import { Component, OnInit, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHttpService } from '@src/app/core/http/auth.http.service';
import { HsDynamicTableModule } from '@shared/components/hs-table/hs-dynamic-table.module';
import {
  PageLink,
  IDynamicTable,
  TextColumn,
  DateColumn,
  ActionColumn,
} from '@src/app/shared/components/hs-table/table.model';
import { Observable, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IUserSession } from '@src/app/shared/models/user.model';

@Component({
  selector: 'hs-user-sessions',
  templateUrl: './user-sessions.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    HsDynamicTableModule,
  ],
})
export class UserSessionsComponent implements OnInit {
  userId = input<string | null>();

  searchValue = new FormControl('');

  pageLink = new PageLink(0, 10);

  tableConfig = signal<IDynamicTable>(
    new IDynamicTable({
      initExec: true,
      pageLink: this.pageLink,
      tableColumn: [
        new TextColumn('clientsName', '访问客户端', {}, 200),
        new TextColumn('ipAddress', 'IP地址', {}, 200),
        new DateColumn('start', '登录时间', {}, 200),
        new DateColumn('lastAccess', '最后访问', {}, 200),
        new ActionColumn(
          'actions',
          '操作',
          [
            {
              name: '注销会话',
              icon: 'delete',
              moreName: '确认注销会话',
              action: this.onRevokeSession.bind(this),
            },
          ],
          100,
        ),
      ],
      getData: () =>
        this.getUserSessions().pipe(
          map((data) => ({
            data: data.map((item) => ({
              ...item,
              clientsName: Object.values(item.clients)
                .map((clientName) => clientName)
                .join('\n'),
            })),
          })),
        ),
      layouts: ['paginator', 'total', 'first/last'],
      pageSizes: [5, 10, 20, 50],
    }),
  );

  constructor(
    private authHttpService: AuthHttpService,
    private toastrService: ToastrService,
  ) {}

  ngOnInit() {
    if (this.userId()) {
      this.pageLink.getData();
    }
  }

  onQueryData() {
    this.pageLink.getData();
  }

  getUserSessions(): Observable<IUserSession[]> {
    if (!this.userId()) {
      return new Observable((observer) => {
        observer.next([]);
        observer.complete();
      });
    }
    return this.authHttpService.getUserSessions(this.userId()!) as Observable<IUserSession[]>;
  }

  onRevokeSession(session: IUserSession) {
    this.authHttpService.revokeSession(session.id).subscribe(() => {
      this.toastrService.success('会话已注销');
      this.pageLink.getData();
    });
  }
}
