import { input, Component, OnInit } from '@angular/core';
import { IFileShowType } from '@src/app/shared/models/common-component';

@Component({
  selector: 'hs-file-router',
  template: `
    <content>
      @switch (fileShowType()) {
        @case ('grid') {
          <hs-file-grid-list [fileList]="fileList()" [cols]="cols()">
            <ng-content select="'.grid-content'"></ng-content>
          </hs-file-grid-list>
        }
        @case ('detail') {
          <hs-file-detail-list [fileList]="fileList()">
            <ng-content select=".detail-content"></ng-content>
          </hs-file-detail-list>
        }
        @case ('fold-detail') {
          <hs-file-fold-detail-list [fileList]="fileList()" [foldStartIndex]="foldStartIndex()">
            <ng-content select=".fold-detail-content"></ng-content>
          </hs-file-fold-detail-list>
        }
        @case ('more-detail') {
          <hs-file-more-list [fileList]="fileList()" [type]="'more-detail'">
            <ng-content select=".more-content"></ng-content>
          </hs-file-more-list>
        }
        @case ('more-grid') {
          <hs-file-more-list [fileList]="fileList()" [type]="'more-grid'">
            <ng-content select=".more-content"></ng-content>
          </hs-file-more-list>
        }
      }
    </content>
  `,
  host: { class: 'wh-full' },
  standalone: false,
})
export class HsFileRouterComponent implements OnInit {
  fileList = input<any[]>([]);
  fileShowType = input<IFileShowType>('detail');
  foldStartIndex = input<number>(3);
  cols = input<number>(3);

  ngOnInit(): void {}
}
