import { Component, computed, input, model, OnInit } from '@angular/core';
import { folders, IFolderKey } from './data.model';
import { UserBasicComponent } from "./user-basic.component";

@Component({
  selector: 'hs-user-feature-content',
  template: `
    <content class="wh-full p-20px flex flex-col">
        <h4 class="mb-32px text-16px! font-500">{{ activeFeatureName() }}</h4>
        <section class="w-full h-0 flex-1">
            @switch (activeFeature()) {
                @case (IFolderKey.Basic) {
                    <hs-user-basic></hs-user-basic>
                }
            }
        </section>
    </content>
  `,
  imports: [UserBasicComponent],
})
export class UserFeatureContetnComponent implements OnInit {
  activeFeature = input.required<string>();

  activeFeatureName = computed(() => {
    const feature = folders.find(item => item.key === this.activeFeature());
    return feature?.name;
  })

  IFolderKey = IFolderKey;

  constructor() {}

  ngOnInit() {}
}
