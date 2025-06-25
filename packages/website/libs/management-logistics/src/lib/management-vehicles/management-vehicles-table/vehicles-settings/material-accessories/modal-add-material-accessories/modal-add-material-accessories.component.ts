import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../../../../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '../../../../../../../../backend/src/lib/backend.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-modal-add-material-accessories',
  templateUrl: './modal-add-material-accessories.component.html',
  styleUrls: ['./modal-add-material-accessories.component.scss']
})
export class ModalAddMaterialAccessoriesComponent implements OnInit {

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

      name: [(this.data) ? this.data.name : '', [Validators.required]],
      type:[(this.data) ? this.data.type : '', [Validators.required]]

    });

    if (this.data && this.data.id > 0) {

      this.otherLicenseForm.get('type').disable();
      this.otherLicenseForm.get('type').updateValueAndValidity();
      
    }
  }

  close(){
    this.activeModal.close(false);
  }

  submit(){

    if (this.otherLicenseForm.valid) {
      let data ={
        name: this.otherLicenseForm.value.name,
        type: this.otherLicenseForm.value.type,
      }

      if(this.actions === "new"){

          this.backendService.post('company_material_complement', data).pipe(take(1)).subscribe((data)=>{

            this.toastService.displayWebsiteRelatedToast(
              this.translate.instant('CONFIGURATIONS.REGISTRATION'),
          );

          this.activeModal.close(true);

          }, error => {
            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
          });
      } else {
          this.backendService.put('company_material_complement/'+this.data.id, data).pipe(take(1)).subscribe((data)=>{

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
    this.backendService.delete('company_material_complement/'+ send.id).pipe(take(1)).subscribe((data)=>{

      this.activeModal.close(true);

      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
      );



      }, error => {

        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
      });
  }


}
