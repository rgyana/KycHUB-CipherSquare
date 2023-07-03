import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { SwalService } from '@core/services/swal.service';
import { ToasterService } from '@core/services/toaster.service';
import { config } from '@core/interfaces/api_baseurl';
import { StoreService } from '@core/services/store.service';

@Component({
  selector: 'app-forget-verify-otp',
  templateUrl: './forget-verify-otp.component.html',
  styleUrls: ['./forget-verify-otp.component.scss'],
})
export class ForgetVerifyOtpComponent implements OnInit {
  length = 4;
  mobileNo: any;
  verifydata: any;
  timerInterval: any;
  display: any;
  showTimer: boolean = false;
  getUserData: any;
  constructor(
    private auth: AuthService,
    private swal: SwalService,
    private route: Router,
    private toaster: ToasterService,
    private store: StoreService,
  ) {}

  ngOnInit(): void {

    this.getUserData = this.store.get('details');
  }
  onOtpVerify(otps: any) {
    if (otps.length > 3) {
      let formdata = new FormData();
      formdata.append('email', this.getUserData?.email);
      formdata.append('otp', otps);
      this.auth
        .postdata(formdata, config.auth.forgetPassword.verifyOtp)
        .subscribe((res: any) => {
          if (res.statuscode == 200) {
            this.toaster.showSuccess(res.message, 'success');
            this.route.navigate(['/auth/change-password']);
          } else {
            this.swal.errorMessage(res.message);
          }
        });
    }
  }

  resendOtpFn() {
    let formdata = new FormData();
    formdata.append('email', this.getUserData?.email);
    this.auth
      .postdata(formdata, config.auth.forgetPassword.resetPassword)
      .subscribe((res: any) => {
        if (res.statuscode == 200) {
          this.timer(1);
          this.toaster.showSuccess(res.message, 'success');
        } else {
          this.swal.errorMessage(res.message);
        }
      });
  }

  // start() {
  //   this.timer(2);
  // }
  // stop() {
  //   clearInterval(this.timerInterval);
  // }

  timer(minute: any) {
    this.showTimer = true;

    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    this.timerInterval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.showTimer = false;
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }
}
