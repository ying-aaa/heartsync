import { Component, input, model, OnInit } from '@angular/core';
import { IRadioConfig } from '../../models/system.model';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'hs-radio',
  templateUrl: './hs-radio.component.html',
  styleUrls: ['./hs-radio.component.less'],
  imports: [MatRippleModule],
})
export class HsRadioComponent implements OnInit {
  ngModel = model<string>();

  configs = input.required<IRadioConfig[] | []>();
  rows = input<number>(1);

  constructor() {}

  styleComputer = () => {
    return {
      'grid-template-columns': `
        repeat(${Math.ceil(this.configs().length / this.rows())}, 
        ${this.rows()}fr)
      `,
    };
  };
  ngOnInit() {}
}
