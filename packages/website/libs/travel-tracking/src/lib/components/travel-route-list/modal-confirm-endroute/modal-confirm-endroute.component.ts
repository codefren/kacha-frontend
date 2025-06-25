import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-confirm-endroute',
  templateUrl: './modal-confirm-endroute.component.html',
  styleUrls: ['./modal-confirm-endroute.component.scss']
})
export class ModalConfirmEndrouteComponent implements OnInit {

  constructor(public dialogRef: NgbActiveModal) { }

  ngOnInit() {
  }

  closeDialog(value) {
    this.dialogRef.close(value);
  }

}
