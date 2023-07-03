import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { KycComponent } from './kyc.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'kyc',
    component: KycComponent,
  },
  {
    path: 'contact-info',
    component: ContactDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KycRoutingModule { }
