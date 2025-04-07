import { Component, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'hs-anchor',
  template: '<ng-template></ng-template>',
})
export class HsAnchorComponent {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
