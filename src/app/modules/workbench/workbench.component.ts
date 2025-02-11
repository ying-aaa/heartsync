import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, signal, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule, RouterOutlet } from '@angular/router';
import { environment } from '@src/environments/environment';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'hs-workbench',
  templateUrl: './workbench.component.html',
  imports: [RouterModule, CommonModule, MatExpansionModule, HeaderComponent],
})
export class WorkbenchComponent {}
