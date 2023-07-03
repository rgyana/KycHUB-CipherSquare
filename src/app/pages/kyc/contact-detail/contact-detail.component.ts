import { StoreService } from './../../../core/services/store.service';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import * as _ from 'lodash'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VerifyOtpModalComponent } from '@core/verify-otp-modal/verify-otp-modal.component';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { config } from '@core/interfaces/api_baseurl';


@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss'],

})
export class ContactDetailComponent implements OnInit {

  contactDetailGroup: UntypedFormGroup;
  userDetails: any

  @Output() selectedServiceContact = new EventEmitter();

  constructor(
    private auth: AuthService,
    private fb: UntypedFormBuilder,
    private store: StoreService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.contactDetailGroup = this.fb.group({
      businessName: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.minLength(10)]],
      businessMail: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/
          ),
        ],
      ],
    });
  }

  ngOnInit(): void {

    this.userDetails = this.store.get('userDetails');
    this.patchUserDataFromApis()
  }

  patchUserDataFromApis() {
    this.contactDetailGroup.patchValue({
      // usertype: patchData.usertype,
      businessName: this.userDetails.kyc_list.name,
      contactNumber: this.userDetails.kyc_list.phone,
      businessMail: this.userDetails.kyc_list.email,
    });
    this.contactDetailGroup.disable();
  }

  openModalForVerify() {
    this.auth.postHeaderwithoutpayload(config.sendOtp.url).subscribe({
      next: (res) => {
        if (res?.code === 200 && res?.status) {
          this.openVerifyOtpModal();
          console.log(res);
        } else {
          console.log('something is wrong');
        }
      }
    })
  };


  // verify otp Modal
  async openVerifyOtpModal() {
    const modalRef = this.modalService.open(VerifyOtpModalComponent, {
      centered: true,
      backdropClass: 'no-zindex-custom',
      backdrop: 'static',
    });
    if (await modalRef.result) {
      console.log(await modalRef.result);
      this.selectedServiceContact.emit(await modalRef.result);
    }
  }


}
