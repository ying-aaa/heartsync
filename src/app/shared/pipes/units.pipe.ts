import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'concatUnits',
  pure: false,
})
export class ConcatUnitsPipe implements PipeTransform {
  transform(value: { [key: string]: any }): { [key: string]: string } {
    if (!value) return {};

    const result: { [key: string]: string } = {};

    Object.keys(value).forEach((key) => {
      const unitKey = `${key}Units`;
      if (value.hasOwnProperty(unitKey)) {
        result[key] = `${value[key]}${value[unitKey]}`;
      } else {
        result[key] = value[key];
      }
    });

    return result;
  }
}
