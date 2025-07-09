import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserHttpService } from '@src/app/core/http/user.service';
import { ChipsAutocompleteComponent } from '@src/app/shared/components/hs-chips-autocomplete/hs-chips-autocomplete.component';

@Component({
  selector: 'hs-create-role',
  templateUrl: './create-role.component.html',
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
    MatError,
    MatDialogModule,
  ],
})
export class CreateRoleComponent implements OnInit {
  roleForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  constructor(
    private dialogRef: MatDialogRef<CreateRoleComponent>,
    private userHttpService: UserHttpService,
  ) {
    this.roleForm.valueChanges.subscribe((values) => {
      console.log('Form updated:', values);
    });
  }

  onSubmit() {
    if (this.roleForm.valid) {
      const roleInfo = this.roleForm.value;
      // this.userHttpService.createRole(roleInfo).subscribe(
      //   (response) => {
      //     console.log('返回结果:', response);
      //   },
      //   (error) => {
      //     console.error('创建用户出错:', error);
      //   },
      // );
    } else {
      console.log('表单校验未通过');
      this.roleForm.markAllAsTouched();
    }
  }

  ngOnInit() {}
}
