import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  DatePipe,
  HashLocationStrategy,
  LocationStrategy,
} from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHeaderInterceptor } from '@core/interceptors/auth-header.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonComponent } from './common/common.component';
import { HeaderComponent } from './structure/header/header.component';
import { CommonSdkComponent } from './common-sdk/common-sdk.component';
import { CollapsSidebarComponent } from './structure/sidebar/collaps-sidebar/collaps-sidebar.component';
import { ItemSidebarComponent } from './structure/sidebar/item-sidebar/item-sidebar.component';
import { SidebarComponent } from './structure/sidebar/sidebar.component';
import { FooterComponent } from './structure/footer/footer.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CommonComponent,
    HeaderComponent,
    CommonSdkComponent,
    SidebarComponent,
    ItemSidebarComponent,
    CollapsSidebarComponent,
    FooterComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgApexchartsModule
  ],
  providers: [
    DatePipe,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptor,
      multi: true,
    },
    CookieService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
