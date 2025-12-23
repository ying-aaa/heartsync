import { Pipe, PipeTransform } from '@angular/core';
import { getImageUrl } from '@src/app/core/utils';

@Pipe({
  name: 'concatUnits',
  pure: false,
})
export class ConcatUnitsPipe implements PipeTransform {
  transform(styles: { [key: string]: any } | undefined): any {
    if (!styles) return {};

    const result: { [key: string]: string } = {};

    Object.keys(styles).forEach((key) => {
      const unitKey = `${key}Units`;
      const value = styles[key];
      const units = styles[unitKey];
      if (styles.hasOwnProperty(unitKey)) {
        result[key] = `${value}${units}`;
      } else {
        if (key === 'backgroundImage' || key === 'background-image') {
          result[key] = `url(${getImageUrl(value)});`;
        } else {
          result[key] = value;
        }
      }
    });

    return result;
  }
}
