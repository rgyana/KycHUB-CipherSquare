import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { AadhaarService } from '../services/mask.service';

@Directive({
  selector: '[appMask]',
})
export class MaskDirective {
  @Input('appAutoTab') appAutoTab:any;
  @Output()data: EventEmitter<any> = new EventEmitter();
  oneAadhar: string = '';
  twoAadhar: string = '';
  constructor(private el: ElementRef, private adhar : AadhaarService) {}

  @HostListener('input', ['$event']) onInputChange() {
    setTimeout(() => {
      this.change(this.el.nativeElement.value);
    }, 100);
  }
  private change(value: string) {
  if(this.el.nativeElement.id== 'one'){
    if (value.length == 1) {
      this.oneAadhar = value;
      this.el.nativeElement.value = value.split(value).join('X');
    }
    if (value.length == 2) {
      this.oneAadhar = this.oneAadhar.concat(value.substring(1));
      this.el.nativeElement.value = value.split(value).join('XX');
    }
    if (value.length == 3) {
      this.oneAadhar = this.oneAadhar.concat(value.substring(2));
      this.el.nativeElement.value = value.split(value).join('XXX');
    }
    if (value.length == 4) {
      this.oneAadhar = this.oneAadhar.concat(value.substring(3));
        const data = {
          firstnumber:this.oneAadhar,
          secondnumber:this.twoAadhar
        }

      this.adhar.setValue(data);
      this.el.nativeElement.value = value.split(value).join('XXXX');
      this.appAutoTab.focus();
    }
  }
  if(this.el.nativeElement.id== 'two'){
    if (value.length == 1) {
      this.twoAadhar = value;
      this.el.nativeElement.value = value.split(value).join('X');
    }
    if (value.length == 2) {
      this.twoAadhar = this.twoAadhar.concat(value.substring(1));
      this.el.nativeElement.value = value.split(value).join('XX');
    }
    if (value.length == 3) {
      this.twoAadhar = this.twoAadhar.concat(value.substring(2));
      this.el.nativeElement.value = value.split(value).join('XXX');
    }
    if (value.length == 4) {
      this.twoAadhar = this.twoAadhar.concat(value.substring(3));
      const data = {
        firstnumber:this.oneAadhar,
        secondnumber:this.twoAadhar
      }
      this.adhar.setValue(data);
      this.el.nativeElement.value = value.split(value).join('XXXX');
      this.appAutoTab.focus();
    }
  }


  }

}
