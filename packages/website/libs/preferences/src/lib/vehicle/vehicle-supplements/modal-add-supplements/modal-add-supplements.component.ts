import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@optimroute/shared';
import { BackendService } from '@optimroute/backend';

@Component({
  selector: 'easyroute-modal-add-supplements',
  templateUrl: './modal-add-supplements.component.html',
  styleUrls: ['./modal-add-supplements.component.scss']
})
export class ModalAddSupplementsComponent implements OnInit {

  otherLicenseForm: FormGroup;

  data: any;

  actions: any;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private translate: TranslateService,
    private backendService: BackendService,
    public activeModal: NgbActiveModal,
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
