import { NgModule } from '@angular/core';
import { HsLoadingDirective } from './loading.directive';
import { HsEmptyStateDirective } from './empty-state.directive';

@NgModule({
  declarations: [HsLoadingDirective, HsEmptyStateDirective],
  exports: [HsLoadingDirective, HsEmptyStateDirective],
})
export class HsLoadingModule {}
