import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '@shared/shared.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { CoreModule } from '@core/core.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    OverlayModule,
    CoreModule
  ]
})
export class PagesModule { }
