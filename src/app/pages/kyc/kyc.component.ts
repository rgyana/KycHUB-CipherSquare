import { StoreService } from './../../core/services/store.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { config } from '@core/interfaces/api_baseurl';
import { AuthService } from '@core/services/auth.service';
import { LoaderService } from '@core/services/loader.service';
import { KycService } from './kyc.service';
import { KYC_Service_Steps } from '@core/common/common-config';
import { kycServiceStepsInterface } from '@core/interfaces/kycServiceSteps.interface';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss'],
})
export class KycComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private loader: LoaderService,
    private auth: AuthService,
    private KycService: KycService,
    private store: StoreService
  ) {
  }

  ngOnInit(): void {
    this.kycDetails();
  }

  kycSteps: any;
  KycServiceSteps: any[] = KYC_Service_Steps;
  kycList: any;
  userDetails: any;


  // TODO-----------need varable checking---------------------
  //? info: selectedkycStep for frontend-step-navigation 
  selectedkycStep: any;
  //? info: kycMaxStepLimit for backend-kyc_step (step-limit) 
  kycMaxStepLimit: any;
  KYC_Service_Steps: any = KYC_Service_Steps;

  // TODO-----------need varable checking---------------------

  kycDetails() {
    let da = this.route.snapshot.queryParams['kycencdata'];
    const formData = new FormData();
    formData.append('key', da);

    this.auth
      .postdata(formData, config.kyc.kycDetails)
      .subscribe((res: any) => {
        if (res.code == 200) {
          this.userDetails = res;
          this.kycList = res.kyc_list;
          this.store.set('userDetails', res);
          this.selectedkycStep = this.userDetails?.kyc_step;
          this.kycSteps = this.userDetails?.kyc_step;
          this.kycMaxStepLimit = this.userDetails?.kyc_step;
        }
      });
  }



  // !---------------------------------------------------------------------------------------------------------

  onSaveContactDetails(value: any) {
    if (value > this.kycMaxStepLimit) {
      this.updateLocalStorage({ kyc_step: value });
      this.kycMaxStepLimit = value;
      this.kycSteps = value;
    }
    this.selectedkycStep = value;
    this.userDetails = this.store.get('userDetails');
  }

  onSaveBusinessDetail(value: any) {
    if (value > this.kycMaxStepLimit) {
      this.updateLocalStorage({ kyc_step: value });
      this.kycMaxStepLimit = value;
      this.kycSteps = value;
    }
    this.selectedkycStep = value;
    this.userDetails = this.store.get('userDetails');
  }

  onSaveVerifyDoc(value: any) {
    if (value > this.kycMaxStepLimit) {
      this.updateLocalStorage({ kyc_step: value });
      this.kycMaxStepLimit = value;
      this.kycSteps = value;
    }
    this.selectedkycStep = value;
    this.userDetails = this.store.get('userDetails');
  }

  // !---------------------------------------------------------------------------------------------------------

  updateLocalStorage(obj: any) {
    let prevData: any = this.store.get('userDetails');
    const updatedData = Object.assign({}, prevData, obj);
    this.store.set('userDetails', updatedData);
  }

  fetchKycServiceStepsData(KYC_Service_Steps: kycServiceStepsInterface) {
    this.KYC_Service_Steps = KYC_Service_Steps;
  }

  // TODO-------------need to work on this----------------------------

  // on clicking Major/Main step in sidebar
  onClickOuterLi(selectedItem: any) {
    // console.log(selectedItem);
    // if ((selectedItem?.stepNum <= this.kycMaxStepLimit) && selectedItem?.stepNum != 3) {
    //   this.selectedkycStep = selectedItem?.stepNum;
    // }
    if ((selectedItem?.stepNum <= this.kycMaxStepLimit)) {
      this.selectedkycStep = selectedItem?.stepNum;
    }
  }

  onClickInnerList(selectedItem: any) {
    // console.log(selectedItem);
    if (selectedItem.step <= this.kycMaxStepLimit) {
      this.selectedkycStep = selectedItem.step;
      // this.KycService.selectedKycStep.next(selectedItem.selected);
      // this.callKycDetail(value.selected);
    }
  }

  // TODO-------------need to work on this----------------------------
}
