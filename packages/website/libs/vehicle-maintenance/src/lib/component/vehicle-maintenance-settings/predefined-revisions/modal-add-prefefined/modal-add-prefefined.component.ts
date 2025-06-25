import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../../../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '../../../../../../../backend/src/lib/backend.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { predefine } from 'libs/backend/src/lib/types/add-predifined.type';
import { PredefineMessages } from 'libs/shared/src/lib/messages/predefine/predefine.message';

@Component({
  selector: 'easyroute-modal-add-prefefined',
  templateUrl: './modal-add-prefefined.component.html',
  styleUrls: ['./modal-add-prefefined.component.scss']
})
export class ModalAddPrefefinedComponent implements OnInit {

  data: any;
  
  predefinedForm: FormGroup;

  actions: any;

  title: any;

  predefine_messages: any;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private translate: TranslateService,
    private backendService: BackendService,
    public activeModal: NgbActiveModal,
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {

    if (this.data !='new') {

      this.form(this.data);

    } else {

      this.form(new predefine());

    }

    
  }
  

  form(data: predefine){

    this.predefinedForm = this.fb.group({

      name :[ data.name, [ Validators.required, Validators.minLength(1), Validators.maxLength(100) ]],

      activeByCompany:[ data.isActive ],
    
    });

    this.predefine_messages = new PredefineMessages().getPredefineMessages();

  }


  close(){
    this.activeModal.close(false);

  }

  submit(){
    
    if (this.predefinedForm.valid) {
 
      this.backendService.post('maintenance_review_type_by_company', this.predefinedForm.value).pipe(take(1)).subscribe((data)=>{

        this.toastService.displayWebsiteRelatedToast(
          this.translate.instant('GENERAL.REGISTRATION'),
      );

        this.activeModal.close(true);
    
        }, error => {

          this.toastService.displayHTTPErrorToast(error.status, error.error.error);
        });
    }
  }

  editSubmit(){
    
    this.backendService.put('maintenance_review_type/' + this.data.id, this.predefinedForm.value).pipe(take(1)).subscribe((data)=>{

      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
    );

      this.activeModal.close(true);
  
      }, error => {

  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
      });
  }


}
