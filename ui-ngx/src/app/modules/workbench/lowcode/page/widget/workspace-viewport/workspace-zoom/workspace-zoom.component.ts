import {
  Component,
  computed,
  HostListener,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { HsRadioComponent } from '@src/app/shared/components/hs-radio/hs-radio.component';
import { IRadioConfig } from '@src/app/shared/models/system.model';

@Component({
  selector: 'hs-workspace-zoom',
  templateUrl: './workspace-zoom.component.html',
  styleUrls: ['./workspace-zoom.component.less'],
  imports: [
    MatButtonToggleModule,
    MatIconModule,
    HsRadioComponent,
    MatFormFieldModule,
    MatSelectModule,
  ],
})
export class WorkspaceZoomComponent implements OnInit {
  activeType = signal('mouse');
  isMovable = computed(() => this.activeType() === 'front_hand');

  types: IRadioConfig[] = [
    { value: 'mouse', icon: 'mouse' },
    { value: 'front_hand', icon: 'front_hand' },
  ];

  @HostListener('window:keydown.space', ['$event'])
  onSpaceKeyDown(event: KeyboardEvent) {
    this.activeType.set('front_hand');
    this.setMouseCursor('grabbing');
  }

  @HostListener('window:keyup.space', ['$event'])
  onSpaceKeyUp(event: KeyboardEvent) {
    this.activeType.set('mouse');
    this.setMouseCursor('default');
  }

  setMouseCursor(cursor: string) {
    document.body.style.cursor = cursor;
  }

  constructor() {}

  ngOnInit() {}
}
