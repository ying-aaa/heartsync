import { InjectionToken } from "@angular/core";

export class WidgetContext {
  $injector: any;
  $scope: any;
  http: any;
  utilsService: any;
  sanitizer: any;
  router: any;
  defaultSubscription: any;
  telemetrySubscribers: any[] = [];
}

export const widgetContextToken = new InjectionToken<WidgetContext>('widgetContext');
