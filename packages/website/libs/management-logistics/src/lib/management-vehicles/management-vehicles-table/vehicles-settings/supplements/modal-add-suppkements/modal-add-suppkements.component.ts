import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { take } from 'rxjs/operators';
import { ToastService } from '../../../../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '../../../../../../../../backend/src/lib/backend.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-modal-add-suppkements',
  templateUrl: './modal-add-suppkements.component.html',
  styleUrls: ['./modal-add-suppkements.component.scss']
})
export class ModalAddSuppkementsComponent implements OnInit {

  otherLicenseForm: FormGroup;

  data: any;

  actions: any;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private translate: TranslateService,
    private backendService: BackendService,
    public activeModal: NgbActiveModal,
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.form();
  }

  form(){
    this.otherLicenseForm = this.fb.group({

      name: [(this.data) ? this.data.name : '', [Validators.required]]

    });
  }

  close(){
    this.activeModal.close(false);
  }

  submit(){

    if (this.otherLicenseForm.valid) {
      let data ={
        name: this.otherLicenseForm.value.name
      }

      if(this.actions === "new"){

          this.backendService.post('company_supplement', data).pipe(take(1)).subscribe((data)=>{

            this.toastService.displayWebsiteRelatedToast(
              this.translate.instant('CONFIGURATIONS.REGISTRATION'),
          );

          this.activeModal.close(true);

          }, error => {
            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
          });
      } else {
          this.backendService.put('company_supplement/'+this.data.id, data).pipe(take(1)).subscribe((data)=>{

            this.toastService.displayWebsiteRelatedToast(
              this.translate.instant('CONFIGURATIONS.REGISTRATION'),
          );

          this.activeModal.close(true);

          }, error => {
            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
          });
        }

      }

  }

  deleteService(send:any){
    this.backendService.delete('company_supplement/'+ send.id).pipe(take(1)).subscribe((data)=>{

      this.activeModal.close(true);

      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
      );


      }, error => {

        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
      });
  }


}
