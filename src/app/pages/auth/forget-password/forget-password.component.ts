import { ToasterService } from '@core/services/toaster.service';
import { AuthService } from '@core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';

import { config } from '@core/interfaces/api_baseurl';
import { StoreService } from '@core/services/store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent implements OnInit {
  forgetForm: any = FormGroup;
  constructor(
    private fb: UntypedFormBuilder,
    private _auth: AuthService,
    private toaster: ToasterService,
    private store: StoreService,
    private router: Router,
  ) {
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required]],
    });
  }
  get f() {
    return this.forgetForm.controls;
  }

  ngOnInit(): void {

  }
  verifyEmail() {
    if (this.forgetForm.invalid) {
      return;
    } else {
      var formDataUser = this.forgetForm.value;
      let formdata = new FormData();
      formdata.append('email', formDataUser.email);
      this._auth
        .postdata(formdata, config.auth.forgetPassword.resetPassword)
        .subscribe((res: any) => {
          if (res.statuscode == 200) {
            this.toaster.showSuccess(res.message, 'Success');
            this.store.set('details', res);
            this.router.navigate(['/auth/forget-verify-otp']);
          } else {
            this.toaster.showError(res.message, 'Error');
          }
        });
    }
  }
}
