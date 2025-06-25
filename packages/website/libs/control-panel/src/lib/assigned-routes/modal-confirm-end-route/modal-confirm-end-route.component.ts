import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-confirm-end-route',
  templateUrl: './modal-confirm-end-route.component.html',
  styleUrls: ['./modal-confirm-end-route.component.scss']
})
export class ModalConfirmEndRouteComponent implements OnInit {

  constructor(public dialogRef: NgbActiveModal) { }

  ngOnInit() {
  }

  closeDialog(value) {
    this.dialogRef.close(value);
  }

}
