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
import { getParamFromRoute } from '@src/app/core/utils';
import { ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { HsLoadingModule } from '@src/app/shared/directive/loading/loading.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { RunAppComponent } from '@src/app/modules/page/run-app/run-app.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { finalize, Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MenuTreeComponent } from './menu-tree/menu-tree.component';
import { AppConfigComponent } from './app-config/app-config.component';
import { VerseDesignModeSwitchComponent } from '@src/app/shared/components/ui-verse/verse-design-mode-switch/verse-design-mode-switch.component';
import { FormsModule } from '@angular/forms';
import { RunAppDesignService } from '@src/app/core/services/run-app-designer.service';
import { AppLayoutComponent } from '@modules/page/run-app/layout/app-layout.component';
import { RunAppGlobalService } from '@src/app/core/services/run-app-global.service';
import { ToastrService } from 'ngx-toastr';

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
    MenuTreeComponent,
    MatDivider,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    AppConfigComponent,
    FormsModule,
    VerseDesignModeSwitchComponent,
    AppLayoutComponent,
  ],
})
export class AppPageDesignerComponent implements OnInit, AfterViewInit {
  @ViewChild('snav') snav!: MatSidenav;
  @ViewChild('RunApp', { read: ElementRef }) runApp!: ElementRef<RunAppComponent>;

  appId: string = getParamFromRoute('appId', this.route)!;

  protected readonly isMobile = signal(true);

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

  loadingStatus = signal(false);

  subscription: Subscription;

  constructor(
    public renderer: Renderer2,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private runappDesignService: RunAppDesignService,
    private runAppGlobalService: RunAppGlobalService,
  ) {
    this.runappDesignService.setDesignMode(true);
  }

  saveAppConfig() {
    this.loadingStatus.set(true);
    this.runAppGlobalService
      .updateAppWithConfig(this.appId)
      .pipe(
        finalize(() => {
          this.loadingStatus.set(false);
        }),
      )
      .subscribe((res) => {
        this.toastr.success('保存成功');
      });
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
}
