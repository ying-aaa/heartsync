import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { getParamFromRoute, handlerNgElStyle } from '@src/app/core/utils';
import { ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { HsLoadingModule } from '@src/app/shared/directive/loading/loading.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { RunAppComponent } from '@src/app/modules/page/run-app/run-app.component';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MenuTreeComponent } from './menu-tree/menu-tree.component';
import { AppConfigComponent } from './app-config/app-config.component';
import { VerseDesignModeSwitchComponent } from '@src/app/shared/components/ui-verse/verse-design-mode-switch/verse-design-mode-switch.component';
import { FormsModule } from '@angular/forms';
import { RunAppDesignService } from '@src/app/core/services/run-app-designer.service';

@Component({
  selector: 'hs-app-page-designer',
  templateUrl: './app-page-designer.component.html',
  imports: [
    MatDivider,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    NgScrollbarModule,
    HsLoadingModule,
    RunAppComponent,
    MenuTreeComponent,
    MatDivider,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    AppConfigComponent,
    FormsModule,
    VerseDesignModeSwitchComponent,
  ],
})
export class AppPageDesignerComponent implements OnInit, AfterViewInit {
  @ViewChild('snav') snav!: MatSidenav;
  @ViewChild('RunApp', { read: ElementRef }) runApp!: ElementRef<RunAppComponent>;

  protected readonly isMobile = signal(true);

  appId: string = getParamFromRoute('appId', this.route)!;
  loadingStatus = false;
  isMenuModuleLoaded = false;

  isDesigner = this.runappDesignService.isDesigner;

  presetComps = signal([
    {
      type: 'title',
      name: '基础菜单',
      icon: 'menu',
      comps: [
        {
          type: 'menu',
          name: '菜单项',
          icon: 'insert_drive_file',
          desc: '基础导航项',
        },
        {
          type: 'submenu',
          name: '子菜单',
          icon: 'folder',
          desc: '包含子项的菜单',
          children: [
            {
              type: 'menu',
              name: '菜单项',
              icon: 'insert_drive_file',
              desc: '基础导航项',
            },
          ],
        },
        {
          type: 'divider',
          name: '分割线',
          icon: 'horizontal_rule',
          desc: '分隔不同菜单项',
        },
      ],
    },
    {
      type: 'title',
      name: '高级组件',
      icon: 'menu',
      comps: [
        {
          type: 'search',
          name: '搜索框',
          icon: 'search',
          desc: '菜单内搜索功能',
        },
        {
          type: 'user',
          name: '用户信息',
          icon: 'face',
          desc: '显示用户资料',
        },
      ],
    },
  ]);

  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private runappDesignService: RunAppDesignService,
    public renderer: Renderer2,
  ) {
    this.runappDesignService.setDesignMode(true);
  }
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.subscription = this.snav.openedChange.subscribe((isOpened) => {
      if (isOpened) {
        this.isMenuModuleLoaded = isOpened;
        this.subscription.unsubscribe();
      }
    });
  }

  initDesignApp() {}
}
