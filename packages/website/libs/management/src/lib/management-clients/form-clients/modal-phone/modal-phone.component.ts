import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from '@optimroute/backend';
import { TranslateService } from '@ngx-translate/core';
import { DirectionsMessages, ToastService } from '@optimroute/shared';
import { ValidatePhone } from '../../../../../../shared/src/lib/validators/phone.validator';

@Component({
  selector: 'easyroute-modal-phone',
  templateUrl: './modal-phone.component.html',
  styleUrls: ['./modal-phone.component.scss']
})
export class ModalPhoneComponent implements OnInit {

  form: FormGroup;

  phone: any = {
    id: '',
    name:'',
    deliveryPointId:'',
    phone:''
  };

  prefix: any;
  directions_messages: any;

  showAddress: boolean = true;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private detectChanges: ChangeDetectorRef,
    private backend: BackendService,
    private translate: TranslateService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    console.log(this.phone, 'phone');
    this.form = this.fb.group(
      {
        id: [this.phone.id],
        deliveryPointId: [this.phone.deliveryPointId ? this.phone.deliveryPointId : 0, [Validators.required]],
        name: [this.phone.name, [Validators.required, Validators.maxLength(30)]],
        phone: [this.phone.phone ? this.phone.phone :this.prefix, [Validators.required, ValidatePhone(this.prefix ==='+34' ? this.prefix ='España' :'')]],
      }
    );

    this.directions_messages = new DirectionsMessages().getDirectionsMessages();
  }
  
  close(){
    this.activeModal.close(false);
  }

  submit (){
    this.activeModal.close({data: this.form.value });
  }

}
