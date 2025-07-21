import { Component, effect, input, OnInit } from '@angular/core';
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
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserHttpService } from '@src/app/core/http/user.service';
import { IRoleMapping } from '@src/app/shared/models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'hs-role-mapping',
  templateUrl: './role-mapping.component.html',
  imports: [
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatError,
  ],
})
export class RoleMappingComponent implements OnInit {
  roleMapping = input<IRoleMapping | null>(null);

  roleForm = new FormGroup({
    name: new FormControl({ value: '', disabled: true }),
    description: new FormControl(''),
  });

  constructor(
    private userHttpService: UserHttpService,
    private toastr: ToastrService,
  ) {
    effect(() => {
      const roleMapping = this.roleMapping();
      if (roleMapping) {
        this.roleForm.patchValue(roleMapping);
      }
    });

    this.roleForm.valueChanges.subscribe((values) => {
      console.log('Form updated:', values);
    });
  }

  onSubmit() {
    if (this.roleForm.valid) {
      const roleInfo = this.roleForm.value;
      this.toastr.warning('权限不足', '', {
        // 居中
        positionClass: 'toast-top-center',
      });
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
