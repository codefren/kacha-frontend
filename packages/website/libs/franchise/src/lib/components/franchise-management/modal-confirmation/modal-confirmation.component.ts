import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-confirmation',
  templateUrl: './modal-confirmation.component.html',
  styleUrls: ['./modal-confirmation.component.scss']
})
export class ModalConfirmationComponent implements OnInit {

  default: boolean;

  delete: boolean;

  last4: string;

  titleTranslate: string;

  @Input() data: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  closeDialog(value: any) {
    this.activeModal.close(value);
  }

}
