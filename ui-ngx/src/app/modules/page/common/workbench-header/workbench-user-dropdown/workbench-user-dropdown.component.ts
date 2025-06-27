import { Component, computed, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '@src/app/core/auth/auth.service';
import { isMobile } from '@src/app/core/utils';
import { UserSettingsComponent } from '../../user-settings/user-settings.component';

@Component({
  selector: 'hs-workbench-user-dropdown',
  templateUrl: './workbench-user-dropdown.component.html',
  styleUrls: ['./workbench-user-dropdown.component.less'],
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatRippleModule],
})
export class WorkbenchUserDropdownComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
  ) {
    setTimeout(() => {
      this.openUserSettings();
    }, 50);
  }

  isAuthenticated = computed(() => this.authService.isAuthenticated());

  username = computed(() => this.authService.username());

  openUserSettings() {
    const width = isMobile() ? '100vw' : '880px';
    const height = isMobile() ? '100vh' : '600px';
    const dialogRef = this.dialog.open(UserSettingsComponent, {
      width,
      height,
      minWidth: width,
      minHeight: height,
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  ngOnInit() {}
}
