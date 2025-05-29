import { Component, computed, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '@src/app/core/auth/auth.service';

@Component({
  selector: 'hs-workbench-user-dropdown',
  templateUrl: './workbench-user-dropdown.component.html',
  styleUrls: ['./workbench-user-dropdown.component.less'],
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatRippleModule],
})
export class WorkbenchUserDropdownComponent implements OnInit {
  constructor(private authService: AuthService) {}

  isAuthenticated = computed(() => this.authService.isAuthenticated());

  username = computed(() => this.authService.username());

  ngOnInit() {}

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
