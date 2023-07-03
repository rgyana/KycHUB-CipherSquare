import { state } from '@angular/animations';
import { ToasterService } from '@core/services/toaster.service';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { config } from '@core/interfaces/api_baseurl';
import { AuthService } from '@core/services/auth.service';
import { RiCustomMdlService } from '@core/custom-otp-modal/ri-custom-mdl/ri-custom-mdl.service';
import { Router } from '@angular/router';
import { StoreService } from '@core/services/store.service';

import { SwalService } from '@core/services/swal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  submitted = false;
  LoginForm!: UntypedFormGroup;
  mdlId: any = 'loginOtpMdl';
  otpClass = "'font-weight-bolder bg-info px-2'";
  otpMobNo = '';
  otplength: number = 4;
  otpcheck: boolean = true;
  constructor(
    private fb: UntypedFormBuilder,
    private _auth: AuthService,
    private otp_modal_service: RiCustomMdlService,
    private route: Router,
    private store: StoreService,
    private toaster: ToasterService,
    private Swal: SwalService,
  ) {
    this.LoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {

  }

  get f() {
    return this.LoginForm.controls;
  }

  formDataDetails() {
    const formData = new FormData();
    formData.append('email', this.LoginForm.controls['email'].value);
    formData.append('password', this.LoginForm.controls['password'].value);
    return formData;
  }

  loginUser() {
    this.submitted = true;
    if (this.LoginForm.invalid) {
      return;
    }
    if (this.submitted) {
      let formdata = this.formDataDetails();
      this._auth.postdata(formdata, config.auth.login).subscribe((res: any) => {
        if (res.statuscode == 200) {
          if (res.is_otp == 1) {
            this.toaster.showSuccess(res.message, 'Success');
            this.otpMobNo = res.mobile;
            this.otp_modal_service.open(this.mdlId);
            this.route.navigate(['/dashboard/dashboard']);
          } else {
            this.store.set('details', res);
            this.store.set('env', res.userdata.user_env);
            this.route.navigate(['/dashboard/dashboard']);
            // this.toaster.showSuccess(res.message, 'success');
          }
        } else if (res.statuscode == 201) {
          // this.otp_modal_service.open(this.mdlId);
          this.route.navigate(['/dashboard/dashboard']);
        } else {
          this.Swal.errorMessage(res.message);
        }
      });
    }
  }

  // verifyOtp(event: any) {
  //   if (event.length == this.otplength) {
  //     const formdata = new FormData();
  //     formdata.append('otp', event);
  //     formdata.append('email', this.LoginForm.controls['email'].value);
  //     formdata.append('password', this.LoginForm.controls['password'].value);
  //     this._auth
  //       .postdata(formdata, config.auth.verify)
  //       .subscribe((res: any) => {
  //         if (res.statuscode == 200) {
  //           this.store.set('details', res);
  //           this.store.set('env', res.userdata.user_env);
  //           this.route.navigate(['/dashboard/dashboard']);
  //         } else {
  //         }
  //       });
  //   }
  // }

  resend_otp() {
    this.otpcheck = true;
    const formdata = new FormData();
  }
}
