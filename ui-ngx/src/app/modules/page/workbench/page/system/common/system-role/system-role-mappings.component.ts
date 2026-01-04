import { Component, computed, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HsDynamicTableModule } from '@shared/components/hs-table/hs-dynamic-table.module';
import {
  PageLink,
  IDynamicTable,
  TextColumn,
  ActionColumn,
  SelectionColumn,
  IDataType,
} from '@src/app/shared/components/hs-table/table.model';
import { map, merge, Observable, of, startWith } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthHttpService } from '@src/app/core/http/auth.http.service';
import { IClientMappingsAccount, IRoleMapping } from '@src/app/shared/models/user.model';

@Component({
  selector: 'hs-system-role-mappings',
  templateUrl: './system-role-mappings.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    HsDynamicTableModule,
  ],
  standalone: true,
})
export class UserRoleMappingsComponent implements OnInit {
  userId = input<string | null>();
  searchValue = new FormControl('');
  selectedApp = new FormControl('');

  pageLink = new PageLink(0, 10, [{ prop: 'search' }], []);

  appList = signal<any[]>([]);

  flatRoleList = signal<any[]>([]);

  tableConfig = signal<IDynamicTable>(
    new IDynamicTable({
      initExec: false,
      selection: true,
      multipleFiled: 'id',
      pageLink: this.pageLink,
      tableColumn: [
        new TextColumn('name', '角色名称', {}, 300),
        new TextColumn('client', '应用', {}, 300),
        new TextColumn(
          'description',
          '描述',
          {
            styles: {
              whiteSpace: 'pre-wrap',
            },
          },
          300,
        ),
        new ActionColumn('actions', '操作', [
          {
            name: '取消分配',
            icon: 'delete',
            moreName: '确认取消分配',
            action: this.onUnassignRole.bind(this),
          },
        ]),
      ],
      getData: this.filterRoleList.bind(this),
      layouts: ['paginator', 'total', 'first/last'],
      pageSizes: [5, 10, 20, 50],
    }),
  );

  constructor(
    private toastrService: ToastrService,
    private authHttpService: AuthHttpService,
    private dialog: MatDialog,
  ) {
    merge(
      this.searchValue.valueChanges.pipe(startWith('')),
      this.selectedApp.valueChanges.pipe(startWith('')),
    ).subscribe(() => {
      this.pageLink.getData();
    });
  }

  filterRoleList(): Observable<IDataType> {
    const searchValue = this.searchValue.value;
    const appId = this.selectedApp.value;
    const roleList = this.flatRoleList().filter((item) => {
      return item.name.includes(searchValue) && (!appId || item.clientId === appId);
    });
    const pageRoleList = roleList.slice(
      this.pageLink.page * this.pageLink.pageSize,
      this.pageLink.page * this.pageLink.pageSize + this.pageLink.pageSize,
    );
    return of({
      data: pageRoleList,
      total: roleList.length,
      page: this.pageLink.page,
      pageSize: this.pageLink.pageSize,
    });
  }

  getRoleMappings() {
    this.authHttpService.getUserRoleMappings(this.userId()!).subscribe((res) => {
      const realmMappings = res.realmMappings || [];
      const clientMappings = res.clientMappings || {};
      const appList = [
        { name: 'realm', id: 'realm', label: '系统角色' },
        ...Object.values(clientMappings).map((value: IClientMappingsAccount) => ({
          name: value.client,
          id: value.id,
          label: value.client,
        })),
      ];
      this.appList.set(appList);

      const clientRoleList = Object.values(clientMappings).map((value: IClientMappingsAccount) =>
        value.mappings.map((item) => ({
          ...item,
          client: value.client,
          clientId: value.id,
        })),
      );
      const realmRoleList = realmMappings.map((item) => ({
        ...item,
        client: 'realm',
        clientId: 'realm',
      }));

      this.flatRoleList.set([...clientRoleList.flat(), ...realmRoleList]);

      this.pageLink.getData();
    });
  }

  onQueryData() {
    this.pageLink.getData();
  }

  onAssignRoles() {
    // 打开分配角色弹窗
    // 这里可以调用一个分配角色的对话框组件
  }

  onUnassignRoles() {
    const selectedIds = this.pageLink.fieldMultipleSelection;
    if (selectedIds.length === 0) {
      this.toastrService.warning('请选择角色');
      return;
    }

    // 批量取消分配
    // selectedIds.forEach((id) => {
    //   this.toastrService.unassignUserRole(this.userId()!, id).subscribe(() => {
    //     this.toastrService.success('角色取消分配成功');
    //     this.pageLink.getData();
    //   });
    // });
  }

  onUnassignRole(role: IRoleMapping) {
    // this.toastrService.unassignUserRole(this.userId()!, role.id).subscribe(() => {
    //   this.toastrService.success('角色取消分配成功');
    //   this.pageLink.getData();
    // });
  }

  ngOnInit() {
    this.getRoleMappings();
  }
}
