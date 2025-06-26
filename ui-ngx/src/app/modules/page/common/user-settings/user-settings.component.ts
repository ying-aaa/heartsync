import { Component, OnInit, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { UserFeatureListComponent } from './user-feature-list.component';
import { folders, IFolderKey } from './data.model';
import { UserFeatureContetnComponent } from './user-feature-content.compoent';

@Component({
  selector: 'hs-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.less',
  imports: [
    MatDividerModule,
    UserFeatureListComponent,
    UserFeatureContetnComponent,
  ],
})
export class UserSettingsComponent implements OnInit {
  activeFeature = signal(IFolderKey.Basic);

  folders = folders;

  constructor() {}

  ngOnInit() {}
}
