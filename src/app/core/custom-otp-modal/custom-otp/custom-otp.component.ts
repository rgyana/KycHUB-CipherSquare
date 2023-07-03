import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-custom-otp',
  templateUrl: './custom-otp.component.html',
  styleUrls: ['./custom-otp.component.css'],
})
export class CustomOtpComponent implements OnInit, OnChanges {
  @ViewChild('inputDiv', { static: true }) inputDiv!: ElementRef;
  @Input() otpBox: any; //set count of input box's

  @Input() isSubmitBtn: boolean = true; //show submit button
  @Input() submitBtnName: any = 'Submit OTP'; //set submit button name
  @Output() sendOtp = new EventEmitter<any>(); //otp callback

  @Input() isResendOTP: boolean = true; //show resend button
  @Output() resendOtp = new EventEmitter(); //resend callback
  @Input() resendOTPCounter: number = 30; //set resend timmer
  @Input() dynamicResendCounter: boolean = true; //show resend button

  @Input() showMesgOtpSendToMobile: any = null; //show mesg send to mobile

  code!: UntypedFormArray;

  count: any;
  constructor(private fb: UntypedFormBuilder) { }

  checkit() {
    let fullOtp: any = '';
    this.code.value.map((val: any) => {
      fullOtp = fullOtp + val;
    });
    this.sendOtp.emit(fullOtp);

  }
  ngOnInit(): void {
    const controls = [];
    for (let i = 0; i < this.otpBox; i++) {
      controls.push(['', [Validators.required]]);
      // controls.push([i == this.otpBox-1?2:'', [Validators.required]]);
    }
    this.code = this.fb.array(controls);


  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes) {
      // if (this.inputDiv.nativeElement) {
      setTimeout(() => {
        $($(this.inputDiv.nativeElement)[0]).find('input.isFirst')[0].focus();
      }, 1);
      // }
    }
  }

  getket(key: any) {
    return (<UntypedFormArray>this.code).controls[key] as UntypedFormControl;
  }

  numberOnly(event: any, lastItem?: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    if (lastItem) {
      this.lastFnCall();
    }
    return true;
  }

  lastFnCall() {
    setTimeout(() => {
      this.checkit();
    }, 1);
  }

  resendOtpFn() {
    this.code.reset('');
    setTimeout(() => {
      $($(this.inputDiv.nativeElement)[0]).find('input.isFirst')[0].focus();
    }, 1);
    let count: number = this.resendOTPCounter;
    let inter = setInterval(() => {
      count -= 1;
      this.count = count;
      if (count == 0) {
        clearInterval(inter);
        this.count = null;
        if (this.dynamicResendCounter) {
          this.resendOTPCounter += 30;
        }
      }
    }, 1000);
    this.resendOtp.emit();
  }
}
