import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  constructor(private toastr: ToastrService) { }

  showSuccess(message: any, title: any) {
    this.toastr.success(message, title, { timeOut: 3000 });
  }

  showError(message: any, title: any) {
    this.toastr.error(message, title, { timeOut: 3000 });
  }

  showInfo(message: any, title: any) {
    this.toastr.info(message, title, { timeOut: 3000 });
  }

  showWarning(message: any, title: any) {
    this.toastr.warning(message, title, { timeOut: 3000 });
  }


}
