import { Component, computed, input, model, OnInit } from '@angular/core';
import { folders, IFolderKey } from './data.model';
import { UcBasicComponent } from './uc-basic.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { UcThirdPartyComponent } from './uc-third-party.component';

@Component({
  selector: 'hs-user-setting-content',
  template: `
    <content class="wh-full flex flex-col pt-20px">
      <h4 class="mb-32px text-16px! font-500 px-20px">
        {{ activeFeatureName() }}
      </h4>
      <ng-scrollbar
        class="w-full h-0 flex-1"
        #scrollbarRef="ngScrollbar"
        externalViewport
        visibility="hover"
        appearance="compact"
      >
        <div scrollViewport>
          <section class="wh-full px-20px">
            @switch (activeFeature()) {
              @case (IFolderKey.Basic) {
                <hs-uc-basic></hs-uc-basic>
              }
              @case (IFolderKey.ThirdParty) {
                <hs-uc-third-party></hs-uc-third-party>
              }
            }
          </section>
        </div>
      </ng-scrollbar>
    </content>
  `,
  imports: [UcBasicComponent, UcThirdPartyComponent, NgScrollbarModule],
})
export class UserSettingContetnComponent implements OnInit {
  activeFeature = input.required<string>();

  activeFeatureName = computed(() => {
    const feature = folders.find((item) => item.key === this.activeFeature());
    return feature?.name;
  });

  IFolderKey = IFolderKey;

  constructor() {}

  ngOnInit() {}
}
