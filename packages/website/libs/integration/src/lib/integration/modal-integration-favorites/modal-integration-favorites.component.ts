import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-integration-favorites',
  templateUrl: './modal-integration-favorites.component.html',
  styleUrls: ['./modal-integration-favorites.component.scss']
})
export class ModalIntegrationFavoritesComponent implements OnInit {

  @Input('message') message: string;

  constructor(public dialogRef: NgbActiveModal) { }

  ngOnInit() {
  }

  closeDialog(value) {
    this.dialogRef.close(value);
  }
}
