import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
} from '@angular/core';

@Directive({
  selector: '[appFocusToNextInput]',
})
export class FocusToNextInputDirective {
  @Input() focusAfterLastInput: any = null;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private _el: ElementRef
  ) {}

  @HostListener('keyup', ['$event']) onKeyDown(e: any) {

    if (e.keyCode == 9 || e.keyCode == 16) {
      return;
    }
    if (
      e.srcElement.previousElementSibling &&
      (e.keyCode == 8 || e.keyCode == 46)
    ) {
      e.srcElement.previousElementSibling.value = '';
      e.srcElement.previousElementSibling.focus();
      return;
    }
    if (e.srcElement.value.length === 1) {
      e.preventDefault();

      // let nextControl: any = e;
      let nextControl: any = e.srcElement.nextElementSibling;
      // let nextControl: any = this._el.nativeElement;
      // Searching for next similar control to set it focus

      // while (true) {
      if (nextControl) {
        if (nextControl.type === e.srcElement.type) {
          nextControl.focus();
          return;
        } else {
          // e.blur();
          // nextControl = nextControl.nextElementSibling;
        }
      } else {
        if (document.querySelectorAll(this.focusAfterLastInput)[0]) {
          // this._el.nativeElement.blur();
          document.querySelectorAll(this.focusAfterLastInput)[0].focus();
        }
        return;
      }
      // }
    }
  }
}
