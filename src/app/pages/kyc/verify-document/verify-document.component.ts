import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { config } from '@core/interfaces/api_baseurl';
import { kycServiceStepsInterface } from '@core/interfaces/kycServiceSteps.interface';
import { AuthService } from '@core/services/auth.service';
import { EventEmitter } from '@angular/core';
import { verifyDocType } from '@core/enums/verifyDocType.enum';
import { KYC_Service_Steps } from '@core/common/common-config';
import { RiCustomMdlService } from '@core/custom-otp-modal/ri-custom-mdl/ri-custom-mdl.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomConfirmModalComponent } from '@core/custom-confirm-modal/custom-confirm-modal.component';
import { ToasterService } from '@core/services/toaster.service';

@Component({
  selector: 'app-verify-document',
  templateUrl: './verify-document.component.html',
  styleUrls: ['./verify-document.component.scss'],
})
export class VerifyDocumentComponent implements OnInit {


  constructor(private formBuilder: FormBuilder, private auth: AuthService, private _RiCustomMdlService: RiCustomMdlService, private modalService: NgbModal, private toastr: ToasterService) { }

  ngOnInit(): void {
    // for disabling and enabling partnerKyc-AddressProofType
    // this.partnerKycForm.valueChanges.subscribe(values => {
    //   if (values.person_name && values.mobile_number && values.email_id) {
    //     this.partnerKycForm.controls['address_proof'].enable();
    //   } else {
    //     this.partnerKycForm.controls['address_proof'].disable();
    //   }
    // });
    this.callGetDocListApi();
    this.patchVerifyDocDataFromApis();

  }

  files: File[] = [];
  documentVerificationForm: any;

  // list of files
  panDocFile!: File | null;
  regCertificationFile!: File | null;
  partnerPanDocFile!: File | null;
  aadharFrontDocFile!: File | null;
  aadharBackDocFile!: File | null;
  drivingLicDocFile!: File | null;
  passportFrontDocFile!: File | null;
  passportBackDocFile!: File | null;
  voterIdDocFile!: File | null;

  // list file urls
  panDocFileUrl: string | null = null;
  regCertificationFileUrl: string | null = null;
  partnerPanDocFileUrl: string | null = null;
  aadharFrontDocFileUrl: string | null = null;
  aadharBackDocFileUrl: string | null = null;
  drivingLicDocFileUrl: string | null = null;
  passportFrontDocFileUrl: string | null = null;
  passportBackDocFileUrl: string | null = null;
  voterIdDocFileUrl: string | null = null;

  // partner-details
  //* fullName, mobileNumber and EmaildId - will get from the FORM-----------------------------------------------------
  partnerFullName!: string;
  partnerMobileNumber: any;
  partnerEmailId: any;
  partnerId: any;
  partnerPassportNumber: any;
  partnerDob: any;
  partnerFatherName: any;
  partnerPassportFileNumber: any;
  partnerAddressB: any;
  partnerDlNumber: any;

  partnerKycForm: FormGroup = this.formBuilder.group({
    person_name: ['', [Validators.required]],
    mobile_number: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    email_id: ['', [Validators.required, Validators.email]],
    // address_proof: [{ value: '', disabled: true }, [Validators.required]],
    address_proof: [{ value: '' }, [Validators.required]],
  });

  KYC_Service_Steps: any = KYC_Service_Steps;

  readonly verifyDocType = verifyDocType;

  @Input() selectedkycStep: any;
  @Input() kycMaxStepLimit: any;

  @Output()
  kycServiceStepsDataEmitter: EventEmitter<kycServiceStepsInterface> =
    new EventEmitter<kycServiceStepsInterface>();

  @Output()
  selectedServiceVerifyDoc = new EventEmitter<any>();

  businessPanImgPath: any = null;
  regCertificateImgPath: any = null;
  partnerPanImgPath: any = null;
  additionalProofFrontImgPath: any = null;
  additionalProofBackImgPath: any = null;

  // mdlId: any = 'livemdl';

  allowedImgTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  maxImgSize = 4 * 1024 * 1024; // 2Mb in bytes

  // For Address Proof Type
  public AddressProofValue = '';
  setAddressProofValue(dropValue: any) {
    this.AddressProofValue = dropValue?.target?.value;
  }

  callGetDocListApi() {
    this.auth
      .postHeaderwithoutpayload(config.UserKyc.getDocumentList.url)
      .subscribe({
        next: (res) => {
          if (res?.statuscode == 200 && res?.status) {
            this.KYC_Service_Steps[2].sub_type = res?.document_list;
            // console.log(this.KYC_Service_Steps[2].sub_type);
            this.kycServiceStepsDataEmitter.emit(this.KYC_Service_Steps);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  // TODO ----------------------------------------------------------------------------------------------------

  // * Drag and drop-----------------------------------------------------------
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.setDragOver(event.type === 'dragover');
  }

  setDragOver(isOver: boolean) {
    const dropZone = document.querySelector('.drop-zone');
    if (dropZone) {
      if (isOver) {
        dropZone.classList.add('drag-over');
      } else {
        dropZone.classList.remove('drag-over');
      }
    }
  }

  onDrop(event: DragEvent, verifyDocSelectedStepValue: any) {
    event.preventDefault();
    const files: FileList = <FileList>event.dataTransfer?.files;

    if (verifyDocSelectedStepValue === verifyDocType.BUSINESS_PAN) {
      if (files[0] && files.length > 0) {
        this.panDocFile = files[0];
        if (
          this.panDocFile &&
          this.allowedImgTypes.includes(this.panDocFile.type)
        ) {
          if (this.panDocFile.size < this.maxImgSize) {
            this.confirmUpload(this.panDocFile, verifyDocSelectedStepValue);
          } else {
            this.toastr.showWarning('File size must be less than 4MB', '');
            this.panDocFile = null;
          }
        } else {
          this.toastr.showError('File type is not supported', '');
          this.panDocFile = null;
        }
      }
    } else if (
      verifyDocSelectedStepValue === verifyDocType.REGISTRATION_CERTIFICATE
    ) {
      if (files[0] && files.length > 0) {
        this.regCertificationFile = files[0];
        if (
          this.regCertificationFile &&
          this.allowedImgTypes.includes(this.regCertificationFile.type)
        ) {
          if (this.regCertificationFile.size < this.maxImgSize) {
            this.confirmUpload(
              this.regCertificationFile,
              verifyDocSelectedStepValue
            );
          } else {
            this.toastr.showWarning('File size must be less than 4MB', '');
            this.regCertificationFile = null;

          }
        } else {
          this.toastr.showError('File type not supported', '');
          this.regCertificationFile = null;
        }
      }
    } else if (verifyDocSelectedStepValue === verifyDocType.PARTNER_PAN) {
      if (
        this.partnerKycForm.get('person_name')?.value &&
        this.partnerKycForm.get('mobile_number')?.value &&
        this.partnerKycForm.get('email_id')?.value
      ) {
        this.partnerFullName = this.partnerKycForm.get('person_name')?.value;
        this.partnerMobileNumber =
          this.partnerKycForm.get('mobile_number')?.value;
        this.partnerEmailId = this.partnerKycForm.get('email_id')?.value;

        if (files[0] && files.length > 0) {
          this.partnerPanDocFile = files[0];
          if (
            this.partnerPanDocFile &&
            this.allowedImgTypes.includes(this.partnerPanDocFile.type)
          ) {
            if (this.partnerPanDocFile.size < this.maxImgSize) {
              this.confirmUpload(
                this.partnerPanDocFile,
                verifyDocSelectedStepValue
              );
            } else {
              this.toastr.showWarning('File size must be less than 4MB', '');
              this.partnerPanDocFile = null;
            }
          } else {
            this.toastr.showError('File type not supported', '');
            this.partnerPanDocFile = null;
          }
        }
      } else {
        this.toastr.showInfo('Please enter Fullname, Mobile number and Email id before uploading Pan', '');
      }
    } else if (verifyDocSelectedStepValue === verifyDocType.AADHAR_CARD_FRONT) {
      if (files[0] && files.length > 0) {
        this.aadharFrontDocFile = files[0];
        if (
          this.aadharFrontDocFile &&
          this.allowedImgTypes.includes(this.aadharFrontDocFile.type)
        ) {
          if (this.aadharFrontDocFile.size < this.maxImgSize) {
            this.confirmUpload(
              this.aadharFrontDocFile,
              verifyDocSelectedStepValue
            );
          } else {
            this.toastr.showWarning('File size must be less than 4MB', '');
            this.aadharFrontDocFile = null;
          }
        } else {
          this.toastr.showError('File type not supported', '');
          this.aadharFrontDocFile = null;
        }
      }
    } else if (verifyDocSelectedStepValue === verifyDocType.AADHAR_CARD_BACK) {
      if (files[0] && files.length > 0) {
        this.aadharBackDocFile = files[0];
        if (
          this.aadharBackDocFile &&
          this.allowedImgTypes.includes(this.aadharBackDocFile.type)
        ) {
          if (this.aadharBackDocFile.size < this.maxImgSize) {
            this.confirmUpload(
              this.aadharBackDocFile,
              verifyDocSelectedStepValue
            );
          } else {
            this.toastr.showWarning('File size must be less than 4MB', '');
            this.aadharBackDocFile = null;
          }
        } else {
          this.toastr.showError('File type not supported', '');
          this.aadharBackDocFile = null;
        }
      }
    } else if (verifyDocSelectedStepValue === verifyDocType.PASSPORT_FRONT) {
      if (files[0] && files.length > 0) {
        this.passportFrontDocFile = files[0];
        if (
          this.passportFrontDocFile &&
          this.allowedImgTypes.includes(this.passportFrontDocFile.type)
        ) {
          if (this.passportFrontDocFile.size < this.maxImgSize) {
            this.confirmUpload(
              this.passportFrontDocFile,
              verifyDocSelectedStepValue
            );
          } else {
            this.toastr.showWarning('File size must be less than 4MB', '');
            this.passportFrontDocFile = null;
          }
        } else {
          this.toastr.showError('File type not supported', '');
          this.passportFrontDocFile = null;
        }
      }
    } else if (verifyDocSelectedStepValue === verifyDocType.PASSPORT_BACK) {
      if (files[0] && files.length > 0) {
        this.passportBackDocFile = files[0];
        if (
          this.passportBackDocFile &&
          this.allowedImgTypes.includes(this.passportBackDocFile.type)
        ) {
          if (this.passportBackDocFile.size < this.maxImgSize) {
            this.confirmUpload(
              this.passportBackDocFile,
              verifyDocSelectedStepValue
            );
          } else {
            this.toastr.showWarning('File size must be less than 4MB', '');
            this.passportBackDocFile = null;
          }
        } else {
          this.toastr.showError('File type not supported', '');
          this.passportBackDocFile = null;
        }
      }
    } else if (verifyDocSelectedStepValue === verifyDocType.DRIVING_LICENSE) {
      if (files[0] && files.length > 0) {
        this.drivingLicDocFile = files[0];
        if (
          this.drivingLicDocFile &&
          this.allowedImgTypes.includes(this.drivingLicDocFile.type)
        ) {
          if (this.drivingLicDocFile.size < this.maxImgSize) {
            this.confirmUpload(
              this.drivingLicDocFile,
              verifyDocSelectedStepValue
            );
          } else {
            this.toastr.showWarning('File size must be less than 4MB', '');
            this.drivingLicDocFile = null;
          }
        } else {
          this.toastr.showError('File type not supported', '');
          this.drivingLicDocFile = null;
        }
      }
    } else if (verifyDocSelectedStepValue === verifyDocType.VOTER_ID) {
      if (files[0] && files.length > 0) {
        this.voterIdDocFile = files[0];
        if (
          this.voterIdDocFile &&
          this.allowedImgTypes.includes(this.voterIdDocFile.type)
        ) {
          if (this.voterIdDocFile.size < this.maxImgSize) {
            this.confirmUpload(this.voterIdDocFile, verifyDocSelectedStepValue);
          } else {
            this.toastr.showWarning('File size must be less than 4MB', '');
            this.voterIdDocFile = null;
          }
        } else {
          this.toastr.showError('File type not supported', '');
          this.voterIdDocFile = null;
        }
      }
    } else {
      //unknow verify_doc_type
    }
  }

  // * Button click-----------------------------------------------------------
  onVerifyDocFileSelected(event: any, verifyDocSelectedStepValue: any) {
    // console.log('on file selected');
    if (verifyDocSelectedStepValue === verifyDocType.BUSINESS_PAN) {
      this.panDocFile = event.target.files[0];
      if (
        this.panDocFile &&
        this.allowedImgTypes.includes(this.panDocFile.type)
      ) {
        if (this.panDocFile.size <= this.maxImgSize) {
          this.confirmUpload(this.panDocFile, verifyDocSelectedStepValue);
        } else {
          this.toastr.showWarning('File size must be less than 4MB', '');
          this.panDocFile = null;
        }
      } else {
        this.toastr.showError('File type not supported', '');
        this.panDocFile = null;
      }
    }
    else if (verifyDocSelectedStepValue === verifyDocType.REGISTRATION_CERTIFICATE) {
      this.regCertificationFile = event.target.files[0];
      if (
        this.regCertificationFile &&
        this.allowedImgTypes.includes(this.regCertificationFile.type)
      ) {
        if (this.regCertificationFile.size <= this.maxImgSize) {
          this.confirmUpload(
            this.regCertificationFile,
            verifyDocSelectedStepValue
          );
        } else {
          this.toastr.showWarning('File size must be less than 4MB', '');
          this.regCertificationFile = null;
        }
      } else {
        this.toastr.showError('File type not supported', '');
        this.regCertificationFile = null;
      }
    }
    else if (verifyDocSelectedStepValue === verifyDocType.PARTNER_PAN) {
      if (
        this.partnerKycForm.get('person_name')?.value &&
        this.partnerKycForm.get('mobile_number')?.value &&
        this.partnerKycForm.get('email_id')?.value
      ) {
        this.partnerFullName = this.partnerKycForm.get('person_name')?.value;
        this.partnerMobileNumber =
          this.partnerKycForm.get('mobile_number')?.value;
        this.partnerEmailId = this.partnerKycForm.get('email_id')?.value;

        this.partnerPanDocFile = event.target.files[0];
        if (
          this.partnerPanDocFile &&
          this.allowedImgTypes.includes(this.partnerPanDocFile.type)
        ) {
          if (this.partnerPanDocFile.size <= this.maxImgSize) {
            this.confirmUpload(
              this.partnerPanDocFile,
              verifyDocSelectedStepValue
            );
          } else {
            this.toastr.showWarning('File size must be less than 4MB', '');
            this.partnerPanDocFile = null;
          }
        } else {
          this.toastr.showError('File type not supported', '');
          this.partnerPanDocFile = null;
        }
      } else {
        this.toastr.showInfo('Please enter Fullname, Mobile number and Email id before uploading Pan', '');
      }
    }
    else if (verifyDocSelectedStepValue === verifyDocType.AADHAR_CARD_FRONT) {
      this.aadharFrontDocFile = event.target.files[0];
      if (
        this.aadharFrontDocFile &&
        this.allowedImgTypes.includes(this.aadharFrontDocFile.type)
      ) {
        if (this.aadharFrontDocFile.size <= this.maxImgSize) {
          this.confirmUpload(
            this.aadharFrontDocFile,
            verifyDocSelectedStepValue
          );
        } else {
          this.toastr.showWarning('File size must be less than 4MB', '');
          this.aadharFrontDocFile = null;
        }
      } else {
        this.toastr.showError('File type not supported', '');
        this.aadharFrontDocFile = null;
      }
    }
    else if (verifyDocSelectedStepValue === verifyDocType.AADHAR_CARD_BACK) {
      this.aadharBackDocFile = event.target.files[0];
      if (
        this.aadharBackDocFile &&
        this.allowedImgTypes.includes(this.aadharBackDocFile.type)
      ) {
        if (this.aadharBackDocFile.size <= this.maxImgSize) {
          this.confirmUpload(
            this.aadharBackDocFile,
            verifyDocSelectedStepValue
          );
        } else {
          this.toastr.showWarning('File size must be less than 4MB', '');
          this.aadharBackDocFile = null;
        }
      } else {
        this.toastr.showError('File type not supported', '');
        this.aadharBackDocFile = null;
      }
    }
    else if (verifyDocSelectedStepValue === verifyDocType.PASSPORT_FRONT) {
      this.passportFrontDocFile = event.target.files[0];
      if (
        this.passportFrontDocFile &&
        this.allowedImgTypes.includes(this.passportFrontDocFile.type)
      ) {
        if (this.passportFrontDocFile.size <= this.maxImgSize) {
          this.confirmUpload(
            this.passportFrontDocFile,
            verifyDocSelectedStepValue
          );
        } else {
          this.toastr.showWarning('File size must be less than 4MB', '');
          this.passportFrontDocFile = null;
        }
      } else {
        this.toastr.showError('File type not supported', '');
        this.passportFrontDocFile = null;
      }
    }
    else if (verifyDocSelectedStepValue === verifyDocType.PASSPORT_BACK) {
      this.passportBackDocFile = event.target.files[0];
      if (
        this.passportBackDocFile &&
        this.allowedImgTypes.includes(this.passportBackDocFile.type)
      ) {
        if (this.passportBackDocFile.size <= this.maxImgSize) {
          this.confirmUpload(
            this.passportBackDocFile,
            verifyDocSelectedStepValue
          );
        } else {
          this.toastr.showWarning('File size must be less than 4MB', '');
          this.passportBackDocFile = null;
        }
      } else {
        this.toastr.showError('File type not supported', '');
        this.passportBackDocFile = null;
      }
    }
    else if (verifyDocSelectedStepValue === verifyDocType.DRIVING_LICENSE) {
      this.drivingLicDocFile = event.target.files[0];
      if (this.drivingLicDocFile && this.allowedImgTypes.includes(this.drivingLicDocFile.type)) {
        if (this.drivingLicDocFile.size <= this.maxImgSize) {
          this.confirmUpload(
            this.drivingLicDocFile,
            verifyDocSelectedStepValue
          );
        } else {
          this.toastr.showWarning('File size must be less than 4MB', '');
          this.drivingLicDocFile = null;
        }
      }
      else {
        this.toastr.showError('File type not supported', '');
        this.drivingLicDocFile = null;
      }
    }
    else if (verifyDocSelectedStepValue === verifyDocType.VOTER_ID) {
      this.voterIdDocFile = event.target.files[0];
      if (
        this.voterIdDocFile &&
        this.allowedImgTypes.includes(this.voterIdDocFile.type)
      ) {
        if (this.voterIdDocFile.size <= this.maxImgSize) {
          this.confirmUpload(this.voterIdDocFile, verifyDocSelectedStepValue);
        } else {
          this.toastr.showWarning('File size must be less than 4MB', '');
          this.voterIdDocFile = null;
        }
      } else {
        this.toastr.showError('File type not supported', '');
        this.voterIdDocFile = null;
      }
    }
    else {
      //unknow verify_doc_type
    }
  }

  // TODO ----------------------------------------------------------------------------------------------------

  async confirmUpload(file: File, verifyDocSelectedStepValue: any) {

    const modalRef = this.modalService.open(CustomConfirmModalComponent, { centered: true, backdropClass: 'no-zindex', animation: true, backdrop: 'static' });
    modalRef.componentInstance.modalData = { fileName: file?.name, heading: 'Final Confirmation ?', content: 'Are you sure to proceed with these documents. NOTE: Details once submitted will not be changed.' };

    if (verifyDocSelectedStepValue === verifyDocType.BUSINESS_PAN) {
      // if (confirm(`Are you sure to want to upload this file : ${file.name} ?`) && file) {
      //   this.callUploadFileApi(file, verifyDocSelectedStepValue);
      // }
      // else {
      //   this.panDocFile = null;
      // }

      if (await modalRef.result) {
        this.callUploadFileApi(file, verifyDocSelectedStepValue);
      }
      else {
        this.panDocFile = null;
      }
    }
    else if (verifyDocSelectedStepValue === verifyDocType.REGISTRATION_CERTIFICATE) {
      // if (confirm(`Are you sure to want to upload this file : ${file.name} ?`) && file
      // ) {
      //   this.callUploadFileApi(file, verifyDocSelectedStepValue);
      // } else {
      //   this.regCertificationFile = null;
      // }
      if (await modalRef.result) {
        this.callUploadFileApi(file, verifyDocSelectedStepValue);
      }
      else {
        this.regCertificationFile = null;
      }
    }
    else if (verifyDocSelectedStepValue === verifyDocType.PARTNER_PAN) {
      // if (
      //   confirm(`Are you sure to want to upload this file : ${file.name} ?`) &&
      //   file
      // ) {
      //   this.callUploadFileApi(file, verifyDocSelectedStepValue);
      // } else {
      //   this.partnerPanDocFile = null;
      // }
      if (await modalRef.result) {
        this.callUploadFileApi(file, verifyDocSelectedStepValue);
      }
      else {
        this.partnerPanDocFile = null;
      }
    }
    else if (verifyDocSelectedStepValue === verifyDocType.AADHAR_CARD_FRONT) {
      // if (
      //   confirm(`Are you sure to want to upload this file : ${file.name} ?`) &&
      //   file
      // ) {
      //   this.callUploadFileApi(file, verifyDocSelectedStepValue);
      // } else {
      //   this.aadharFrontDocFile = null;
      // }
      if (await modalRef.result) {
        this.callUploadFileApi(file, verifyDocSelectedStepValue);
      }
      else {
        this.aadharFrontDocFile = null;
      }
    }
    else if (verifyDocSelectedStepValue === verifyDocType.AADHAR_CARD_BACK) {
      // if (
      //   confirm(`Are you sure to want to upload this file : ${file.name} ?`) &&
      //   file
      // ) {
      //   this.callUploadFileApi(file, verifyDocSelectedStepValue);
      // } else {
      //   this.aadharBackDocFile = null;
      // }
      if (await modalRef.result) {
        this.callUploadFileApi(file, verifyDocSelectedStepValue);
      }
      else {
        this.aadharBackDocFile = null;
      }
    }
    else if (verifyDocSelectedStepValue === verifyDocType.PASSPORT_FRONT) {
      // if (
      //   confirm(`Are you sure to want to upload this file : ${file.name} ?`) &&
      //   file
      // ) {
      //   this.callUploadFileApi(file, verifyDocSelectedStepValue);
      // } else {
      //   this.passportFrontDocFile = null;
      // }
      if (await modalRef.result) {
        this.callUploadFileApi(file, verifyDocSelectedStepValue);
      }
      else {
        this.passportFrontDocFile = null;
      }
    }
    else if (verifyDocSelectedStepValue === verifyDocType.PASSPORT_BACK) {
      // if (
      //   confirm(`Are you sure to want to upload this file : ${file.name} ?`) &&
      //   file
      // ) {
      //   this.callUploadFileApi(file, verifyDocSelectedStepValue);
      // } else {
      //   this.passportBackDocFile = null;
      // }
      if (await modalRef.result) {
        this.callUploadFileApi(file, verifyDocSelectedStepValue);
      }
      else {
        this.passportBackDocFile = null;
      }
    }
    else if (verifyDocSelectedStepValue === verifyDocType.DRIVING_LICENSE) {
      // if (
      //   confirm(`Are you sure to want to upload this file : ${file.name} ?`) &&
      //   file
      // ) {
      //   this.callUploadFileApi(file, verifyDocSelectedStepValue);
      // } else {
      //   this.drivingLicDocFile = null;
      // }
      if (await modalRef.result) {
        this.callUploadFileApi(file, verifyDocSelectedStepValue);
      }
      else {
        this.drivingLicDocFile = null;
      }
    }
    else if (verifyDocSelectedStepValue === verifyDocType.VOTER_ID) {
      // if (
      //   confirm(`Are you sure to want to upload this file : ${file.name} ?`) &&
      //   file
      // ) {
      //   this.callUploadFileApi(file, verifyDocSelectedStepValue);
      // } else {
      //   this.voterIdDocFile = null;
      // }
      if (await modalRef.result) {
        this.callUploadFileApi(file, verifyDocSelectedStepValue);
      }
      else {
        this.voterIdDocFile = null;
      }
    }
    else {
      //unknow verify_doc_type
    }
  }

  // ! important ---------------------------------------------------------------------------------------
  // ? Logic : first call file-upload(common for all docs) -> then on clicking Save & Next btn : call pan-ocr -> call pan-verify
  // ! important ----------------------------------------------------------------------------------------
  // * if u want to delete old file then just pass url of that file in old_file while uploading new

  // TODO--------- for uploading all types of doc --incomplete-----------------------------------

  callUploadFileApi(
    file: File,
    verifyDocSelectedStepValue: any,
    oldFileUrl: any = null
  ) {
    const formData1 = new FormData();
    formData1.append('file', file);
    if (oldFileUrl) {
      formData1.append('old_file', oldFileUrl);
    }

    // get file url(upload-file)
    this.auth.postdata(formData1, config.UserKyc.uploadDocument.uploadFile.url).subscribe({
      next: (res) => {
        if (res?.status && res?.fileurl) {
          if (verifyDocSelectedStepValue == verifyDocType.BUSINESS_PAN) {
            // console.log('pan-upload');
            // console.log(res);
            this.panDocFileUrl = res?.fileurl;
            // call this.callPanOcrApi(res?.fileurl); on Save&Next btn click
          }
          else if (
            verifyDocSelectedStepValue == verifyDocType.REGISTRATION_CERTIFICATE
          ) {
            // console.log('gst-upload');
            // console.log(res);
            this.regCertificationFileUrl = res?.fileurl;
            // call regCerificateOcr on Save&Next btn click
          } else if (
            verifyDocSelectedStepValue == verifyDocType.PARTNER_PAN
          ) {
            //need to call callPartnerPanOcrApi()fn directly
            // console.log('partner-pan-upload');
            // console.log(res);
            this.partnerPanDocFileUrl = res?.fileurl;
            this.callPartnerPanOcrApi(res?.fileurl, 'PAN');
          } else if (
            verifyDocSelectedStepValue == verifyDocType.AADHAR_CARD_FRONT
          ) {
            // console.log('aadhar-front-upload');
            // console.log(res);
            this.aadharFrontDocFileUrl = res?.fileurl;
            if (this.aadharBackDocFileUrl && this.aadharFrontDocFileUrl) {
              // call api for aadhar-store
              this.callAadharStoreApi(
                this.partnerId,
                this.aadharFrontDocFileUrl,
                this.aadharBackDocFileUrl
              );
            } else {
              this.toastr.showInfo('Please upload the other side', '');
            }
          } else if (
            verifyDocSelectedStepValue == verifyDocType.AADHAR_CARD_BACK
          ) {
            // console.log('aadhar-back-upload');
            // console.log(res);
            this.aadharBackDocFileUrl = res?.fileurl;
            if (this.aadharBackDocFileUrl && this.aadharFrontDocFileUrl) {
              // call api for aadhar-store
              this.callAadharStoreApi(
                this.partnerId,
                this.aadharFrontDocFileUrl,
                this.aadharBackDocFileUrl
              );
            } else {
              this.toastr.showInfo('Please upload the other side', '');
            }
          } else if (
            verifyDocSelectedStepValue == verifyDocType.PASSPORT_FRONT
          ) {
            // console.log('passport-front-upload');
            // console.log(res);
            this.passportFrontDocFileUrl = res?.fileurl;
            // call partner-pan-ocr-passport(front)
            this.callPartnerPanOcrPassportApi(
              this.partnerId,
              this.passportFrontDocFile,
              'F'
            );
          } else if (
            verifyDocSelectedStepValue == verifyDocType.PASSPORT_BACK
          ) {
            // console.log('passport-back-upload');
            // console.log(res);
            this.passportBackDocFileUrl = res?.fileurl;
            // call partner-pan-ocr-passport(back)
            this.callPartnerPanOcrPassportApi(
              this.partnerId,
              this.passportBackDocFileUrl,
              'B'
            );
          } else if (
            verifyDocSelectedStepValue == verifyDocType.DRIVING_LICENSE
          ) {
            // console.log('dl-upload');
            // console.log(res);
            this.drivingLicDocFileUrl = res?.fileurl;
            //call partner-pan-ocr-dl
            this.callPartnerPanOcrDlApi(
              this.partnerId,
              this.drivingLicDocFileUrl
            );
          } else if (verifyDocSelectedStepValue == verifyDocType.VOTER_ID) {
            // console.log('voter-id-upload');
            // console.log(res);
            this.voterIdDocFileUrl = res?.fileurl;
            //call partner-pan-ocr-voterid
            this.callPartnerPanOcrVoterid(
              this.partnerId,
              this.voterIdDocFileUrl
            );
          }
          else {
            //unknow verify_doc_type
          }
        } else {
          //TODO implement error
        }
      },
    });
  }

  // TODO--------- for uploading all types of doc --incomplete-----------------------------------

  // kyc_step = 3
  callPanOcrApi(panFileUrl: any) {
    const formData2 = new FormData();
    formData2.append('fileurl', panFileUrl);
    this.auth
      .postdata(
        formData2,
        config.UserKyc.uploadDocument.incorporatepanDetail.url
      )
      .subscribe({
        next: (res2) => {
          // console.log('pan-ocr');
          // console.log(res2);
          if (res2?.call_api_verify && res2?.status && !res2?.reupload) {
            //right-now pan-verify-api is not calling. ie: upto pan-ocr only
            this.callPanVerfyApi(res2?.data?.pan_number);
          } else if (
            !res2?.call_api_verify &&
            res2?.status &&
            !res2?.reupload
          ) {
            this.toastr.showSuccess(res2?.message, '');
            this.patchVerifyDocDataFromApis();
            this.selectedkycStep = res2?.kyc_step;
            this.selectedServiceVerifyDoc.emit(res2?.kyc_step);
          } else {
            this.toastr.showError(res2?.message, '');
            this.panDocFile = null;
            this.panDocFileUrl = null;
          }
        },
      });
  }

  //* not calling this as of now. for dev purpose
  callPanVerfyApi(panNumber: any) {
    const formData3 = new FormData();
    formData3.append('pan_number', panNumber);
    this.auth
      .postdata(formData3, config.UserKyc.uploadDocument.panVerify.url)
      .subscribe({
        next: (res3) => {
          // console.log('pan-verify');
          // console.log(res3);
          if (res3?.statuscode == 200 && res3?.status) {
            this.patchVerifyDocDataFromApis();
            this.selectedkycStep = res3?.kyc_step;
            this.selectedServiceVerifyDoc.emit(res3?.kyc_step);
            this.toastr.showSuccess(res3?.message, '');
          }
          else {
            this.panDocFile = null;
            this.panDocFileUrl = null;
            this.toastr.showError(res3?.message, '');
          }
        },
      });
  }

  // kyc_step = 5
  callGstOcrApi(gstFileUrl: any) {
    const formData2 = new FormData();
    formData2.append('fileurl', gstFileUrl);
    this.auth
      .postdata(formData2, config.UserKyc.uploadDocument.gstDetail.url)
      .subscribe({
        next: (res2) => {
          // console.log('gst-ocr');
          // console.log(res2);
          if (res2?.call_api_verify && res2?.status && !res2?.reupload) {
            // call gstGstVerifyApi()
            // as of now----
            this.selectedkycStep = res2?.kyc_step;
            this.selectedServiceVerifyDoc.emit(res2?.kyc_step);
            this.patchVerifyDocDataFromApis();
          } else if (
            !res2?.call_api_verify &&
            res2?.status &&
            !res2?.reupload
          ) {
            this.toastr.showSuccess(res2?.message, '');
            this.selectedkycStep = res2?.kyc_step;
            this.selectedServiceVerifyDoc.emit(res2?.kyc_step);
            this.patchVerifyDocDataFromApis();
          } else {
            this.toastr.showError(res2?.message, '');
            this.regCertificationFile = null;
            this.regCertificationFileUrl = null;
          }
        },
      });
  }

  // kyc_step = 8
  callPartnerPanOcrApi(
    partnerPanFileUrlArg: any,
    type: string,
    subType: any = null
  ) {
    const formData2 = new FormData();
    formData2.append('fileurl', partnerPanFileUrlArg);
    formData2.append('full_name', this.partnerFullName);
    formData2.append('email', this.partnerEmailId);
    formData2.append('mobile', this.partnerMobileNumber);
    formData2.append('type', type);
    if (this.partnerId) {
      formData2.append('id', this.partnerId);
    }
    if (subType) {
      formData2.append('subtype', subType);
    }

    this.auth
      .postdata(formData2, config.UserKyc.uploadDocument.partnerPanOcr.url)
      .subscribe({
        next: (res2) => {
          // console.log('partner-pan-ocr');
          // console.log(res2);
          // complete-TRUE response
          if (res2?.call_api_verify && res2?.status && !res2?.reupload) {
            this.toastr.showSuccess(res2?.message, '');
            // need to call partner-pan-verify when backend gives
            this.patchVerifyDocDataFromApis();
          }
          // mock-TRUE response
          else if (!res2?.call_api_verify && res2?.status && !res2?.reupload) {
            this.toastr.showSuccess(res2?.message, '');
            //msg: Document submitted successfully and pending under admin approval
            this.patchVerifyDocDataFromApis();
          }
          // FALSE response - reupload needed
          else if (!res2?.call_api_verify && res2?.status && res2?.reupload) {
            this.toastr.showError(res2?.message, '');
            this.partnerId = res2?.id;
            this.partnerPanDocFile = null;
            this.partnerPanDocFileUrl = null;
          } else {
            this.toastr.showError(res2?.message, '');
            this.partnerId = res2?.id;
            this.partnerPanDocFile = null;
            this.partnerPanDocFileUrl = null;
            // TODO implement error
          }
        },
      });
  }

  callAadharStoreApi(partnerId: any, fileFrontUrl: any, fileBackUrl: any) {
    const formData2 = new FormData();
    formData2.append('id', partnerId);
    formData2.append('fileurlf', fileFrontUrl);
    formData2.append('fileurlb', fileBackUrl);
    formData2.append('type', 'AADHAR');

    this.auth
      .postdata(formData2, config.UserKyc.uploadDocument.aadhar_store.url)
      .subscribe({
        next: (res2) => {
          // console.log('aadhar-store');
          // console.log(res2);
          if (
            res2?.statuscode == 200 &&
            res2?.status &&
            this.aadharFrontDocFile &&
            this.aadharBackDocFile
          ) {
            //call aadhar ocr api
            this.callAadharOcrApi(
              partnerId,
              fileFrontUrl,
              fileBackUrl,
              this.aadharFrontDocFile,
              this.aadharBackDocFile
            );
          }
        },
      });
  }

  callAadharOcrApi(partnerId: any, fileFrontUrl: any, fileBackUrl: any, fileFront: any, fileBack: any) {
    const formData2 = new FormData();
    formData2.append('id', partnerId);
    formData2.append('fileurlf', fileFrontUrl);
    formData2.append('fileurlb', fileBackUrl);
    formData2.append('type', 'AADHAR');
    formData2.append('file', fileFront);
    formData2.append('fileb', fileBack);

    this.auth.postdata(formData2, config.UserKyc.uploadDocument.aadhar_ocr.url).subscribe({
      next: (res2) => {
        // console.log('aadhar-ocr');
        // console.log(res2);
        // complete-TRUE response
        if (res2?.call_api_verify && res2?.status && !res2?.reupload) {
          this.toastr.showSuccess(res2?.message, '');
          // need to call verify-api when backend gives
          this.selectedkycStep = res2?.kyc_step;
          this.selectedServiceVerifyDoc.emit(res2?.kyc_step);
          this.patchVerifyDocDataFromApis();
        }
        // mock-TRUE response
        else if (!res2?.call_api_verify && !res2?.status && !res2?.reupload) {
          this.toastr.showSuccess(res2?.message, '');
          //msg: Document submitted successfully and pending under admin approval
          this.selectedkycStep = res2?.kyc_step;
          this.selectedServiceVerifyDoc.emit(res2?.kyc_step);
          this.patchVerifyDocDataFromApis();
        }
        // FALSE response: "Document is not appropriate" - reupload needed
        else {
          this.toastr.showError(res2?.message, '');
          this.aadharBackDocFile = null;
          this.aadharBackDocFileUrl = null;
          this.aadharFrontDocFile = null;
          this.aadharFrontDocFileUrl = null;
          // TODO implement error
        }
      },
    });
  }

  callPartnerPanOcrPassportApi(partnerId: any, fileDocUrl: any, subType: any) {
    const formData2 = new FormData();
    formData2.append('id', partnerId);
    formData2.append('fileurl', fileDocUrl);
    formData2.append('full_name', this.partnerFullName);
    formData2.append('type', 'PASSPORT');
    formData2.append('subtype', subType);

    this.auth.postdata(formData2, config.UserKyc.uploadDocument.partnerPanOcr.url).subscribe({
      next: (res2) => {
        if (subType == 'F') {
          if (res2?.status && !res2?.reupload && !res2?.call_api_verify) {
            this.toastr.showSuccess(res2?.message, '');
            this.partnerFullName = res2?.data?.full_name;
            this.partnerPassportNumber = res2?.data?.passport_num;
            this.partnerDob = res2?.data?.dob;
          } else {
            if (res2?.message) {
              this.toastr.showSuccess(res2?.message, '');
            }
            this.passportFrontDocFile = null;
            this.passportFrontDocFileUrl = null;
          }
        } else {
          if (res2?.status && !res2?.reupload && res2?.call_api_verify) {
            this.partnerFatherName = res2?.data?.father_name;
            this.partnerPassportFileNumber = res2?.data?.file_num;
            this.partnerAddressB = res2?.data?.address_b;
            //call passport-pp -api
            this.callPassportPpApi(
              this.partnerPassportFileNumber,
              this.partnerDob,
              this.partnerPassportNumber
            );
          } else {
            if (res2?.message) {
              this.toastr.showError(res2?.message, '');
            }
            this.passportBackDocFile = null;
            this.passportBackDocFileUrl = null;
          }
        }
      },
    });
  }

  callPassportPpApi(fileNumber: any, dob: any, passportNumber: any) {
    if (this.passportFrontDocFileUrl && this.passportBackDocFileUrl) {
      const formData3 = new FormData();
      formData3.append('id', this.partnerId);
      formData3.append('fileurl', this.passportFrontDocFileUrl);
      formData3.append('fileburl', this.passportBackDocFileUrl);
      formData3.append('file_number', fileNumber);
      formData3.append('dob', dob);
      formData3.append('passportno', passportNumber);
      formData3.append('fullname', this.partnerFullName);
      formData3.append('type', 'PASSPORT');

      this.auth
        .postdata(formData3, config.UserKyc.uploadDocument.ppverify.url)
        .subscribe({
          next: (res3) => {
            // console.log(res3);
            if (res3?.status && !res3?.reupload) {
              this.toastr.showSuccess(res3?.message, '');
              this.patchVerifyDocDataFromApis();
              this.selectedkycStep = res3?.kyc_step;
              this.selectedServiceVerifyDoc.emit(res3?.kyc_step);
            } else {
              if (res3?.message) {
                this.toastr.showError(res3?.message, '');
              }
              this.passportBackDocFile = null;
              this.passportBackDocFileUrl = null;
              this.passportFrontDocFile = null;
              this.passportFrontDocFileUrl = null;
            }
          },
        });
    }
  }

  callPartnerPanOcrDlApi(partnerId: any, fileDocUrl: any) {
    if (this.drivingLicDocFile) {
      const formData2 = new FormData();
      formData2.append('id', partnerId);
      formData2.append('fileurl', fileDocUrl);
      formData2.append('full_name', this.partnerFullName);
      formData2.append('type', 'LICENCE');
      formData2.append('file', this.drivingLicDocFile);

      this.auth
        .postdata(formData2, config.UserKyc.uploadDocument.partnerPanOcr.url)
        .subscribe({
          next: (res2) => {
            if (res2?.status && !res2?.reupload && res2?.call_api_verify) {
              this.partnerDlNumber = res2?.data?.dlnumber;
              this.partnerDob = res2?.data?.dob;
              // call partner-dl api
              this.callPartnerDlApi();
            } else {
              if (res2?.message) {
                this.toastr.showSuccess(res2?.message, '');
              }
              this.drivingLicDocFile = null;
              this.drivingLicDocFileUrl = null;
            }
          },
        });
    }
  }

  callPartnerDlApi() {
    const formData3 = new FormData();
    formData3.append('id', this.partnerId);
    formData3.append('dlnumber', this.partnerDlNumber);
    formData3.append('dob', this.partnerDob);
    formData3.append('type', 'LICENCE');
    formData3.append('fullname', this.partnerFullName);

    this.auth
      .postdata(formData3, config.UserKyc.uploadDocument.dlverify.url)
      .subscribe({
        next: (res3) => {
          if (res3?.status && !res3?.reupload) {
            this.toastr.showSuccess(res3?.message, '');
            this.patchVerifyDocDataFromApis();
            this.selectedkycStep = res3?.kyc_step;
            this.selectedServiceVerifyDoc.emit(res3?.kyc_step);
          } else {
            if (res3?.message) {
              this.toastr.showSuccess(res3?.message, '');
            }
            this.drivingLicDocFile = null;
            this.drivingLicDocFileUrl = null;
          }
        },
      });
  }

  callPartnerPanOcrVoterid(partnerId: any, fileDocUrl: any) {
    if (this.voterIdDocFile) {
      const formData2 = new FormData();
      formData2.append('id', partnerId);
      formData2.append('fileurl', fileDocUrl);
      formData2.append('full_name', this.partnerFullName);
      formData2.append('type', 'VOTERID');
      formData2.append('file', this.voterIdDocFile);

      this.auth
        .postdata(formData2, config.UserKyc.uploadDocument.partnerPanOcr.url)
        .subscribe({
          next: (res2) => {
            if (res2?.status && !res2?.reupload) {
              this.toastr.showSuccess(res2?.message, '');
              this.patchVerifyDocDataFromApis();
              this.selectedkycStep = res2?.kyc_step;
              this.selectedServiceVerifyDoc.emit(res2?.kyc_step);
            } else {
              if (res2?.message) {
                this.toastr.showSuccess(res2?.message, '');
              }
              this.voterIdDocFile = null;
              this.voterIdDocFileUrl = null;
            }
          },
        });
    }
  }

  disabledFieldAfterPatching() {
    if (this.partnerKycForm.get('person_name')?.value) {
      this.partnerKycForm.get('person_name')?.disable();
    }

    if (this.partnerKycForm.get('mobile_number')?.value) {
      this.partnerKycForm.get('mobile_number')?.disable();
    }

    if (this.partnerKycForm.get('email_id')?.value) {
      this.partnerKycForm.get('email_id')?.disable();
    }

    if (this.partnerKycForm.get('address_proof')?.value) {
      this.partnerKycForm.get('address_proof')?.disable();
    }
  }

  async callFinalStepApi() {
    // if (confirm(`Are you sure to Submit the kyc details`)) {
    //   this.auth.postHeaderwithoutpayload(config.UserKyc.finalKycUpdate.url).subscribe({
    //     next: (res) => {
    //       if (res?.status) {
    //         this.selectedkycStep = res?.kyc_step;
    //         this.selectedServiceVerifyDoc.emit(res?.kyc_step);
    //         alert(res?.message);
    //       }
    //     }
    //   })
    // } else {
    // }

    const modalRef = this.modalService.open(CustomConfirmModalComponent, { centered: true, backdropClass: 'no-zindex', animation: true, backdrop: 'static' });
    modalRef.componentInstance.modalData = { heading: 'Final Confirmation ?', content: 'Are you sure to proceed with these documents. NOTE: Details once submitted will not be changed.' };

    if (await modalRef.result) {
      this.auth.postHeaderwithoutpayload(config.UserKyc.finalKycUpdate.url).subscribe({
        next: (res) => {
          if (res?.status) {
            this.selectedkycStep = res?.kyc_step;
            this.selectedServiceVerifyDoc.emit(res?.kyc_step);
            this.toastr.showSuccess(res?.message, '');
          }
        }
      })
    }
    else {
      this.voterIdDocFile = null;
    }

  }


  // TODO---incase of rejection of alreday uploaded file

  patchVerifyDocDataFromApis() {
    this.auth
      .postHeaderwithoutpayload(config.UserKyc.adminKycDetail.url)
      .subscribe({
        next: (res) => {
          if (res?.statuscode == 200 && res?.status) {
            //patching Business_PAN
            if (res?.kyc_list?.kycpan) {

              if (res?.kyc_list?.kycpan?.status == 0 || res?.kyc_list?.kycpan?.status == 4) {
                this.panDocFile = null;
                this.panDocFileUrl = null;
                this.businessPanImgPath = null;
              }
              else {
                this.businessPanImgPath = res?.kyc_list?.kycpan?.pan_path;
              }

            }

            if (res?.kyc_list?.kycgst) {
              if (res?.kyc_list?.kycgst?.status == 0 || res?.kyc_list?.kycgst?.status == 4) {
                this.regCertificationFile = null;
                this.regCertificationFileUrl = null;
                this.regCertificateImgPath = null;
              }
              else {
                this.regCertificateImgPath = res?.kyc_list?.kycgst?.gst_path;
              }
            }

            if (res?.kyc_list?.kycpartnership[0]) {
              this.partnerKycForm.patchValue({
                person_name: res?.kyc_list?.kycpartnership[0]?.full_name,
                mobile_number: res?.kyc_list?.kycpartnership[0]?.mobile,
                email_id: res?.kyc_list?.kycpartnership[0]?.email,
                address_proof: res?.kyc_list?.kycpartnership[0]?.type ? res?.kyc_list?.kycpartnership[0]?.type : '',
              });

              this.AddressProofValue = res?.kyc_list?.kycpartnership[0]?.type;
              this.partnerId = res?.kyc_list?.kycpartnership[0]?.id;
              this.partnerFullName = res?.kyc_list?.kycpartnership[0]?.full_name;
              this.partnerMobileNumber = res?.kyc_list?.kycpartnership[0]?.mobile;
              this.partnerEmailId = res?.kyc_list?.kycpartnership[0]?.email;

              if (res?.kyc_list?.kycpartnership[0]?.pstatus == 0 || res?.kyc_list?.kycpartnership[0]?.pstatus == 4) {
                this.partnerPanImgPath = null
              } else {
                this.partnerPanImgPath = res?.kyc_list?.kycpartnership[0]?.pan_path;
              }

              if (res?.kyc_list?.kycpartnership[0]?.ostatus == 0 || res?.kyc_list?.kycpartnership[0]?.ostatus == 4) {
                this.additionalProofFrontImgPath = null;
                this.additionalProofBackImgPath = null;
                this.partnerKycForm.patchValue({
                  address_proof: ''
                });
              } else {
                this.additionalProofFrontImgPath = res?.kyc_list?.kycpartnership[0]?.av_path;
                this.additionalProofBackImgPath = res?.kyc_list?.kycpartnership[0]?.av_bpath;
              }

              this.disabledFieldAfterPatching();
            }
          }
        },
      });
  }

}
