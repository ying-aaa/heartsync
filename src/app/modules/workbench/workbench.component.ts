import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, signal, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule, RouterOutlet } from '@angular/router';
import { environment } from '@src/environments/environment';
import { WorkbenchHeaderComponent } from './components/workbench-header/workbench-header.component';

@Component({
  selector: 'hs-workbench',
  templateUrl: './workbench.component.html',
  imports: [
    RouterModule,
    CommonModule,
    MatExpansionModule,
    WorkbenchHeaderComponent,
  ],
})
export class WorkbenchComponent {}
