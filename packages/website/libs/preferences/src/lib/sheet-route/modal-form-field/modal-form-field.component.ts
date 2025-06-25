import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-form-field',
  templateUrl: './modal-form-field.component.html',
  styleUrls: ['./modal-form-field.component.scss']
})
export class ModalFormFieldComponent implements OnInit {

  data: any;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  
  }

  close(){
    this.activeModal.close(false);
  }
}
