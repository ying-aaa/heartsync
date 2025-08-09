import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClient } from '@angular/common/http';
import { debounceTime } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { HsInlineEditorModule } from '@src/app/shared/components/hs-inline-editor/inline-editor.module';
import {
  ApplicationService,
  IAppConfig,
} from '@src/app/core/http/application.service';
import { PageLink } from '@src/app/shared/components/hs-table/table.model';
@Component({
  selector: 'hs-app-workbench',
  styleUrl: './app-workbench.component.less',
  templateUrl: './app-workbench.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDividerModule,
    CommonModule,
    NgScrollbarModule,
    HsInlineEditorModule,
    DatePipe,
  ],
})
export class AppWorkbenchComponent implements OnInit {
  appValue = new FormControl('');
  appList = signal<IAppConfig[]>([]);

  pageLink = new PageLink(0, 100);

  constructor(
    private http: HttpClient,
    private applicationService: ApplicationService,
  ) {
    this.appValue.valueChanges
      .pipe(debounceTime(500)) // 设置节流时间为500ms
      .subscribe((value) => {
        this.getAppList(value);
      });
  }

  getAppList(value: string | null): void {
    this.applicationService.findAllApplications(this.pageLink).subscribe({
      next: (res) => {
        this.pageLink.updateTotal(res.total);
        this.appList.set(res.data);
      },
      error: (err) => console.error('err ->', err),
    });
  }

  navigateToApp(appId: string): void {
    window.open(`/run-app/${appId}`);
  }

  ngOnInit(): void {
    this.getAppList(null);
  }
}
