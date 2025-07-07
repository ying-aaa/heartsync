import { Component, computed, effect, OnInit } from '@angular/core';
import { HsThemeService } from '@src/app/core/services/theme.service';

@Component({
  selector: 'hs-loading',
  templateUrl: './hs-loading.component.html',
  styleUrls: ['./hs-loading.component.less'],
})
export class HsLoadingComponent implements OnInit {
  currentTheme = computed(() => this.hsThemeService.currentTheme());

  constructor(private hsThemeService: HsThemeService) {}

  ngOnInit() {}
}
