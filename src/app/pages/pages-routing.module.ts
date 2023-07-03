import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { KycComponent } from './kyc/kyc.component';
import { KycModule } from './kyc/kyc.module';

const routes: Routes = [

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'kyc',
    loadChildren: () =>
     import('./kyc/kyc.module').then(
      (m) => m.KycModule
     )
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
