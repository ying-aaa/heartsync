import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClient } from '@angular/common/http';
import { debounceTime } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgScrollbarExt, NgScrollbarModule } from 'ngx-scrollbar';
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
  ],
})
export class AppWorkbenchComponent {
  appValue = new FormControl('');
  appList: any = [];

  constructor(private http: HttpClient) {
    this.appValue.valueChanges
      .pipe(debounceTime(500)) // 设置节流时间为500ms
      .subscribe((value) => {
        this.getAppList(value);
      });
  }

  getAppList(value: string | null): void {
    this.http.get(`/api/app?appValue=${value}`).subscribe({
      next: (data) => {
        this.appList = data;
      },
      error: (err) => console.error('err ->', err),
    });
  }
}
