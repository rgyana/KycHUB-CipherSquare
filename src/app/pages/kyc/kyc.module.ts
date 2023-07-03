import { BankDetailComponent } from './bank-detail/bank-detail.component';
import { VerifyDocumentComponent } from './verify-document/verify-document.component';
import { BusinessDetailComponent } from './business-detail/business-detail.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KycRoutingModule } from './kyc-routing.module';
import { KycComponent } from './kyc.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';

@NgModule({
  declarations: [
    KycComponent,
    ContactDetailComponent,
    BusinessDetailComponent,
    VerifyDocumentComponent,
    BankDetailComponent,
  ],
  imports: [
    CommonModule,
    KycRoutingModule,
    SharedModule,
    NgbAccordionModule,
    FormsModule,
    CoreModule
  ],
})
export class KycModule { }
