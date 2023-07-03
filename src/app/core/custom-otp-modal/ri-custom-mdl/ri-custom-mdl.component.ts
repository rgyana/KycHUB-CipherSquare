import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
// import { CommonService } from '../../common.service';
import { RiCustomMdlService } from './ri-custom-mdl.service';
import {CommonService} from '../../pytCustTbl/common.service'
import * as $ from 'jquery';
@Component({
  selector: 'ri-custom-mdl',
  templateUrl: './ri-custom-mdl.component.html',
  styleUrls: ['./ri-custom-mdl.component.css'],
})
export class RiCustomMdlComponent implements OnInit {
  @Input() id!: string;
  @Input() isBackdropShow: boolean = true;
  @Input() backdropClose: boolean = false;

  @Output() backdropCloseEmit = new EventEmitter<any>();
  private element: any;
  isShow: boolean = false;

  constructor(
    private _RiCustomMdlService: RiCustomMdlService,
    private el: ElementRef,
    private _CommonService: CommonService,
    private _rendder: Renderer2
  ) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    // ensure id attribute exists
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }

    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    // close modal on background click
    if (this.backdropClose && this.isBackdropShow) {
      this.element.addEventListener('click', (el: any) => {
        if (el.target.className.includes('ri-custom-mdl')) {
          this.backdropCloseEmit.emit();
          this.close();
        }
      });
    }

    // add self (this modal instance) to the modal service so it's accessible from controllers
    this._RiCustomMdlService.add(this);
  }

  // remove self from modal service when component is destroyed
  ngOnDestroy(): void {
    this._RiCustomMdlService.remove(this.id);
    this.element.remove();
  }

  // open modal
  open(): void {
    this.isShow = true;

    setTimeout(() => {
      this._CommonService.set_Z_index(
        this.element.querySelector('.ri-custom-mdl-background'),
        10
      );
      this._CommonService.set_Z_index(
        this.element.querySelector('.ri-custom-mdl'),
        11
      );
      document.body.classList.add('ri-custom-mdl-open');
    }, 1);
    // this.element.style.display = 'block';
  }

  // close modal
  close(): void {
    this.isShow = false;
    // this.element.style.display = 'none';
    document.body.classList.remove('ri-custom-mdl-open');
  }
}

// openModal(id: string) {
//   this._RiCustomMdlService.open(id);
// }

// closeModal(id: string) {
//   this._RiCustomMdlService.close(id);
// }
