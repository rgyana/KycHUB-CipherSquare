import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { config } from '@core/interfaces/api_baseurl';
import { SwalService } from '@core/services/swal.service';
import { ToasterService } from '@core/services/toaster.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signupForm: any = FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private route: Router,
    private swal: SwalService,
    private toaster: ToasterService
  ) {
    this.controlForm();
  }

  ngOnInit(): void {

  }

  controlForm() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('[6789][0-9]{9}'),
          Validators.maxLength(10),
        ],
      ],
    });
  }

  signUpUser() {
    if (!this.signupForm.valid) {
      return;
    } else {
      let formdata = new FormData();
      formdata.append('name', this.signupForm.get('name').value);
      formdata.append('email', this.signupForm.get('email').value);
      formdata.append('mobilenumber', this.signupForm.get('phone').value);
      this.auth
        .postdata(formdata, config.auth.signup.signup)
        .subscribe((res: any) => {
          if (res.statuscode == 200) {
            this.auth.setmobileApi.next(res);
            this.route.navigate(['/auth/otp-verify']);
            this.toaster.showSuccess(res.message, 'success');
          } else {
            this.swal.errorMessage(res.message);
          }
        });
    }
  }

  get s() {
    return this.signupForm.controls;
  }
}
