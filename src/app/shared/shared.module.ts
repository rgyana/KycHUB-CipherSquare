import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { PytTblTopBoxComponent } from '../core/pytCustTbl/pyt-tbl-top-box/pyt-tbl-top-box.component';
import { PytPaginationComponent } from '../core/pytCustTbl/pytPagination/pyt-pagination/pyt-pagination.component';
import { CustomOtpComponent } from '@core/custom-otp-modal/custom-otp/custom-otp.component';
import { RiCustomMdlComponent } from '@core/custom-otp-modal/ri-custom-mdl/ri-custom-mdl.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ShowServiceModalComponent } from '@core/show-service-modal/show-service-modal.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LoaderComponent } from '../loader/loader.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
// import { DynamicFormBuilderModule } from '@features/layouts/components/dynamic-form-builder/dynamic-form-builder.module';
import { OverlayModule } from '@angular/cdk/overlay';
// import { NgxUiLoaderModule } from "ngx-ui-loader";
import { NgxLoadingXConfig, NgxLoadingXModule, POSITION, SPINNER } from 'ngx-loading-x';
import { NgOtpInputModule } from  'ng-otp-input';
import {  BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// import { NgSelect2Module } from 'ng-select2';
// import { TagInputModule } from 'ngx-chips/tag-input.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';



const ngxLoadingXConfig: NgxLoadingXConfig = {
  show: false,
  bgBlur: 2,
  bgOpacity: 5,
  bgLogoUrl: '',
  bgLogoUrlPosition: POSITION.topLeft,
  bgLogoUrlSize: 100,
  spinnerType: SPINNER.xElapsis,
  spinnerSize: 70,
  spinnerColor: 'var(--primary-color)',
  spinnerPosition: POSITION.centerCenter,
}
@NgModule({
  declarations: [
    PytPaginationComponent,
    PytTblTopBoxComponent,
    CustomOtpComponent,
    RiCustomMdlComponent,
    ShowServiceModalComponent,
    LoaderComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    AutocompleteLibModule,
    NgMultiSelectDropDownModule,
    DragDropModule,
    NgOtpInputModule,
    BsDatepickerModule.forRoot(),
    // NgxUiLoaderModule,
    // DynamicFormBuilderModule,
    OverlayModule,
    NgxLoadingXModule.forRoot(ngxLoadingXConfig),
    // NgSelect2Module,
    CollapseModule.forRoot(),
    NgxQRCodeModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    BsDatepickerModule,
    PytTblTopBoxComponent,
    PytPaginationComponent,
    RiCustomMdlComponent,
    CustomOtpComponent,
    AutocompleteLibModule,
    LoaderComponent,
    ShowServiceModalComponent,
    NgMultiSelectDropDownModule,
    // DynamicFormBuilderModule,
    OverlayModule,
    NgxLoadingXModule,
    NgOtpInputModule,
    // NgSelect2Module,
    CollapseModule,
    NgxQRCodeModule
  ],
})
export class SharedModule {}
