import { Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'hs-user-basic',
  template: `
    <div class="text-15px opacity-90">账号信息</div>
  `,
  imports: [MatListModule, MatIconModule, MatDividerModule],
})
export class UserBasicComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
