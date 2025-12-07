import { Component, computed, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RunAppMenuService } from '@src/app/core/services/run-app-menu.service';

@Component({
  selector: 'hs-app-header',
  templateUrl: './app-header.component.html',
  imports: [MatTooltipModule],
})
export class AppHeaderComponent implements OnInit {
  appConfig = computed(() => this.RunAppMenuService.appConfig());

  constructor(private RunAppMenuService: RunAppMenuService) {}

  ngOnInit() {}
}
