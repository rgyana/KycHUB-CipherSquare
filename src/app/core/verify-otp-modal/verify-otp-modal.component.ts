import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { config } from '@core/interfaces/api_baseurl';
import { ToasterService } from '@core/services/toaster.service';


@Component({
  selector: 'app-verify-otp-modal',
  templateUrl: './verify-otp-modal.component.html',
  styleUrls: ['./verify-otp-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VerifyOtpModalComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private ActiveModal: NgbActiveModal, private auth: AuthService, private toastr: ToasterService) { }

  ngOnInit(): void {
    this.verifyOtpInputForm = this.formBuilder.group({
      input1: [''],
      input2: [''],
      input3: [''],
      input4: [''],
      input5: [''],
      input6: [''],
      input7: [''],
      input8: [''],
    })
  }

  verifyOtpInputForm: any;

  // autofocus
  focusNext(event: any) {
    let element: any;
    if (event.code !== 'Backspace')
      element = event.srcElement.nextElementSibling;

    if (event.code === 'Backspace')
      element = event.srcElement.previousElementSibling;

    if (element == null) return;
    else element.focus();
  }

  // otp verification
  verifyOtp() {

    const mobileOtp = this.verifyOtpInputForm.value.input1 +
      this.verifyOtpInputForm.value.input2 +
      this.verifyOtpInputForm.value.input3 +
      this.verifyOtpInputForm.value.input4;

    const emailOtp = this.verifyOtpInputForm.value.input5 +
      this.verifyOtpInputForm.value.input6 +
      this.verifyOtpInputForm.value.input7 +
      this.verifyOtpInputForm.value.input8;

    const formData = new FormData();
    formData.append('phoneotp', mobileOtp);
    formData.append('emailotp', emailOtp);

    this.auth.postdata(formData, config.verifyOtp.url).subscribe({
      next: (res) => {
        if (res?.code === 200 && res.status) {
          console.log(res.message);
          this.toastr.showSuccess(res?.message, '');
          this.auth.postHeaderwithoutpayload(config.kyc.kycStep).subscribe({
            next: (res) => {
              if (res?.statuscode === 200 && res.status) {
                this.ActiveModal.close(res.kyc_step);
                this.toastr.showSuccess(res?.message, '');
              }
            }
          })

        } else {
          console.log('OTP mismatched');
          this.toastr.showError(res?.message, res?.title);
        }
      }
    })
  }

}
