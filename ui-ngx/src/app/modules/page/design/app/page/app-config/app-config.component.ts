import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FormlyConfigComponent } from '@src/app/modules/components/formly-config/formly-config.component';
import { RunAppGlobalService } from '@src/app/core/services/run-app-global.service';
import { RunAppDesignService } from '@core/services/run-app-designer.service';

@Component({
  selector: 'hs-app-config',
  templateUrl: './app-config.component.html',
  imports: [MatDivider, FormsModule, ReactiveFormsModule, MatButtonModule, FormlyConfigComponent],
})
export class AppConfigComponent implements OnInit {
  model: any = signal({});
  options = {
    formState: {},
  };

  selectedConfigType = computed(() => this.runAppDesignService.selectedConfigType());

  constructor(
    private runAppGlobalService: RunAppGlobalService,
    private runAppDesignService: RunAppDesignService,
  ) {
    effect(() => {
      const { value } = this.selectedConfigType();
      if (value === 'menuGlobal') {
        this.model = this.runAppGlobalService.appMenuConfig;
      }
      if (value === 'menuSingle') {
        // this.model = this.runAppGlobalService.appGlobalConfig();
      }
      if (value === 'appHeader') {
        this.model = this.runAppGlobalService.appHeaderConfig;
      }

      this.options = {
        formState: { model: this.model() },
      };
    });
  }

  modelChange(newModel: any) {
    this.model.set({ ...this.model() });
  }

  ngOnInit() {}
}
