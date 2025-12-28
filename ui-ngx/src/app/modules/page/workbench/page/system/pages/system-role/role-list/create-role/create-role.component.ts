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
import { AuthHttpService } from '@src/app/core/http/auth.http.service';
import { IRoleRepresentation } from '@src/app/shared/models/user.model';
import { ToastrService } from 'ngx-toastr';
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
    name: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
  });

  constructor(
    private dialogRef: MatDialogRef<CreateRoleComponent>,
    private authHttpService: AuthHttpService,
    private toastrService: ToastrService,
  ) {
    this.roleForm.valueChanges.subscribe((values) => {
      console.log('Form updated:', values);
    });
  }

  onSubmit() {
    if (this.roleForm.valid) {
      const roleInfo = this.roleForm.value as IRoleRepresentation;
      this.authHttpService.createRealmRole(roleInfo).subscribe((response) => {
        this.toastrService.success('角色创建成功');
        this.dialogRef.close(true);
      });
    } else {
      console.log('表单校验未通过');
      this.roleForm.markAllAsTouched();
    }
  }

  ngOnInit() {}
}
