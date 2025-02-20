import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'hs-widget-toobar',
  templateUrl: './widget-toobar.component.html',
  styleUrls: ['./widget-toobar.component.css'],
  imports: [MatButtonModule, MatIconModule],
})
export class WidgetToobarComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
