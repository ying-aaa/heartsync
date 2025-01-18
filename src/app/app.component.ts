import { DOCUMENT } from '@angular/common';

import { Component, inject, OnInit } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatExpansionModule],
  template: `
    <router-outlet
      (activate)="onActivateComponent($event)"
      #outlet="outlet"
    ></router-outlet>
  `,
})
export class AppComponent {
  private readonly doc = inject(DOCUMENT);
  constructor() {}
  panelOpenState = false;

  onActivateComponent($event: any): void {
    this.doc.querySelector('.hs-loader')?.remove();
  }
}
