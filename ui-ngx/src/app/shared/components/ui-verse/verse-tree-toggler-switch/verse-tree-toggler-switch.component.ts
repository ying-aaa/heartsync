import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'verse-tree-toggler-switch',
  templateUrl: './verse-tree-toggler-switch.component.html',
  styleUrls: ['./verse-tree-toggler-switch.component.less'],
  imports: [ReactiveFormsModule],
})
export class VerseTreeTogglerSwitchComponent {
  @Input() isChecked: boolean = false;
}
