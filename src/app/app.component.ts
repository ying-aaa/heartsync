import { DOCUMENT } from '@angular/common';

import { Component, inject, OnInit } from '@angular/core';

import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    1
    <router-outlet
      (activate)="onActivateComponent($event)"
      #outlet="outlet"
    ></router-outlet>
  `,
})
export class AppComponent {
  private readonly doc = inject(DOCUMENT);
  constructor() {}

  onActivateComponent($event: any): void {
    this.doc.querySelector('.hs-loader')?.remove();
  }
}
