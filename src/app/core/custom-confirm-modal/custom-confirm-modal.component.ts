import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ToasterService } from '@core/services/toaster.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-custom-confirm-modal',
  templateUrl: './custom-confirm-modal.component.html',
  styleUrls: ['./custom-confirm-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomConfirmModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private toastr: ToasterService) { }

  ngOnInit(): void {
  }

  @Input()
  modalData: any;

  onConfirmBtnClick() {
    this.activeModal.close(true);
  }

  onCancelBtnClick() {
    this.activeModal.close(false);
  }

}
