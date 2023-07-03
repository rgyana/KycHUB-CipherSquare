import { Component, OnInit, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { KycService } from '../kyc.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-bank-detail',
  templateUrl: './bank-detail.component.html',
  styleUrls: ['./bank-detail.component.scss']
})
export class BankDetailComponent implements OnInit {

  constructor(
  ) {

  }

  ngOnInit(): void {


  }



}
