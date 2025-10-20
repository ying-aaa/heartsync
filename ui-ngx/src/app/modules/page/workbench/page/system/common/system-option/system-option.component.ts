import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { ActivatedRoute, Route, RouterModule, Routes } from '@angular/router';
import { HsSvgModule } from '@shared/components/hs-svg/hs-svg.module';

@Component({
  selector: 'hs-system-option',
  templateUrl: './system-option.component.html',
  imports: [MatTreeModule, MatButtonModule, MatIconModule, RouterModule, HsSvgModule, CommonModule],
  styleUrls: ['./system-option.component.less'],
})
export class SystemOptionComponent implements OnInit {
  dataSource: Routes = [];

  childrenAccessor = (node: Route) => node.children ?? [];

  hasChild = (_: number, node: Route) =>
    node.data?.['expand'] && !!node.children && node.children.length > 0;

  constructor(private route: ActivatedRoute) {
    this.dataSource = this.route.routeConfig!.children!.filter((item) => item.title);
    console.log('%c Line:25 🍊 this.dataSource', 'color:#465975', this.dataSource);
  }

  ngOnInit() {}
}
