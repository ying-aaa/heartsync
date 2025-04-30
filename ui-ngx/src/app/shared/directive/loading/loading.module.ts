import { NgModule } from '@angular/core';
import { HsLoadingDirective } from './loading.directive';

@NgModule({
  declarations: [HsLoadingDirective],
  exports: [HsLoadingDirective],
})
export class HsLoadingModule {}
