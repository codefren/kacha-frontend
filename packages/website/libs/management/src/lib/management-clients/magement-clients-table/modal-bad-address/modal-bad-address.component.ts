import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-bad-address',
  templateUrl: './modal-bad-address.component.html',
  styleUrls: ['./modal-bad-address.component.scss']
})
export class ModalBadAddressComponent implements OnInit {
  
  data: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() { }

  closeDialog(value: any) {
    this.activeModal.close(value);
  }

}
