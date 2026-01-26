import { Component, computed, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RunAppGlobalService } from '@src/app/core/services/run-app-global.service';
import { ImgUrlPipe } from '@shared/pipes/img-url.pipe';

@Component({
  selector: 'hs-app-logo',
  template: `
    <div class="h-full flex items-center hs-app-logo-container" [matTooltip]="appConfig().name">
      <img
        class="w-40px h-40px mr-8px rounded-8px hs-app-logo_img"
        [src]="appConfig().imageUrl | imgUrl"
      />
      <span class="flex-1 truncate hs-app-logo_name">{{ appConfig().name }}</span>
    </div>
  `,
  imports: [MatTooltipModule, ImgUrlPipe],
})
export class AppLogoComponent implements OnInit {
  appConfig = computed(() => this.runAppGlobalService.appData());

  constructor(private runAppGlobalService: RunAppGlobalService) {}

  ngOnInit() {}
}
