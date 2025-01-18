import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { environment } from '@src/environments/environment';

@Component({
  selector: 'hs-home',
  templateUrl: './home.component.html',
  imports: [MatExpansionModule],
})
export class HomeComponent {
  panelOpenState = false;
  environment = environment;
}
