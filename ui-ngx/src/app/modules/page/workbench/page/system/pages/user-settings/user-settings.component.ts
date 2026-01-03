import { Component, OnInit, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { UserSettingOptionComponent } from './user-setting-option.component';
import { folders, IFolderKey } from './data.model';
import { UserSettingContetnComponent } from './user-setting-content.compoent';

@Component({
  selector: 'hs-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.less',
  imports: [
    MatDividerModule,
    UserSettingOptionComponent,
    UserSettingContetnComponent,
  ],
})
export class UserSettingsComponent implements OnInit {
  activeFeature = signal(IFolderKey.Basic);

  folders = folders;

  constructor() {}

  ngOnInit() {}
}
