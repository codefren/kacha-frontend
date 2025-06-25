import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent implements OnInit {

  constructor(public dialogRef: NgbActiveModal) { }

  ngOnInit() {
  }

  closeDialog(value:any) {
    this.dialogRef.close(value);
  }

}
