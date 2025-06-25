import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-bad-import',
  templateUrl: './modal-bad-import.component.html',
  styleUrls: ['./modal-bad-import.component.scss']
})
export class ModalBadImportComponent implements OnInit {

  data: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() { }

  closeDialog(value: any) {
    this.activeModal.close(value);
  }

}
