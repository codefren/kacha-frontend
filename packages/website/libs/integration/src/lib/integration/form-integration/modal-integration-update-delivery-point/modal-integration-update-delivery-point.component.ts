import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-integration-update-delivery-point',
  templateUrl: './modal-integration-update-delivery-point.component.html',
  styleUrls: ['./modal-integration-update-delivery-point.component.scss']
})
export class ModalIntegrationUpdateDeliveryPointComponent implements OnInit {
  
  form: FormGroup;

  dataPoint: any = {
    id: '',
    orderNumber: ''
  };
  
  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {

    this.validaciones();
    
  }

  validaciones() {
 
    this.form = this.fb.group(
      {
        id: [this.dataPoint.id],
        orderNumber: [this.dataPoint.orderNumber, [Validators.required]],
      }
    ); 

  }

  close(){

    this.activeModal.close(false);

  }

  submit() {

    this.activeModal.close(this.form.value);

  }

}
