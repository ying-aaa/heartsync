import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserHttpService } from '@src/app/core/http/user.service';
import {
  IUserInfo,
  IUserRequiredAction,
} from '@src/app/shared/models/user.model';
import { userRequiredCtions } from '../data';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ChipsAutocompleteComponent } from '@shared/components/hs-chips-autocomplete/hs-chips-autocomplete.component';

@Component({
  selector: 'hs-create-user',
  templateUrl: './create-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatSlideToggleModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    ChipsAutocompleteComponent,
    MatError,
    MatDialogModule,
  ],
})
export class CreateUserComponent implements OnInit {
  userForm = new FormGroup({
    requiredActions: new FormControl(['CONFIGURE_TOTP'], [Validators.required]),
    emailVerified: new FormControl(true),
    username: new FormControl('async', [Validators.required]),
    email: new FormControl('135684@qq.com', [
      Validators.required,
      Validators.email,
    ]),
    firstName: new FormControl('王'),
    lastName: new FormControl('不读诗意'),
    groups: new FormControl([]),
  });

  userRuquiredActions: Array<IUserRequiredAction> = [];

  constructor(
    private dialogRef: MatDialogRef<CreateUserComponent>,
    private userHttpService: UserHttpService,
  ) {
    this.userForm.valueChanges.subscribe((values) => {
      console.log('Form updated:', values);
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userInfo: IUserInfo = this.userForm.value as any;
      this.userHttpService.createUser(userInfo).subscribe(
        (response) => {
          console.log('返回结果:', response);
        },
        (error) => {
          console.error('创建用户出错:', error);
        },
      );
    } else {
      console.log('表单校验未通过');
      this.userForm.markAllAsTouched();
    }
  }

  loadUserRequiredActions() {
    this.userHttpService.getUserRequiredCtions().subscribe(
      (actions) => {
        this.userRuquiredActions = actions;
      },
      (err) => {
        this.userRuquiredActions = userRequiredCtions;
      },
    );
  }

  ngOnInit() {
    this.loadUserRequiredActions();
  }
}
