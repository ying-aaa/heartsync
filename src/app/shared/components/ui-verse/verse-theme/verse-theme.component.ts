import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HsThemeService } from '@src/app/core/services/theme.service';
import { IThemeType } from '@src/app/shared/models/system.model';

@Component({
  selector: 'verse-theme',
  templateUrl: './verse-theme.component.html',
  styleUrls: ['./verse-theme.component.less'],
  imports: [ReactiveFormsModule],
})
export class VerseThemeComponent implements OnInit {
  checkState = new FormControl(false);

  constructor(private HsThemeService: HsThemeService) {
    this.checkState.setValue(this.HsThemeService.isDark);

    this.checkState.valueChanges.subscribe((value) => {
      this.HsThemeService.toggleDarkTheme(
        value ? IThemeType.DARK : IThemeType.LIGHT,
      );
    });
  }

  ngOnInit() {}
}
