import { input, Component, computed, OnInit } from '@angular/core';
import { IFileShowType } from '@src/app/shared/models/common-component';

@Component({
  selector: 'hs-file-router',
  template: `
    <content>
      @switch (fileShowType()) {
        @case ('grid') {
          <hs-file-grid-list
            [fileData]="fileData()"
            [cols]="cols()"
          >
            <ng-content select="'.grid-content'"></ng-content>
          </hs-file-grid-list>
        }
        @case ('detail') {
          <hs-file-detail-list [fileData]="fileData()">
            <ng-content select=".detail-content"></ng-content>
          </hs-file-detail-list>
        }
        @case ('fold-detail') {
          <hs-file-fold-detail-list
            [fileData]="fileData()"
            [foldStartIndex]="foldStartIndex()"
          >
            <ng-content select="fold-detail-content"></ng-content>
          </hs-file-fold-detail-list>
        }
        @case ('more') {
          <hs-file-more-list [fileData]="fileData()">
            <ng-content select="more-content"></ng-content>
          </hs-file-more-list>
        }
      }
    </content>
  `,
  host: { class: 'wh-full' },
  standalone: false,
})
export class HsFileRouterComponent implements OnInit {
  fileData = input<any[]>([]);
  isFile = input<boolean>(false);
  fileShowType = input<IFileShowType>('form');
  foldStartIndex = input<number>(3);
  cols = input<number>(3);

  ngOnInit(): void {}
}
