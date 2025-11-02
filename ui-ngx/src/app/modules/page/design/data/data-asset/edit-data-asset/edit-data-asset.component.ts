import { Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'hs-edit-data-asset',
  templateUrl: './edit-data-asset.component.html',
  standalone: false,
  host: { class: 'wh-full' },
})
export class EditDataAssetComponent implements OnInit {
  assetId = input<string>('');

  constructor() {}

  ngOnInit() {}
}
