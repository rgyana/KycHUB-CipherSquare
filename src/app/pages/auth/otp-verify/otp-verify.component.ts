import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { config } from '@core/interfaces/api_baseurl';
import { AuthService } from '@core/services/auth.service';
import { SwalService } from '@core/services/swal.service';
import { ToasterService } from '@core/services/toaster.service';

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.component.html',
  styleUrls: ['./otp-verify.component.scss'],
})
export class OtpVerifyComponent implements OnInit {
  length = 4;
  mobileNo: any;
  verifydata: any;
  timerInterval: any;
  display: any;
  showTimer: boolean = false;
  constructor(
    private auth: AuthService,
    private swal: SwalService,
    private route: Router,
    private toaster: ToasterService,
  ) {
    this.auth.getmobileApi.subscribe((res: any) => {
      this.mobileNo = res.mobilenumber;
      this.timer(1);
    });
  }

  ngOnInit(): void {

  }
  onOtpVerify(otps: any) {
    if (otps.length > 3) {
      let formdata = new FormData();
      formdata.append('mobilenumber', this.mobileNo);
      formdata.append('otp', otps);
      this.auth
        .postdata(formdata, config.auth.signup.verify)
        .subscribe((res: any) => {
          if (res.statuscode == 200) {
            this.auth.setmobileApi.next(res);
            this.route.navigate(['/auth/signup-success']);
          } else {
            this.swal.errorMessage(res.message);
          }
        });
    }
  }

  resendOtpFn() {
    let formdata = new FormData();
    formdata.append('mobilenumber', this.mobileNo);
    this.auth
      .postdata(formdata, config.auth.signup.resend)
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
