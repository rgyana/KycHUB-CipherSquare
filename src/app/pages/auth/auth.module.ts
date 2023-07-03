import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import {SharedModule } from "../../shared/shared.module";
import { AuthComponent } from './auth.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { OtpVerifyComponent } from './otp-verify/otp-verify.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { SignupSuccessComponent } from './signup-success/signup-success.component';
import { ForgetVerifyOtpComponent } from './forget-verify-otp/forget-verify-otp.component';



@NgModule({
  declarations: [
    LoginComponent,
    ForgetPasswordComponent,
    ChangePasswordComponent,
    AuthComponent,
    SignUpComponent,
    OtpVerifyComponent,
    VerifyAccountComponent,
    SignupSuccessComponent,
    ForgetVerifyOtpComponent,

  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule { }
