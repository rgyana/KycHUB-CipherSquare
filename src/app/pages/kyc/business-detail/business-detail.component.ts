import { AuthService } from './../../../core/services/auth.service'; ToasterService
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { KycService } from '../kyc.service';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import * as _ from 'lodash';
import { regExpNativePatternValidator } from '@core/utility/validator';
import { config } from '@core/interfaces/api_baseurl';
import { BehaviorSubject, filter, Observable, Subscription } from 'rxjs';
import { UtilityService } from '@core/services/utility.service';
import { ToasterService } from '@core/services/toaster.service';


@Component({
  selector: 'app-business-detail',
  templateUrl: './business-detail.component.html',
  styleUrls: ['./business-detail.component.scss'],
})
export class BusinessDetailComponent implements OnInit {
  constructor(
    private kycServices: KycService,
    private fb: UntypedFormBuilder,
    private _UtilityService: UtilityService,
    private auth: AuthService,
    private toastr: ToasterService
  ) { }

  userDetail: any;

  businessTypeList: BehaviorSubject<any> = new BehaviorSubject('');
  businessCategoryList: BehaviorSubject<any> = new BehaviorSubject('');
  business_type_list$: Observable<any> = this.businessTypeList.asObservable();
  business_category_list$: Observable<any> = this.businessCategoryList.asObservable();

  dateFormat = 'MM/dd/yyyy';
  form: UntypedFormGroup = this.fb.group({
    user_id: [''],
    business_type_id: ['', [Validators.required]],
    business_category_id: ['', [Validators.required]],
    business_entity: ['', [Validators.required]],
    other_sub_category: [''],
    business_name: [{ value: '', disabled: true }, [Validators.required]],
    description: ['', [Validators.required]],
    isOperational_address: ['1', [Validators.required]],
    address_street_no: [{ value: '', disabled: true }, [Validators.required]],
    address_pin_code: [{ value: '', disabled: true }, [Validators.required]],
    address_city_name: [{ value: '', disabled: true }, [Validators.required]],
    address_state_name: [{ value: '', disabled: true }, [Validators.required]],
    constitution_of_business: [''],
    operational_street_no: ['', [Validators.required]],
    operational_pin_code: ['', [Validators.required]],
    operational_city_name: ['', [Validators.required]],
    operational_state_name: ['', [Validators.required]],
    address: [''],
    pan_number: [''],
    doctype: [''],
    state_shop: [''],
    state_code: [''],
    domain_origin: ['', [Validators.required]],
    site_url: ['', [Validators.required]],
  });

  @Output() isSavedBusinessDetail = new EventEmitter<boolean>();

  @Output() selectedServiceBusiness = new EventEmitter<any>();

  isEditBusinessDetail: boolean = false;
  currentKycStep: any;
  gstn_rep_obj: any = {
    business_name: '',
    constitution_of_business: '',
    pan_number: '',
    gstn_no: '',
    address: '',
  };

  documentList: any[] = [
    {
      id: 1,
      type: 'GST',
      value: 'GSTIN No.',
      is_show: true,
      is_trust_show: true,
    },
    { id: 2, type: 'SHOP', value: 'Shop', is_show: true, is_trust_show: false },
    {
      id: 3,
      type: 'UDYAM',
      value: 'Udgyog Aadhar',
      is_show: true,
      is_trust_show: false,
    },
    // {id:4,type:'COI',value:'COI',is_show:false,is_trust_show:true}
  ];

  shopStateList: any[] = [];
  conditionError: string = '';
  storeSubs: any = Subscription;
  udyamSubs: any = Subscription;
  udyamDetailSubs: any = Subscription;
  udyamStoreSubs: any = Subscription;
  // confirmationRef: ConfirmationModalOverlayRef;
  company_id: any;

  businessEntity: any[] = [
    { name: 'Regulatory', value: 'regulatory' },
    { name: 'Non-regulatory', value: 'nonregulatory' },
  ];
  confirmationRef: any;


  async ngOnInit() {
    // patching form values
    this.patchBusinessDataFromApis();

    this.getBusinessTypeList();
    this.getBusinessCategoryList();

    // this.userDetailsService.userLoginDetails.subscribe({
    //   next: (value: any) => {
    //     this.currentKycStep = value?.data?.kyc_step;
    //     this.company_id=value?.data?.company_id;
    //   }
    // });

    this.form.get('business_type_id')?.valueChanges.subscribe((resu) => {
      // console.log("resppp ", resu)
      this.company_id = resu;
      //  this.addControls();
      // setTimeout(() => {
      //  && resu != 12
      if (resu != 3) {
        this.form.get('doctype')?.setValue('GST');
        this.form.get('doctype')?.disable();
        setTimeout(() => {
          // this.form.controls['doctype']?.disabled;
          this.addGstControle();
          this.form.removeControl('shop_number');
          this.form.removeControl('udyam_no');
        }, 1);
        this._UtilityService.setRemoveValidator(
          'r',
          this.form,
          ['state_code', 'doctype'],
          Validators.required
        );
      } else {
        this.form.get('doctype')?.enable();
        this.form.get('doctype')?.setValue('');
        this._UtilityService.setRemoveValidator(
          'a',
          this.form,
          'doctype',
          Validators.required
        );
      }
      // }, 1);
    });

    this.form.get('business_category_id')?.valueChanges.subscribe((resp) => {
      this.form.get('other_sub_category')?.setValue('');

      if (resp == 13) {
        this.form.get('other_sub_category')?.setValidators(Validators.required);
      } else {
        this.form
          .get('other_sub_category')
          ?.removeValidators(Validators.required);
      }
      this.form.get('other_sub_category')?.updateValueAndValidity();
    });

    // this.currentKycStep = this.sessionStorage.getItem('kycSteps');
    if (this.currentKycStep) {
      if (this.currentKycStep > 2) {
        this.isEditBusinessDetail = true;
      }
    }

    this.userDetail = this.kycServices.user_detail.getValue();
    // if (this.userDetail) {
    //   this.form.patchValue({ business_type_id: this.userDetail.company_id, user_id: this.userDetail.id });
    // }

    this.form.get('doctype')?.valueChanges.subscribe((resp) => {
      // console.log(resp);
      //|| this.form.get('business_type_id')?.value == 12
      if (resp && this.form.get('business_type_id')?.value == 3) {
        this.form.get('state_code')?.setValue('');
        this.form.get('gstn_no')?.setValue('');
        this.form.removeControl('coi');
        if (resp == 'SHOP') {
          // console.log(resp, '12');
          this.form.removeControl('gstn_no');
          this.form.removeControl('udyam_no');
          this.getShopStateList();
          this.form.get('state_code')?.setValidators(Validators.required);
          this.form.addControl(
            'shop_number',
            this.fb.control('', [
              Validators.required,
              Validators.maxLength(10),
              Validators.minLength(10),
            ])
          );
        } else if (resp == 'UDYAM') {
          this.form.removeControl('shop_number');
          this.form.removeControl('gstn_no');
          this.form.get('state_code')?.removeValidators(Validators.required);
          this.form.addControl(
            'udyam_no',
            this.fb.control('', [
              Validators.required,
              Validators.maxLength(12),
              Validators.minLength(12),
              regExpNativePatternValidator('Udyogno', {
                termconditionError: () => `Please Enter valid Udyog Aadhar No.`,
              }),
            ])
          );
        } else if (resp == 'GST') {
          this.form.removeControl('shop_number');
          this.form.removeControl('udyam_no');
          this.addGstControle();
          this.form.get('state_code')?.removeValidators(Validators.required);
        } else {
          this.form.removeControl('shop_number');
          this.form.removeControl('udyam_no');
        }
        this.form.get('state_code')?.updateValueAndValidity();
      }
    });
    // || this.company_id == 12
    // console.log(this.company_id)
    // if (this.company_id == 3) {
    //   let res = await this.getShopStateList();
    //   if (res) {
    //     this.getKycViewModeDetail();
    //   }
    // } else {
    //   this.getKycViewModeDetail();
    // }
  }

  enableTextField() {
    this.form.get('business_name')?.enable();
    this.form.get('address_street_no')?.enable();
    this.form.get('address_pin_code')?.enable();
    this.form.get('address_city_name')?.enable();
    this.form.get('address_state_name')?.enable();
  }

  disableTextField() {
    this.form.get('business_name')?.disable();
    this.form.get('address_street_no')?.disable();
    this.form.get('address_pin_code')?.disable();
    this.form.get('address_city_name')?.disable();
    this.form.get('address_state_name')?.disable();
  }

  // getKycViewModeDetail() {
  //   const kyc_data = this.kycServices.kyc_detail_.getValue();
  //   const kycDetail = kyc_data.kyc_list;
  //   if (kycDetail.businessdetail) {
  //     const response = kycDetail.businessdetail;
  //     // console.log(response.gstno)
  //     this.form.get('business_type_id')?.setValue(response.type, { emitEvent: false });
  //     this.dateFormat = 'yyyy/MM/dd';
  //     setTimeout(() => {
  //       this.form.get('doctype')?.setValue(response?.doctype);

  //       // console.log(response?.site_reg_date)
  //       setTimeout(() => {
  //         this.form.patchValue({
  //           //business_type_id: response.type,
  //           business_category_id: response.category,
  //           other_sub_category: response?.other_sub_category,
  //           gstn_no: response?.gstno,
  //           udyam_no: response?.gstno,
  //           shop_number: response?.gstno,
  //           coi: response?.gstno,
  //           //doctype : response?.doctype,
  //           state_shop: response?.state_shop,
  //           state_code: this.shopStateList.filter(d => d.state == response?.state_shop)[0]?.state_code,
  //           business_name: response.name,
  //           description: response.description,
  //           isOperational_address: response.operational_pin_code ? 0 : 1,
  //           address_street_no: response.add_streetno,
  //           address_pin_code: response.add_pincode,
  //           address_city_name: response.add_city,
  //           address_state_name: response.add_state,
  //           operational_street_no: response.opr_streetno,
  //           operational_pin_code: response.opr_pincode,
  //           operational_city_name: response.opr_city,
  //           operational_state_name: response.opr_state,
  //           pan_number: response.pan_number,
  //           site_reg_date: new Date(response?.site_reg_date),
  //           domain_origin: response?.domain_origin,
  //           site_url: response?.site_url,
  //           business_entity: response?.business_entity,
  //           // constitution_of_business: (this.firm_list.filter(r => r.id == response.type))[0].name
  //         }, { emitEvent: false });
  //         if (response.gstno) {
  //           if (response.status || !response.update_counter) {
  //             this.form.disable({ emitEvent: false });
  //           }
  //           this.isEditBusinessDetail = !response.status ? false : true;
  //         }
  //       }, 1);
  //     }, 1);
  //     // console.log(this.form.get('shop_number')?.value, 'sdsd')
  //   }
  // }

  fetchAddressData(data: string, respo: any, requestType: any) {
    if (requestType == 'SHOP' || requestType == 'UDYAM') {
      let streetNo = '';
      let city_ = '';
      let pin = '';
      if (requestType == 'SHOP') {
        const extAddress = respo.address.trim().split(' ');
        city_ = extAddress[extAddress.length - 3];
        const pinCod = extAddress[extAddress.length - 1];
        const extPin = pinCod.split('-');
        pin = extPin[extPin.length - 1];
        for (let i = 0; i < extAddress.length - 4; i++) {
          streetNo = streetNo + ' ' + extAddress[i];
        }
      }
      this.form.patchValue({
        address_pin_code: requestType == 'UDYAM' ? respo.pin : pin,
        address_city_name: requestType == 'UDYAM' ? respo.city : city_,
        address_state_name:
          requestType == 'UDYAM' ? respo.state : respo.state_name,
        address_street_no:
          requestType == 'UDYAM'
            ? respo?.flat + respo?.village + respo?.block
            : streetNo.trim(),
      });
    } else {
      const addr_obj = this.kycServices.splitAddress(data);
      this.form.patchValue({
        address_pin_code: addr_obj.address_pin_code,
        address_city_name: addr_obj.address_city_name,
        address_state_name: addr_obj.address_state_name,
        address_street_no: addr_obj.address_street_no,
      });
    }

    setTimeout(() => {
      this.bindOperationalAddress();
    }, 1000);
  }

  bindOperationalAddress() {
    // console.log("opertaional ",this.form.value.isOperational_address);
    // console.log("opertaional2 ",this.form.controls['address_city_name'].value);
    if (this.form.value.isOperational_address) {
      this.form.patchValue({
        operational_city_name: this.form.controls['address_city_name'].value,
        operational_pin_code: this.form.controls['address_pin_code'].value,
        operational_state_name: this.form.controls['address_state_name'].value,
        operational_street_no: this.form.controls['address_street_no'].value,
      });
    } else {
      this.form.get('operational_city_name')?.setValue('');
      this.form.get('operational_pin_code')?.setValue('');
      this.form.get('operational_state_name')?.setValue('');
      this.form.get('operational_street_no')?.setValue('');
      // this.form.value.operational_city_name = '';
      // this.form.value.operational_pin_code = '';
      // this.form.value.operational_state_name = '';
      // this.form.value.operational_street_no = '';
    }
  }

  onSelectOperationAddress() {
    this.bindOperationalAddress();
  }

  saveUdyamDetails() {
    let formdata = new FormData();
    for (const control in this.form.controls) {
      formdata.append(control, this.form.controls[control].value);
    }
    this.udyamSubs = this.kycServices.addUdyamDetail(formdata).subscribe({
      next: (resp: any) => {
        // console.log(resp)
      },
    });
  }

  saveStoreDetails() {
    let formdata = new FormData();
    for (const control in this.form.controls) {
      formdata.append(control, this.form.controls[control].value);
    }
    this.storeSubs = this.kycServices.addStoreDetail(formdata).subscribe({
      next: (resp: any) => { },
    });
  }

  updateKycDetail() {
    var jsonObj: any = {};
    jsonObj.add_city = this.form.controls['address_city_name'].value;
    jsonObj.add_pincode = this.form.controls['address_pin_code'].value;
    jsonObj.add_state = this.form.controls['address_state_name'].value;
    jsonObj.add_streetno = this.form.controls['address_street_no'].value;
    jsonObj.category = this.form.controls['business_category_id'].value;
    jsonObj.other_sub_category = this.form.controls['other_sub_category'].value;
    jsonObj.description = this.form.controls['description'].value;
    jsonObj.gstno =
      this.form.controls['gstn_no']?.value ??
      this.form.controls['udyam_no']?.value ??
      this.form.controls['shop_number']?.value ??
      this.form.controls['coi']?.value;
    // jsonObj.gstno = this.form.controls['udyam_no']?.value;
    // jsonObj.gstno = this.form.controls['shop_number']?.value;
    // jsonObj.gstno = this.form.controls['coi']?.value;
    jsonObj.doctype = this.form.controls['doctype']?.value;
    jsonObj.name = this.form.controls['business_name'].value;
    jsonObj.opr_city = this.form.controls['operational_city_name'].value;
    jsonObj.opr_pincode = this.form.controls['operational_pin_code'].value;
    jsonObj.opr_state = this.form.controls['operational_state_name'].value;
    jsonObj.opr_streetno = this.form.controls['operational_street_no'].value;
    jsonObj.pan_number = this.form.controls['pan_number'].value;
    jsonObj.status = 1;
    jsonObj.type = this.form.controls['business_type_id'].value;
    jsonObj.update_counter = 1;
    jsonObj.state_shop = this.form.controls['state_shop'].value;
    jsonObj.state_code = this.form.controls['state_code'].value;
    // this.userDetailsService.updateKycDetail(
    //   { ['kyc_list.businessdetail']: jsonObj }
    // )
    // this.userDetailsService.updateLocalStorage(
    //   { ['data.company_id']: this.form.controls['business_type_id'].value }
    // )
  }

  bindAddressValue(responce: any, requestType: any) {
    if (requestType == 'SHOP' || requestType == 'UDYAM') {
      this.form.get('pan_number')?.removeValidators(Validators.required);
      this.form.get('gstn_no')?.removeValidators(Validators.required);
      // this.form.updateValueAndValidity();
      this.form.get('pan_number')?.updateValueAndValidity();
      this.form.get('gstn_no')?.updateValueAndValidity();
    }
    this.form.patchValue({
      business_name:
        requestType == 'UDYAM'
          ? responce.name_of_enterprise
          : responce.business_name,
      constitution_of_business: responce?.constitution_of_business,
      pan_number: responce?.pan_number,
      address: responce?.address,
    });
    this.gstn_rep_obj.business_name =
      requestType == 'UDYAM'
        ? responce.name_of_enterprise
        : responce.business_name;
    this.gstn_rep_obj.constitution_of_business =
      responce?.constitution_of_business;
    this.gstn_rep_obj.pan_number = responce?.pan_number;
    this.gstn_rep_obj.gstn_no = responce?.gstin;
    this.gstn_rep_obj.address = responce?.address;
    this.fetchAddressData(responce.address, responce, requestType);
  }

  addControls() {
    this.form.addControl(
      'udyam_no',
      this.fb.control('', [
        Validators.required,
        Validators.maxLength(12),
        Validators.minLength(12),
        regExpNativePatternValidator('Udyogno', {
          termconditionError: () => `Please Enter valid Udyog Aadhar No.`,
        }),
      ])
    );
    this.form.addControl(
      'gstn_no',
      this.fb.control('', [
        Validators.required,
        Validators.minLength(15),
        Validators.maxLength(15),
        regExpNativePatternValidator('GSTIN', {
          termconditionError: () => `Please Enter valid GSTN.`,
        }),
      ])
    );
    this.form.addControl(
      'shop_number',
      this.fb.control('', [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
      ])
    );
  }

  // !-------------------------------------------------------------------------------------
  getBusinessTypeList() {
    this.auth
      .postHeaderwithoutpayload(config.businessType.url)
      .subscribe((res: any) => {
        if (res.statuscode == 200) {
          this.businessTypeList.next(res.list);
        }
      });
  }

  getBusinessCategoryList() {
    this.auth.postHeaderwithoutpayload(config.businessCategory.url).subscribe({
      next: (res: any) => {
        if (res.statuscode == 200) {
          this.businessCategoryList.next(res.list);
        }
      },
    });
  }

  addGstControle() {
    this.form.addControl(
      'gstn_no',
      this.fb.control('', [
        Validators.required,
        Validators.minLength(15),
        Validators.maxLength(15),
        regExpNativePatternValidator('GSTIN', {
          termconditionError: () => `Please Enter valid GSTN.`,
        }),
      ])
    );
    this.form.updateValueAndValidity();

  }

  onChangeGstn() {
    if (this.form?.value?.gstn_no?.length == 15 && !this.form.get('gstn_no')?.invalid) {
      const formData = new FormData();
      formData.append('gstno', this.form.get('gstn_no')?.value);

      this.auth
        .postdata(formData, config.UserKyc.gstnDetail.url)
        .subscribe((res) => {
          if (res.statuscode == 200 && res.status) {
            const response = res.data;
            // this.toaster.showSuccess(res.message, 'Success');
            this.form.patchValue({
              business_name: response.business_name,
              constitution_of_business: response.constitution_of_business,
              pan_number: response.pan_number,
              address: response.address,
            });
            this.gstn_rep_obj.business_name = response.business_name;
            this.gstn_rep_obj.constitution_of_business =
              response.constitution_of_business;
            this.gstn_rep_obj.pan_number = response.pan_number;
            this.gstn_rep_obj.gstn_no = response.gstin;
            this.gstn_rep_obj.address = response.address;
            this.fetchAddressData(
              response.address,
              res,
              this.form.get('doctype')?.value
            );
          } else {
            // this.toaster.showError(res.message, 'Error');
            // this.form.get() reset();
            this.form.controls['gstn_no'].setValue('');
            // if (this.userDetail) {
            //   this.form.patchValue({ business_type_id: this.userDetail.company_id, user_id: this.userDetail.id });
            // }
            this.form.get('isOperational_address')?.patchValue(1);
          }
        });
    }
  }

  getShopStateList() {
    return new Promise((resolve, reject) => {
      this.auth
        .postHeaderwithoutpayload(config.UserKyc.shopStateList.url)
        .subscribe((resp) => {
          if (resp && resp.statuscode == 200 && resp.status) {
            this.shopStateList = resp.data;
          } else {
            // this.toaster.showError(resp.message, "Error")
          }
          resolve(true);
        });
    });
  }

  onUdyamChange(event: any) {
    if (this.form.get('udyam_no')?.valid) {
      this.getUdyamDetail();
    }
  }

  getUdyamDetail() {
    const formData = new FormData();
    formData.append('udyamno', this.form.get('udyam_no')?.value);

    this.udyamDetailSubs = this.auth
      .postdata(formData, config.UserKyc.udyamDetail.url)
      .subscribe((respo) => {
        if (respo && respo.statuscode == 200 && respo.status) {
          this.bindAddressValue(
            respo.data.main_details,
            this.form.get('doctype')?.value
          );
        } else {
          // this.toaster.showError(respo.message, 'Error');
        }
      });
  }

  onShopNoChange(event: any) {
    if (this.form.get('shop_number')?.valid) {
      this.getShopDetail();
    }
  }

  getShopDetail() {
    const formData = new FormData();
    const state_ = this.shopStateList.filter(
      (d) => d.state_code == this.form.get('state_code')?.value
    )[0];
    this.form.get('state_shop')?.setValue(state_.state);
    formData.append('state_code', this.form.get('state_code')?.value);
    formData.append('state_shop', state_.state);
    formData.append('shop_number', this.form.get('shop_number')?.value);
    this.udyamStoreSubs = this.auth
      .postdata(formData, config.UserKyc.getShopDetail.url)
      .subscribe((respo) => {
        if (respo && respo.statuscode == 200 && respo.status) {
          this.bindAddressValue(respo.data, this.form.get('doctype')?.value);
        }
      });
  }

  openSubmitConfirmationModal(item?: any, message?: string, index?: any) {
    // if (this.form.controls['gstn_no']?.value) {
    //   const respo = this.kycServices.matchObjectData(this.gstn_rep_obj, this.form.controls);
    //   if (respo && respo.length > 0) {
    //     // this.toaster.showError(respo + ' does not match', 'Error')
    //     return;
    //   }
    // }

    // // let customConfig: ConfirmationModalConfig = {
    // //   data: {
    // //     icon: 'info',
    // //     title: 'Final Confirmation?',
    // //     title2: '',
    // //     msg: "Are you sure to proceed with these business details, NOTE: Details once submitted will not be changed?",
    // //     btnConfirm: 'Confirm',
    // //     btnClose: 'Cancel'
    // //   },
    // // };

    // // this.confirmationRef = this._ConfirmationModalService.open<ConfirmationComponent>(
    // //     ConfirmationComponent,
    // //     customConfig
    // //   );
    // this.confirmationRef.events.pipe(filter((event) => {
    //   //console.log(event);
    //   return !!event
    // }),
    // ).subscribe((events: any) => {
    //   switch (events.type) {
    //     case 'confirm':

    //       //console.log('confirmed action, proceed');
    //       const doctype_ = this.form.get('doctype')?.value;
    //       const reqUrl = doctype_ == 'SHOP' ? config.UserKyc.storeShopDetails : doctype_ == 'UDYAM' ?
    //         config.UserKyc.storeUdhyamDetails : config.UserKyc.addBusinessDetail;

    //       this.kycServices.addBusinessDetail(formdata, reqUrl).subscribe(res => {
    //         // this.confirmationRef.close(customConfig);
    //         if (res) {
    //           if (res.statuscode == 200 && res.status) {
    //             this.updateKycDetail();
    //             // this.sessionStorage.setItem('kycSteps', res.kyc_step);
    //             if (this.currentKycStep != 10) {
    //               // this.userDetailsService.updateLocalStorage(
    //               //   { ['data.kyc_step']: res.kyc_step }
    //               // )
    //             }
    //             this.isSavedBusinessDetail.emit(true);
    //             // const modalRef = this.modalService.open(MoreDetailRequiredComponent);
    //             //this.sessionStorage.setItem('documentList', res.document_list);
    //             // this.userDetailsService.updateKycDetail(
    //             //   { ['document_list']: res.document_list }
    //             // )
    //             this.kycServices.businesDetailSubject.next(res.data);
    //             // this.toaster.showSuccess(res.message, "Success");
    //           } else {
    //             // this.toaster.showError(res.message, "Error");
    //           }
    //         }
    //       })

    //       break;
    //     case 'close':
    //       //console.log('close modal');
    //       // this.confirmationRef.close(customConfig);
    //       break;
    //   }
    // });

    const formData = new FormData();
    // for (const control in this.form.controls) {
    //   formData.append(control, this.form.get(control)?.value);
    // }
    formData.append(
      'business_type_id',
      this.form.get('business_type_id')?.value
    );
    formData.append(
      'business_category_id',
      this.form.get('business_category_id')?.value
    );
    formData.append(
      'other_sub_category',
      this.form.get('other_sub_category')?.value
    );
    formData.append(
      'constitution_of_business',
      this.form.get('constitution_of_business')?.value
    );
    formData.append('business_name', this.form.get('business_name')?.value);
    formData.append('gstn_no', this.form.get('gstn_no')?.value);
    formData.append('pan_number', this.form.get('pan_number')?.value);
    formData.append(
      'address_street_no',
      this.form.get('address_street_no')?.value
    );
    formData.append(
      'address_pin_code',
      this.form.get('address_pin_code')?.value
    );
    formData.append(
      'address_city_name',
      this.form.get('address_city_name')?.value
    );
    formData.append(
      'address_state_name',
      this.form.get('address_state_name')?.value
    );
    formData.append('business_entity', this.form.get('business_entity')?.value);
    formData.append('site_url', this.form.get('site_url')?.value);

    if (this.form.get('isOperational_address')?.value) {
      formData.append(
        'operational_street_no',
        this.form.get('operational_street_no')?.value
      );
      formData.append(
        'operational_pin_code',
        this.form.get('operational_pin_code')?.value
      );
      formData.append(
        'operational_city_name',
        this.form.get('operational_city_name')?.value
      );
      formData.append(
        'operational_state_name',
        this.form.get('operational_state_name')?.value
      );
    }

    //TODO need bug fixing------ 
    this.auth.postdata(formData, config.UserKyc.addBusinessDetail.url).subscribe({
      next: (res: any) => {
        if (res && res.statuscode == 200 && res.status) {
          // this.selectedServiceBusiness.emit(3);
          this.toastr.showSuccess(res?.message, '');
          this.selectedServiceBusiness.emit(res?.kyc_step);
        }
        else if (res && res.statuscode == 203) {
          this.toastr.showWarning(res?.message, '');
          this.selectedServiceBusiness.emit(res?.kyc_step);
        }
        else {
          this.toastr.showError(res?.message, '');
        }
      },
      error: (err) => {
        // handle error
        console.log(err);
      }
    })
  };


  patchBusinessDataFromApis() {
    this.auth.postHeaderwithoutpayload(config.UserKyc.adminKycDetail.url).subscribe({
      next: (res) => {
        if (res?.statuscode == 200 && res?.status && res?.kyc_list?.businessdetail) {
          this.form.patchValue({
            user_id: res?.kyc_list?.businessdetail?.user_id,
            business_type_id: res?.kyc_list?.businessdetail?.type,
            business_category_id: res?.kyc_list?.businessdetail?.category,
            business_entity: res?.kyc_list?.businessdetail?.business_entity,
            other_sub_category:
              res?.kyc_list?.businessdetail?.other_sub_category,
            business_name: res?.kyc_list?.businessdetail?.name,
            description: res?.kyc_list?.businessdetail?.description,
            address_street_no: res?.kyc_list?.businessdetail?.add_streetno,
            address_pin_code: res?.kyc_list?.businessdetail?.add_pincode,
            address_city_name: res?.kyc_list?.businessdetail?.add_city,
            address_state_name: res?.kyc_list?.businessdetail?.add_state,
            operational_street_no:
              res?.kyc_list?.businessdetail?.opr_streetno,
            operational_pin_code: res?.kyc_list?.businessdetail?.opr_pincode,
            operational_city_name: res?.kyc_list?.businessdetail?.opr_city,
            operational_state_name: res?.kyc_list?.businessdetail?.opr_state,
            // address: res?.kyc_list?.businessdetail?.business_entity,
            pan_number: res?.kyc_list?.businessdetail?.pan_number,
            doctype: res?.kyc_list?.businessdetail?.doctype,
            state_shop: res?.kyc_list?.businessdetail?.state_shop,
            // state_code: res?.kyc_list?.businessdetail?.business_entity,
            domain_origin: res?.kyc_list?.businessdetail?.domain_origin,
            site_url: res?.kyc_list?.businessdetail?.site_url,
            gstn_no: res?.kyc_list?.businessdetail?.gstno,
          });

          this.disabledFieldsAfterPatching();
          this.onChangeGstn();
        }
      },
    });
  }

  disabledFieldsAfterPatching() {
    if (this.form.get('gstn_no')?.value) {
      this.form.get('gstn_no')?.disable();
      // console.log(this.form.get('gstn_no')?.value);
    }

    if (this.form.get('business_entity')?.value) {
      this.form.get('business_entity')?.disable();
    }

    if (this.form.get('business_category_id')?.value) {
      this.form.get('business_category_id')?.disable();
    }

    if (this.form.get('doctype')?.value) {
      this.form.get('doctype')?.disable({ emitEvent: false });
    }

    if (this.form.get('other_sub_category')?.value) {
      this.form.get('other_sub_category')?.disable();
    }

    // if (this.form.get('udyam_no')?.value) {
    //   this.form.get('udyam_no')?.disable();
    // }
    // if (this.form.get('shop_number')?.value) {
    //   this.form.get('shop_number')?.disable();
    // }
    // if (this.form.get('doctype')?.value) {
    //   this.form.get('doctype')?.disable();
    // }

    if (this.form.get('business_type_id')?.value) {
      this.form.get('business_type_id')?.disable({ emitEvent: false });
    }
  }

  //!-----------------------------------------------------------------------------------

  // ngOnDestroy(): void {
  //   if (this.udyamSubs) {
  //     this.udyamSubs.unsubscribe();
  //   };

  //   if (this.storeSubs) {
  //     this.storeSubs.unsubscribe();
  //   };

  //   if (this.udyamStoreSubs) {
  //     this.udyamStoreSubs.unsubscribe();
  //   };

  //   if (this.udyamDetailSubs) {
  //     this.udyamDetailSubs.unsubscribe();
  //   };
  // };
}
