import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HsDynamicTableModule } from '@shared/components/hs-table/hs-dynamic-table.module';
import { UserHttpService } from '@src/app/core/http/user.service';
import { PageLink } from '@src/app/shared/components/hs-table/table.model';
import {} from '@src/app/shared/models/common-component';
import { map, Subject, takeUntil } from 'rxjs';
import { isMobile } from '@src/app/core/utils';
import { CreateRoleComponent } from './create-role/create-role.component';
import { MatListModule } from '@angular/material/list';
import { debounceTime, switchMap, throttleTime } from 'rxjs/operators';

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
    MatListModule,
  ],
})
export class RoleListComponent implements OnInit, OnDestroy {
  searchValue = new FormControl('');
  seletedRoleId = signal<string | null>(null);
  pageLink = new PageLink(0, 20, [{ prop: 'search' }], []);
  roleList = signal<any>([]);

  private requestTrigger$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(
    private userHttpService: UserHttpService,
    private dialog: MatDialog,
  ) {
    this.pageLink.setGetData(this.triggerRequest.bind(this));
  }

  ngOnInit(): void {
    this.initLoadData();
    this.handleSearchInput();
    this.triggerRequest();
  }

  private initLoadData(): void {
    this.requestTrigger$
      .pipe(
        throttleTime(500, undefined, { leading: true, trailing: false }),
        switchMap(() => this.userHttpService.getRealmRoles(this.pageLink)),
        map((data) => ({ data })),
        takeUntil(this.destroy$),
      )
      .subscribe((res) => {
        this.roleList.set(res.data);
        if (!this.seletedRoleId() && res.data.length) {
          const roleId = res.data[0]?.id;
          this.seletedRoleId.set(roleId);
        }
      });
  }

  private handleSearchInput(): void {
    this.searchValue.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.pageLink.changeSearch('search', value);
        this.triggerRequest();
      });
  }

  triggerRequest(): void {
    this.requestTrigger$.next();
  }

  onQueryData(): void {
    this.pageLink.getData();
  }

  onResetData(): void {
    this.searchValue.setValue('');
  }

  onAddRole(): void {
    const width = isMobile() ? '100vw' : '800px';
    const height = isMobile() ? '100vh' : 'auto';
    const dialogRef = this.dialog.open(CreateRoleComponent, {
      width,
      height,
      minWidth: width,
      minHeight: height,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.pageLink.getData();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.requestTrigger$.complete();
  }
}
