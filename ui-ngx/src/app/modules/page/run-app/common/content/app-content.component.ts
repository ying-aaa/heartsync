import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BaseDesignComponent } from '../base-design.component';
import { RunAppDesignService } from '@src/app/core/services/run-app-designer.service';

@Component({
  selector: 'hs-app-content',
  template: ` <router-outlet></router-outlet> `,
  imports: [RouterOutlet],
  host: {
    class: 'hs-app-content',
  },
})
export class AppContentComponent extends BaseDesignComponent implements OnInit {
  protected configTypeKey = 'appContent';

  constructor(override runAppDesignService: RunAppDesignService) {
    super(runAppDesignService);
  }
  ngOnInit() {}
}
