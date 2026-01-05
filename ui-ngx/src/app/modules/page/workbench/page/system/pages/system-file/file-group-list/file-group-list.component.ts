import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HsDynamicTableModule } from '@shared/components/hs-table/hs-dynamic-table.module';
import { AuthHttpService } from '@src/app/core/http/auth.http.service';
import { PageLink } from '@src/app/shared/components/hs-table/table.model';
import {} from '@src/app/shared/models/common-component';
import { map, Subject, takeUntil, throwError } from 'rxjs';
import { isMobile } from '@src/app/core/utils';
import { MatListModule } from '@angular/material/list';
import { catchError, debounceTime, switchMap, tap, throttleTime } from 'rxjs/operators';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { HsLoadingModule } from '@src/app/shared/directive/loading/loading.module';
import { HsSvgModule } from '@src/app/shared/components/hs-svg/hs-svg.module';
import { CreateFileGroupComponent } from './create-file-group/create-file-group.component';
import { UploadFileService } from '@src/app/core/http/upload-file.service';

@Component({
  selector: 'hs-file-group-list',
  templateUrl: './file-group-list.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    HsDynamicTableModule,
    MatButtonModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatIconModule,
    MatListModule,
    NgScrollbarModule,
    HsLoadingModule,
    HsSvgModule,
  ],
})
export class FileGroupListComponent implements OnInit, OnDestroy {
  searchValue = new FormControl('');
  seletedGroupId = signal<string | null>(null);
  pageLink = new PageLink(0, 20, [{ prop: 'search' }], []);
  fileGroupList = signal<any>([]);
  isLoading = signal<boolean>(false);

  private requestTrigger$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(
    private uploadFileService: UploadFileService,
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
        tap((_) => this.isLoading.set(true)),
        throttleTime(500, undefined, { leading: true, trailing: false }),
        switchMap(() => this.uploadFileService.getCategories()),
        map((data) => ({ data })),
        takeUntil(this.destroy$),
        catchError((err) => {
          this.isLoading.set(false);
          return throwError(() => err);
        }),
      )
      .subscribe((res) => {
        this.isLoading.set(false);
        this.fileGroupList.set([{ name: '全部', id: 'all' }, ...res.data]);
        this.seletedGroupId.set('all');
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

  onAddGroup(): void {
    const width = isMobile() ? '100vw' : '800px';
    const height = isMobile() ? '100vh' : 'auto';
    const dialogRef = this.dialog.open(CreateFileGroupComponent, {
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
