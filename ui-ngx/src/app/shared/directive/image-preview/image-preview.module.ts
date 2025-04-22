import { NgModule } from '@angular/core';
import { HsImagePreviewDirective } from './image-preview.directive';

@NgModule({
  declarations: [HsImagePreviewDirective],

  exports: [HsImagePreviewDirective],
})
export class HsImagePreviewModule {}
