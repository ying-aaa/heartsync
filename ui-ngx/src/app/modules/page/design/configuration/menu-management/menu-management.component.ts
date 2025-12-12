import { AfterViewInit, Component, OnInit, signal, ViewChild } from '@angular/core';
import { MenuTreeComponent } from './menu-tree/menu-tree.component';
import { MenuDesignerComponent } from './menu-designer/menu-designer.component';
import { MatDivider } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hs-menu-management',
  template: `
    <header class="h-60px p-20px flex flex-row-reverse items-center">
      <button mat-flat-button>保存</button>
      <button mat-button class="mr-12px" (click)="snav.toggle()">高级设置</button>
    </header>

    <mat-divider class="w-full"></mat-divider>

    <mat-sidenav-container class="h-[calc(100%-61px)] sidenav-fullscreen-backdrop">
      <mat-sidenav
        #snav
        position="end"
        [style.width.px]="1200"
        [mode]="isMobile() ? 'over' : 'side'"
        [fixedInViewport]="isMobile()"
        [opened]="false"
      >
        <div class="wh-full bg-[var(--base-bg-color)] p-20px box-sizing-border">
          <button mat-icon-button (click)="snav.toggle()"><mat-icon> close </mat-icon></button>
          @if (isMenuModuleLoaded) {
            <hs-menu-tree class="h-[calc(100%-40px)]!"></hs-menu-tree>
          }
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="overflow-hidden!">
        <hs-menu-designer></hs-menu-designer>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  imports: [
    MenuTreeComponent,
    MenuDesignerComponent,
    MatDivider,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
  ],
})
export class MenuManagementComponent implements OnInit, AfterViewInit {
  @ViewChild('snav') snav!: MatSidenav;

  protected readonly isMobile = signal(true);

  isMenuModuleLoaded = false;

  subscription: Subscription;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.subscription = this.snav.openedChange.subscribe((isOpened) => {
      if (isOpened) {
        this.isMenuModuleLoaded = isOpened;
        this.subscription.unsubscribe();
      }
    });

    this.snav.toggle();
  }
}
