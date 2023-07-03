import {
  FormControl,
  FormGroup,
  UntypedFormGroup,
  Validators,
  UntypedFormBuilder,
  AbstractControlOptions,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CustomValidators } from '@core/custom-validator/custom-validators';
import * as _ from 'lodash';
import { retry } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { config } from '@core/interfaces/api_baseurl';
import { ToasterService } from '@core/services/toaster.service';
import { Router } from '@angular/router';
import { StoreService } from '@core/services/store.service';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: any = UntypedFormGroup;
  passwordChange: boolean = false;
  getUserData: any;
  bar0: any;
  bar1: any;
  bar2: any;
  bar3: any;
  passwordToCheck: any;
  message: any;
  messageColor: any;
  private colors = ['darkred', 'orangered', 'orange', 'yellowgreen'];
  passwordStrength: boolean = false;
  constructor(
    private fb: UntypedFormBuilder,
    private _auth: AuthService,
    private toaster: ToasterService,
    private route: Router,
    private store: StoreService,
  ) { }

  ngOnInit(): void {

  }


  groupOptions: AbstractControlOptions = {
    validators: CustomValidators.passwordMatchValidator,
    asyncValidators: null
  }

  formControlValidator() {
    // this.changePasswordForm = this.fb.group(
    //   {
    //     password: [
    //       '',
    //       [
    //         Validators.compose([
    //           Validators.required,
    //           CustomValidators.patternValidator(/\d/, { hasNumber: true }),
    //           CustomValidators.patternValidator(/[A-Z]/, {
    //             hasCapitalCase: true,
    //           }),
    //           CustomValidators.patternValidator(/[a-z]/, {
    //             hasSmallCase: true,
    //           }),
    //           CustomValidators.patternValidator(
    //             /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    //             {
    //               hasSpecialCharacters: true,
    //             }
    //           ),
    //           Validators.minLength(8),
    //         ]),
    //       ],
    //     ],
    //     confirmPassword: [null, Validators.compose([Validators.required])],
    //   },
    //   {
    //     validator: CustomValidators.passwordMatchValidator,
    //   }
    // );

    this.changePasswordForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.compose([
              Validators.required,
              CustomValidators.patternValidator(/\d/, { hasNumber: true }),
              CustomValidators.patternValidator(/[A-Z]/, {
                hasCapitalCase: true,
              }),
              CustomValidators.patternValidator(/[a-z]/, {
                hasSmallCase: true,
              }),
              CustomValidators.patternValidator(
                /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
                {
                  hasSpecialCharacters: true,
                }
              ),
              Validators.minLength(8),
            ]),
          ],
        ],
        confirmPassword: [null, Validators.compose([Validators.required])],
      },
      this.groupOptions
    );

  }

  get f() {
    return this.changePasswordForm.controls;
  }

  checkStrength(password: string) {
    // 1
    let force = 0;

    // 2
    const regex = /[$-/:-?{-~!"^_@`\[\]]/g;
    const lowerLetters = /[a-z]+/.test(password);
    const upperLetters = /[A-Z]+/.test(password);
    const numbers = /[0-9]+/.test(password);
    const symbols = regex.test(password);

    // 3
    const flags = [lowerLetters, upperLetters, numbers, symbols];

    // 4
    let passedMatches = 0;
    for (const flag of flags) {
      passedMatches += flag === true ? 1 : 0;
    }

    // 5
    force += 2 * password.length + (password.length >= 10 ? 1 : 0);
    force += passedMatches * 10;

    // 6
    force = password.length <= 6 ? Math.min(force, 10) : force;

    // 7
    force = passedMatches === 1 ? Math.min(force, 10) : force;
    force = passedMatches === 2 ? Math.min(force, 20) : force;
    force = passedMatches === 3 ? Math.min(force, 30) : force;
    force = passedMatches === 4 ? Math.min(force, 40) : force;

    return force;
  }

  onChanges(event: any) {
    const password = event.target.value;
    this.passwordToCheck = password;

    this.setBarColors(4, '#DDD');

    if (password) {
      const pwdStrength = this.checkStrength(password);
      pwdStrength === 40
        ? (this.passwordStrength = true)
        : (this.passwordStrength = false);

      const color = this.getColor(pwdStrength);
      this.setBarColors(color.index, color.color);

      switch (pwdStrength) {
        case 10:
          this.message = 'Poor';
          break;
        case 20:
          this.message = 'Not Good';
          break;
        case 30:
          this.message = 'Average';
          break;
        case 40:
          this.message = 'Good';
          break;
      }
    } else {
      this.message = '';
    }
  }

  private getColor(strength: number) {
    let index = 0;

    if (strength === 10) {
      index = 0;
    } else if (strength === 20) {
      index = 1;
    } else if (strength === 30) {
      index = 2;
    } else if (strength === 40) {
      index = 3;
    } else {
      index = 4;
    }

    this.messageColor = this.colors[index];

    return {
      index: index + 1,
      color: this.colors[index],
    };
  }

  private setBarColors(count: number, color: string) {
    for (let n = 0; n < count; n++) {
      (this as any)['bar' + n] = color;
    }
  }
  onPassword() {
    this.passwordChange = !this.passwordChange;
  }

  verifyEmail() {
    if (this.changePasswordForm.invalid) {
      return;
    } else {
      let formdata = new FormData();
      formdata.append(
        'new_password',
        this.changePasswordForm.get('password')?.value
      );
      formdata.append(
        'confirm_password',
        this.changePasswordForm.get('confirmPassword')?.value
      );
      formdata.append('email', this.getUserData?.email);

      this._auth
        .postdata(formdata, config.auth.forgetPassword.changePassword)
        .subscribe({
          next: (res: any) => {
            if (res.statuscode == 200) {
              this.toaster.showSuccess(res.message, 'Success');
              this.route.navigate(['/auth/login']);
            } else {
              this.toaster.showError(res.message, 'Error');
            }
          },
        });
    }
  }
}
