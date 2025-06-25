import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-integration-confirm-delete-delivery-points',
  templateUrl: './modal-integration-confirm-delete-delivery-points.component.html',
  styleUrls: ['./modal-integration-confirm-delete-delivery-points.component.scss']
})
export class ModalIntegrationConfirmDeleteDeliveryPointsComponent implements OnInit {

  constructor(public dialogRef: NgbActiveModal) { }

  ngOnInit() {
  }
  closeDialog(value) {
    this.dialogRef.close(value);
  }

}
