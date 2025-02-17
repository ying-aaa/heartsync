import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WidgetEditorService {
  isEditMode = false;

  listConnectedTo = [];

  fields = [];
  model = [];
  options = [];

  constructor() {}
}
