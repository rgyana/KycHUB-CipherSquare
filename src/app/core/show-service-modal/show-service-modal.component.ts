import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormControl,
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { StoreService } from '@core/services/store.service';

@Component({
  selector: 'app-show-service-modal',
  templateUrl: './show-service-modal.component.html',
  styleUrls: ['./show-service-modal.component.scss'],
})
export class ShowServiceModalComponent implements OnInit {
  serviceForm: any = UntypedFormGroup;
  // @Input() showService: any = '';

  remarks: any;
  @Input() data: any = [];
  @Output() responseDone = new EventEmitter<boolean>();
  @Output() serviceUpdateData = new EventEmitter<any>();
  indexToEdit: any = null;
  serviceData: any;
  commisonArray: any = [];
  userPAattern = '^[1-9][0-9]?$|^100$';
  userType: any;
  show: Boolean = false;
  remark: any;
  companyCharge: any;
  chargeValue: any;
  percArr: any = [];
  totalPercentage: any;

  constructor(private fb: UntypedFormBuilder, private store: StoreService) {
    // this.serviceForm = this.fb.group({
    //   commision:''
    // })
  }

  ngOnInit(): void {
    console.log('data@@@@@@', this.data);

    this.userType = this.store.get('details');
    console.log(this.userType.userdata.usertype);

    // if (this.userType.userdata.usertype == 4) {
    //   this.show = true
    // }
    // else {
    //   !this.show;
    // }
    //  this.serviceForm = this.fb.group({
    //     commision: ['', [Validators.required, Validators.pattern('^[1-9][0-9]?$|^100$')]],
    //     remarks: ['']
    //   })
  }

  close() {
    this.responseDone.emit();
  }

  toggleStatus(item: any) {
    this.data.service_id.forEach((element: any) => {
      if (item.id == element.id) {
        element.requeststatus = element.requeststatus == 0 ? 1 : 0;
      }
    });
  }

  //checked/unchecked radio button
  getPackVal(itemPack: any, key: string) {
    return itemPack[key];
  }

  get f() {
    return this.serviceForm.controls;
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  Update() {
    this.serviceUpdateData.emit({ param1: this.data.service_id });
  }

  updateData(event: any, element: any) {
    this.calcCommission(event.target.value, element);
    // let e = event;
    // if (e.target.value > 100) {
    //   e.target.value = "";
    //   $("#" + e.target.id).parent(".col-md-2").find("span").text("Please enter valid Commision");
    // } else {
    //   $("#" + e.target.id).parent(".col-md-2").find("span").text("");

    //   let chg = parseFloat($("#chg" + e.target.id).text());
    //   if (isNaN(chg)) {
    //     chg = 0;
    //   }

    //   let pr = e.target.value;
    //   if (isNaN(pr)) {
    //     pr = 0;
    //   }
    //   this.totalPercentage = (pr / 100) * chg
    //   $("#per" + e.target.id).val(this.totalPercentage);

    //   let vl = this.totalPercentage;
    //   if (isNaN(vl)) {
    //     vl = 0;
    //   }
    //   var percent = vl + chg;
    //   $("#cms" + e.target.id).text(percent);

    // }
  }

  calcCommission(event: any, element: any) {
    this.data.service_id.forEach((ele: any) => {
      if (ele.id == element.id) {
        ele.charge = event;
        this.companyCharge = ele.charge;

        // $("#" + ).parent(".col-md-2").find("span").text(this.companyCharge);
        console.log('this.companyCharge', this.companyCharge);
      }
    });
  }
}
