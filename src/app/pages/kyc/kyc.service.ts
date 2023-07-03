import { Injectable, OnDestroy } from '@angular/core';
import { ApiRequestService } from '@core/services/api-request.service';
import { config } from '@core/services/request-url.service';
// import { NgxToasterService } from '@core/services/toasterNgs.service';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StoreService } from '@core/services/store.service';

@Injectable({
  providedIn: 'root',
})
export class KycService implements OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private apiRequest: ApiRequestService,
    // private toaster: NgxToasterService,
    private http: HttpClient,
    private store: StoreService
  ) { }

  selectedChildKycStep: BehaviorSubject<any> = new BehaviorSubject('');
  selectedKycStep: BehaviorSubject<any> = new BehaviorSubject('');
  businesDetailSubject: BehaviorSubject<any> = new BehaviorSubject('');
  // isKycComplete:BehaviorSubject<any>=new BehaviorSubject(false);
  user_detail: BehaviorSubject<any> = new BehaviorSubject('');
  //all_kyc_detail_:  BehaviorSubject<any> = new BehaviorSubject('');
  kyc_detail_: BehaviorSubject<any> = new BehaviorSubject('');
  // rejectedDocumentList:  BehaviorSubject<any> = new BehaviorSubject('');
  finalKycStep: BehaviorSubject<any> = new BehaviorSubject('');














  saveContactDetail(payLoadData: any) {
    return this.apiRequest.postdata(payLoadData, config.UserKyc.contactDetail);
  }

  getGSTNDetail(payLoadData: any) {
    return this.apiRequest.postdata(payLoadData, config.UserKyc.gstnDetail);
  }

  addBusinessDetail(payLoadData: any, reqUrl: any) {
    return this.apiRequest.postdata(payLoadData, reqUrl);
  }

  addUdyamDetail(payLoadData: any) {
    return this.apiRequest.postdata(
      payLoadData,
      config.UserKyc.storeUdhyamDetails
    );
  }

  addStoreDetail(payLoadData: any) {
    return this.apiRequest.postdata(
      payLoadData,
      config.UserKyc.storeStoreDetails
    );
  }

  // panVerify(payLoadData:any){
  //     return this.apiRequest.postdata(payLoadData,config.UserKyc.addBusinessDetail);
  // }

  addBusinessDocuments(payLoadData: any, requestUrl: any) {
    return this.apiRequest.postdata(payLoadData, requestUrl);
  }

  //  apply these api
  getUdyamDetail(payLoadData: any) {
    return this.apiRequest.postdata(payLoadData, config.UserKyc.udyamDetail);
  }

  getShopStateList(payLoadData: any) {
    return this.apiRequest.postdata(payLoadData, config.UserKyc.shopStateList);
  }

  getShopDetail(payLoadData: any) {
    return this.apiRequest.postdata(payLoadData, config.UserKyc.getShopDetail);
  }

  // getPanName(payLoadData:any){
  //     return this.apiRequest.postdata(payLoadData,config.UserKyc.fetchPanName);
  // }

  // verifySignatoryAddress(payLoadData:any){
  //     return this.apiRequest.postdata(payLoadData,config.UserKyc.uploadDocument.verifyAddressDoc);
  // }

  // submitDocumentKyc(payload:any){
  //     return this.apiRequest.postdata(payload,config.UserKyc.uploadDocument.submitDocKyc);
  // }

  chequeOcr(payload: any) {
    return this.apiRequest.postdata(payload, config.UserKyc.chequeOcr);
  }

  addBankDetails(payload: any) {
    return this.apiRequest.postdata(payload, config.UserKyc.saveBankDetail);
  }

  finalKycUpdate(payload: any) {
    return this.apiRequest.postdata(payload, config.UserKyc.finalKycUpdate);
  }

  createVirctualAccount(payload: any) {
    return this.apiRequest.postdata(
      payload,
      config.UserKyc.createVirtualAccount
    );
  }

  // getKycDetail(payload:any): Observable<any>{
  //     return this.apiRequest.postdata(payload,config.UserKyc.adminKycDetail);
  // }

  getKycDetail(): Promise<any> {
    const formData = new FormData();
    return new Promise((resolve, reject) => {
      this.apiRequest
        .postdata(formData, config.UserKyc.adminKycDetail)
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  getDocumentList(): Observable<any> {
    const payload = new FormData();
    return this.apiRequest.postdata(payload, config.UserKyc.getDocumentList);
  }

  createPanOcr(payload: any) {
    return this.apiRequest.postdata(
      payload,
      config.UserKyc.uploadDocument.partnerPanOcr
    );
  }

  verifyPanOcr(payload: any) {
    return this.apiRequest.postdata(
      payload,
      config.UserKyc.uploadDocument.partnerPanverify
    );
  }

  createAadharOtp(payload: any): Observable<any> {
    return this.apiRequest.postdata(
      payload,
      config.UserKyc.uploadDocument.aadharOtp
    );
  }

  verifyAadharOtp(payload: any): Observable<any> {
    return this.apiRequest.postdata(
      payload,
      config.UserKyc.uploadDocument.verifyAadharOtp
    );
  }

  verifyVoterId(payload: any): Observable<any> {
    return this.apiRequest.postdata(
      payload,
      config.UserKyc.uploadDocument.verifyVoterId
    );
  }

  verifyVoterIdOrDL(payload: any, reqUrl: any): Observable<any> {
    return this.apiRequest.postdata(payload, reqUrl);
  }

  verifyDl(payload: any): Observable<any> {
    return this.apiRequest.postdata(
      payload,
      config.UserKyc.uploadDocument.dlverify
    );
  }

  verifyPP(payload: any): Observable<any> {
    return this.apiRequest.postdata(
      payload,
      config.UserKyc.uploadDocument.ppverify
    );
  }

  kycAadharStore(payload: any): Observable<any> {
    return this.apiRequest.postdata(
      payload,
      config.UserKyc.uploadDocument.aadhar_store
    );
  }

  kycAadharOcr(payload: any): Observable<any> {
    return this.apiRequest.postdata(
      payload,
      config.UserKyc.uploadDocument.aadhar_ocr
    );
  }
  // verifyDocumnetValidation(documentDetail){
  //     let isValid:boolean= true;
  //     let pan=documentDetail.partner_file_url == 'assets/assets/img/upload_file.png'?'':documentDetail.partner_file_url;
  //     let aadharFront=documentDetail.partner_file_url1 == 'assets/assets/img/upload_file.png'?'':documentDetail.partner_file_url1;
  //     //let aadharBack=documentDetail.partner_file_url2 == 'assets/assets/img/upload_file.png'?'':documentDetail.partner_file_url2;
  //     if(!pan){
  //       this.toaster.showWarning('Please Upload Pan Card',"Warning");
  //       isValid =false;
  //       return;
  //     }
  //     if(!aadharFront){
  //       this.toaster.showWarning(`Please uplaod ${documentDetail?.address_proof} fron side`,"Warning");
  //       isValid =false;
  //       return
  //     }
  //     return isValid;
  // }
  ngOnDestroy(): void {
    // this.isKycComplete.next(false);
  }

  splitAddress(address_: string) {
    const address_obj = {
      address_pin_code: '',
      address_city_name: '',
      address_state_name: '',
      address_street_no: '',
    };
    let splitedAddress = address_.split(',');
    address_obj.address_pin_code =
      splitedAddress[splitedAddress.length - 1].trim();
    address_obj.address_city_name =
      splitedAddress[splitedAddress.length - 3].trim();
    address_obj.address_state_name =
      splitedAddress[splitedAddress.length - 2].trim();
    let streetNo = '';
    for (let i = 0; i < splitedAddress.length - 4; i++) {
      streetNo = streetNo + splitedAddress[i];
    }
    address_obj.address_street_no = streetNo;
    return address_obj;
  }


  /**
   * It compares two objects and returns an array of the keys that are different
   * @param {any} objData - The object that contains the data that you want to match with the form data.
   * @param {any} formData - The form data that you want to compare with the object data.
   */
  matchObjectData(objData: any, formData: any) {
    if (objData.address) {
      const addr_obj: any = objData.address
        ? this.splitAddress(objData.address)
        : {};
      objData.address_pin_code = addr_obj.address_pin_code;
      objData.address_city_name = addr_obj.address_city_name;
      objData.address_state_name = addr_obj.address_state_name;
      objData.address_street_no = addr_obj.address_street_no;

      var formContData: any = {};
      for (const key in objData) {
        for (const control in formData) {
          if (key == control)
            formContData[`${control}`] = formData[control].value;
        }
      }
    }
    var diff: any;
    if (formContData) {
      diff = Object.keys(formContData).reduce((result, key) => {
        if (!objData.hasOwnProperty(key)) {
          result.push(key);
        } else if (_.isEqual(formContData[key], objData[key])) {
          const resultKeyIndex = result.indexOf(key);
          result.splice(resultKeyIndex, 1);
        }
        return result;
      }, Object.keys(objData));
    }
    return diff;
  }


}
