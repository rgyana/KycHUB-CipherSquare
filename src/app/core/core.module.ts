import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreDirectivesModule } from './directives/core-directives.module';
import { PipesModule } from './pipes/pipes.module';
import { CustomConfirmModalComponent } from './custom-confirm-modal/custom-confirm-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerifyOtpModalComponent } from './verify-otp-modal/verify-otp-modal.component';

@NgModule({
  declarations: [
    CustomConfirmModalComponent,
    VerifyOtpModalComponent
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CoreDirectivesModule, PipesModule],
  exports: [CoreDirectivesModule, PipesModule],
})
export class CoreModule { }
