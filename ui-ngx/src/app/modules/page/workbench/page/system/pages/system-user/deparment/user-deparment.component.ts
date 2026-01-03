import { Component, OnInit, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHttpService } from '@src/app/core/http/auth.http.service';
import { HsDynamicTableModule } from '@shared/components/hs-table/hs-dynamic-table.module';
import {
  PageLink,
  IDynamicTable,
  TextColumn,
  ActionColumn,
} from '@src/app/shared/components/hs-table/table.model';
import { Observable, map } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// 假设部门数据接口返回的类型
export interface IUserGroup {
  id: string;
  name: string;
  path: string;
}

@Component({
  selector: 'hs-user-deparment',
  templateUrl: './user-deparment.component.html',
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
export class UserDeparmentComponent implements OnInit {
  userId = input<string | null>();

  searchValue = new FormControl('');

  pageLink = new PageLink(0, 10, [{ prop: 'search' }]);

  tableConfig = signal<IDynamicTable>(
    new IDynamicTable({
      initExec: true,
      pageLink: this.pageLink,
      tableColumn: [
        new TextColumn('name', '部门名称', {}, 500),
        new TextColumn(
          'path',
          '部门路径',
          {
            styles: {
              whiteSpace: 'pre-wrap',
            },
          },
          500,
        ),
        new ActionColumn('actions', '操作', [
          {
            name: '离开',
            icon: 'delete',
            moreName: '确认离开部门',
            action: this.onLeaveDepartment.bind(this),
          },
        ]),
      ],
      getData: () => this.getUserDepartment().pipe(map((data) => ({ data }))),
      layouts: ['paginator', 'total', 'first/last'],
      pageSizes: [5, 10, 20, 50],
    }),
  );

  constructor(private authHttpService: AuthHttpService) {
    this.searchValue.valueChanges.subscribe((value) => {
      this.pageLink.changeSearch('search', value);
    });
  }

  ngOnInit() {
    if (this.userId()) {
      this.pageLink.getData();
    }
  }

  onQueryData() {
    this.pageLink.getData();
  }

  getUserDepartment(): Observable<IUserGroup[]> {
    if (!this.userId()) {
      return new Observable((observer) => {
        observer.next([]);
        observer.complete();
      });
    }
    // 调用接口
    return this.authHttpService.getUserGroups(this.userId()!, this.pageLink) as Observable<
      IUserGroup[]
    >;
  }

  onLeaveDepartment(group: IUserGroup) {
    // this.authHttpService.deleteUserGroup(this.userId()!, group.id).subscribe(() => {
    //   this.pageLink.getData();
    // });
  }
}
