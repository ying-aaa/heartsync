import { Component, computed, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';

@Component({
  selector: 'hs-app-logo',
  template: `
    <div class="flex items-center">
      <img class="w-40px h-40px mr-8px rounded-8px" [src]="appConfig().imageUrl" />
      <span class="flex-1 h-full line-height-64px truncate" [matTooltip]="'HeartSync 工作台'">{{
        appConfig().name
      }}</span>
    </div>
  `,
  imports: [MatTooltipModule],
})
export class AppLogoComponent implements OnInit {
  appConfig = computed(() => this.RunAppMenuService.appConfig());

  constructor(private RunAppMenuService: RunAppMenuService) {}

  ngOnInit() {}
}
