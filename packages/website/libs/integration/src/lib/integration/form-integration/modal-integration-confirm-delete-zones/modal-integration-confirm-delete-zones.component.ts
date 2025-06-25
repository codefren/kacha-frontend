import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-integration-confirm-delete-zones',
  templateUrl: './modal-integration-confirm-delete-zones.component.html',
  styleUrls: ['./modal-integration-confirm-delete-zones.component.scss']
})
export class ModalIntegrationConfirmDeleteZonesComponent implements OnInit {

  constructor(public dialogRef: NgbActiveModal) { }

  ngOnInit() {
  }

  closeDialog(value) {
    this.dialogRef.close(value);
  }

}
