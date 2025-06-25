import { DirectionsMessages } from './../../../../../../../../shared/src/lib/messages/directions/directions.message';
import { ValidatePhone } from './../../../../../../../../shared/src/lib/validators/phone.validator';
import { ToastService } from './../../../../../../../../shared/src/lib/services/toast.service';
import { BackendService } from './../../../../../../../../backend/src/lib/backend.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'easyroute-modal-phone',
  templateUrl: './modal-phone.component.html',
  styleUrls: ['./modal-phone.component.scss']
})
export class ModalPhoneComponent implements OnInit {

  form: FormGroup;

  phone: any = {
    name:'',
    companyId:'',
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

        companyId: [this.phone.companyId ? this.phone.companyId : 0, [Validators.required]],
        name: [this.phone.name, [Validators.required, Validators.maxLength(30)]],
        phone: [this.phone.phone ? this.phone.phone :this.prefix, [Validators.required,  ValidatePhone(this.prefix ==='+34' ? this.prefix ='España' :'')]],
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
