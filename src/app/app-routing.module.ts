import { KycComponent } from './pages/kyc/kyc.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateRouteGuard } from '@core/guards/can-activate-route.guard';
import { LogGuard } from '@core/guards/log.guard';
import { CommonComponent } from './common/common.component';
import { CommonSdkComponent } from './common-sdk/common-sdk.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    // canActivate: [LogGuard],
    loadChildren: () =>
      import('./pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'kyc',
    component: KycComponent,
    // canActivate: [CanActivateRouteGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [CanActivateRouteGuard, LogGuard],
  exports: [RouterModule],
})
export class AppRoutingModule {}
