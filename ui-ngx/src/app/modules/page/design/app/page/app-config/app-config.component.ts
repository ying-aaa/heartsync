import {
  Component,
  computed,
  effect,
  OnDestroy,
  OnInit,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FormlyConfigComponent } from '@src/app/modules/components/formly-config/formly-config.component';
import { RunAppGlobalService } from '@src/app/core/services/run-app-global.service';
import { RunAppDesignService } from '@core/services/run-app-designer.service';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hs-app-config',
  templateUrl: './app-config.component.html',
  imports: [
    MatDivider,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormlyConfigComponent,
    MatIcon,
  ],
})
export class AppConfigComponent implements OnInit, OnDestroy {
  formlyConfigRef = viewChild<FormlyConfigComponent>('formlyConfigRef');

  model: any = signal({});
  options = {
    formState: {},
  };

  selectedConfigType = computed(() => this.runAppDesignService.selectedConfigType());

  subscription: Subscription;

  constructor(
    private runAppGlobalService: RunAppGlobalService,
    private runAppDesignService: RunAppDesignService,
  ) {
    effect(() => {
      const { value } = this.selectedConfigType();
      // 不尽兴监听的

      if (value === 'menuGlobal') {
        this.model = this.runAppGlobalService.appMenuConfig;
      }
      if (value === 'menuSingle') {
        // this.model = this.runAppGlobalService.appGlobalConfig();
      }
      if (value === 'appHeader') {
        this.model = this.runAppGlobalService.appHeaderConfig;
      }
      if (value === 'appGlobal') {
        this.model = this.runAppGlobalService.appGlobalConfig;
      }

      this.options = {
        formState: { model: this.model() },
      };

      console.log('%c Line:38 🍪 this.model', 'color:#3f7cff', this.model());
    });

    this.subscription = this.runAppDesignService.triggerSync$.subscribe(() => {
      this.formlyConfigRef()?.syncFormilyForm();
    });
  }

  toggleConfig() {
    this.runAppDesignService.setConfigType('appGlobal');
  }

  modelChange(newModel: any) {
    this.model.set({ ...this.model() });
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
