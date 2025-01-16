import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  title = 'hs-basekit';

  constructor() {
    const t = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      error: 5,
      title: '',
    };
    const a = [1, 2, 3];
    a.map((item: number) => item + 1)
      .find((item: number) => item === 2)
      ?.toString();
  }
  onclick() {}
}
