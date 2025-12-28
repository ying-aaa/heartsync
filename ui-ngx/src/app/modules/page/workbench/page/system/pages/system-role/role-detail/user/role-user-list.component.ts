import { Component, effect, input, OnInit, signal } from '@angular/core';
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
} from '@src/app/shared/components/hs-table/table.model';
import { IRoleMapping } from '@src/app/shared/models/user.model';
import { map } from 'rxjs';

@Component({
  selector: 'hs-role-user-list',
  templateUrl: './role-user-list.component.html',
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
export class RoleUserListComponent implements OnInit {
  roleMapping = input<IRoleMapping | null>(null);

  searchValue = new FormControl('');

  pageLink = new PageLink(0, 20, [{ prop: 'search' }], []);

  tableConfig = signal<IDynamicTable>(
    new IDynamicTable({
      initExec: false,
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
      ],
      getData: () => {
        return this.authHttpService
          .getRealmRoleUsers(this.roleMapping()!.name, this.pageLink)
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

  constructor(private authHttpService: AuthHttpService) {
    effect(() => {
      const roleMapping = this.roleMapping();
      if (roleMapping) {
        console.log('%c Line:83 🍻 roleMapping', 'color:#2eafb0', roleMapping);
        this.pageLink.getData();
      }
    });

    this.searchValue.valueChanges.subscribe((value) => {
      this.pageLink.changeSearch('search', value);
    });
  }

  ngOnInit() {}
}
