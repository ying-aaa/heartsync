import { input, OnInit, signal, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router } from '@angular/router';
import { getParamFromRoute } from '@src/app/core/utils';
import { IWidgetType } from '@src/app/shared/models/widget.model';
@Component({
  selector: 'hs-preview-toolbar',
  template: `
    <div class="px-8px py-10px flex justify-between">
      <div class="flex-center w-fit">
        <button
          mat-raised-button
          color="accent"
          class="px-16px! mx-12px"
          (click)="backWorkSpace()"
        >
          <mat-icon matChipAvatar>arrow_back</mat-icon> 返回
        </button>

        <!-- <div>{{ widgetConfig().formName }}</div> -->
      </div>

      <div>
        <ng-content></ng-content>
      </div>
    </div>

    <mat-divider class="h-full"></mat-divider>
  `,
  imports: [MatButtonModule, MatIconModule, MatDividerModule],
  host: {
    class: 'block relative',
  },
})
export class PreviewToolbarComponent implements OnInit {
  appId: string | null = getParamFromRoute('appId', this.route);

  widgetId = signal<string>('');

  widgetType = signal<IWidgetType>('' as IWidgetType);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  backWorkSpace() {
    const widgetId = this.widgetId();
    const widgetType = this.widgetType();
    this.router.navigate([`/design/${this.appId}/widget/${widgetType}`], {
      queryParams: { widgetId },
    });
  }

  initRouteWidget() {
    const widgetId = this.route.snapshot.queryParams['widgetId'];
    const widgetType = this.route.snapshot.queryParams['widgetType'];
    this.widgetId.set(widgetId);
    this.widgetType.set(widgetType);
  }

  // loadWidgetInfo() {
  //   this.WidgetHttpService.findOneWidget(this.widgetId()).subscribe((res) => {
  //     this.widgetInfo.set(res);
  //   })
  // }

  ngOnInit() {
    this.initRouteWidget();
  }
}
