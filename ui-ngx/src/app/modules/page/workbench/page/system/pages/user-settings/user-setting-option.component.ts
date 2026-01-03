import { Component, model, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { folders } from './data.model';

@Component({
  selector: 'hs-user-setting-option',
  template: `
    <mat-list>
      @for (item of folders; track $index) {
        @if (item.type === 'title') {
          <div
            mat-subheader
            class="hs-list-title"
          >
            {{ item.name }}
          </div>
        } @else {
          @let isNextTitle =
            folders[$index + 1] && folders[$index + 1].type === 'title';
          <mat-list-item
            role="listitem"
            (click)="ngModel.set(item.key!)"
            [class.hs-list-active]="ngModel() === item.key"
            [style.marginBottom]="isNextTitle && '20px'"
            class="hs-list-item"
          >
            <mat-icon
              class="hs-icon-16"
              matListItemIcon
              >{{ item.icon }}</mat-icon
            >
            <span>{{ item.name }}</span>
          </mat-list-item>
        }
      }
    </mat-list>
  `,
  imports: [MatListModule, MatIconModule, MatDividerModule],
})
export class UserSettingOptionComponent implements OnInit {
  ngModel = model<string>();

  folders = folders;

  constructor() {}

  ngOnInit() {}
}
