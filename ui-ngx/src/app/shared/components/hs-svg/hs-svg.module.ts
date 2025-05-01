import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgComponent } from '@shared/components/hs-svg/hs-svg.component';

const svgComponent: Type<any>[] = [SvgComponent];

@NgModule({
  declarations: [...svgComponent],
  imports: [CommonModule],
  exports: [...svgComponent],
})
export class HsSvgModule {}
