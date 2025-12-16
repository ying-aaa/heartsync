import { Component, computed, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';

@Component({
  selector: 'hs-app-logo',
  template: `
    <div class="h-full flex items-center" [matTooltip]="appConfig().name">
      <img class="w-40px h-40px mr-8px rounded-8px" [src]="appConfig().imageUrl" />
      <span class="flex-1 truncate">{{ appConfig().name }}</span>
    </div>
  `,
  imports: [MatTooltipModule],
})
export class AppLogoComponent implements OnInit {
  appConfig = computed(() => this.RunAppMenuService.appConfig());

  constructor(private RunAppMenuService: RunAppMenuService) {}

  ngOnInit() {}
}
