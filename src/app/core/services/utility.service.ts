import { Injectable } from '@angular/core';
import { FormGroup, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  constructor(private _Router: Router) { }
  checkFormControlAvailable(formGroup: FormGroup, controlName: string) {
    return Object.keys(formGroup.controls).find((name: any) => {
      return formGroup.get(controlName) === formGroup.controls[name];
    });
    // Object.keys(formGroup).find(name => formGroup.get(controlName) === formGroup[name]
  }
  setRemoveValidator(
    type: 'r' | 'a', //'r' remove | 'a' add
    group: FormGroup,
    control: string | string[],
    validators: ValidatorFn | ValidatorFn[],
    checkHasInForm: boolean = false
  ) {
    let controls: string[] = typeof control === 'string' ? (control === 'all' ? Object.keys(group.value)
      : [control]) : control;
    controls.forEach((controlName) => {
      if (
        checkHasInForm &&
        !this.checkFormControlAvailable(group, controlName)
      ) {
        return;
      }
      if (type === 'a') {
        group.controls[controlName].addValidators(validators);
      } else if (type === 'r') {
        group.controls[controlName].removeValidators(validators);
      }
      group.controls[controlName].updateValueAndValidity();
    });
  }

  reloadTo(uri: string) {
    this._Router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this._Router.navigate([uri ?? '**']));
  }
  generatePDF(
    _invoiceElement: any,
    filename: any,
    isType: 'PRINT' | 'DOWNLOAD' = 'DOWNLOAD',
    customPage?: boolean
  ): void {
    let invoiceElement: any = { _invoiceElement };
    invoiceElement = invoiceElement._invoiceElement;
    html2canvas(invoiceElement, {
      scale: 3, onclone(document: Document, element: HTMLElement) {
        element.querySelector('.receiptStampBox')?.classList.remove('d-none')
      },
    }).then((canvas) => {
      // console.log(canvas);

      const imageGeneratedFromTemplate = canvas.toDataURL('image/png');

      const fileWidth = 200;
      const generatedImageHeight = (canvas.height * fileWidth) / canvas.width;
      let page: any = 'a4'
      if (customPage) {
        page = [fileWidth + 20, generatedImageHeight]
      }
      let PDF = new jsPDF('p', 'mm', page);
      PDF.addImage(
        imageGeneratedFromTemplate,
        'PNG',
        5,
        5,
        fileWidth,
        generatedImageHeight,
        '',
        'MEDIUM'
      );
      PDF.rect(
        5,
        5,
        PDF.internal.pageSize.width - 10,
        PDF.internal.pageSize.height - 10,
        'S'
      );
      // invoiceElement.querySelector('.receiptStampBox')?.classList.remove('d-none');
      // console.log(invoiceElement.querySelector('.receiptStampBox'));

      PDF.html(invoiceElement.innerHTML);
      if (isType == 'DOWNLOAD') {
        PDF.save(`${filename}.pdf`);
      } else if (isType == 'PRINT') {
        PDF.autoPrint();
        window.open(PDF.output('bloburl'), '_blank');
      }
    });
  }
}
