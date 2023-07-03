import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    pathMatch: 'full',
    component: AuthComponent
  },
  {
    path: 'forget-password',
    component: AuthComponent
  },
  {
    path:'sign-up',
    component:AuthComponent
  },
  {
    path: 'otp-verify',
    component: AuthComponent
  },
  {
    path: 'verified-account',
    component: AuthComponent
  },
  {
    path:'signup-success',
    component:AuthComponent
  },
  {
    path: 'change-password',
    component: AuthComponent
  },
  {
    path: 'forget-verify-otp',
    component: AuthComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
