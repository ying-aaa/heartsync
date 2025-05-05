import { Component, OnInit } from '@angular/core';
import { HsSvgModule } from '../../../shared/components/hs-svg/hs-svg.module';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  imports: [HsSvgModule],
})
export class PageNotFoundComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
