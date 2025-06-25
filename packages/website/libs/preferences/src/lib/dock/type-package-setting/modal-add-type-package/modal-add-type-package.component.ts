import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-modal-add-type-package',
  templateUrl: './modal-add-type-package.component.html',
  styleUrls: ['./modal-add-type-package.component.scss']
})
export class ModalAddTypePackageComponent implements OnInit {

  typePackageForm: FormGroup;

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
    this.typePackageForm = this.fb.group({

      order: [(this.data) ? this.data.order : '', [Validators.required]], //Se debe cambiar por order
      name: [(this.data) ? this.data.name : '', [Validators.required]],

    });
  }

  close(){
    this.activeModal.close(false);
  }

  submit(){

    if (this.typePackageForm.valid) {
      let data ={
        order: this.typePackageForm.value.order,
        name: this.typePackageForm.value.name,
      }

    //  this.activeModal.close(true);

      if(this.actions === "new"){

          this.backendService.post('company_package_type', data).pipe(take(1)).subscribe((data)=>{

            this.toastService.displayWebsiteRelatedToast(
              this.translate.instant('CONFIGURATIONS.REGISTRATION'),
          );

          this.activeModal.close(true);

          }, error => {
            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
          });
      } else {
          this.backendService.put('company_package_type/'+this.data.id, data).pipe(take(1)).subscribe((data)=>{

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
    this.backendService.delete('company_package_type/'+ send.id).pipe(take(1)).subscribe((data)=>{

      this.activeModal.close(true);

      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
      );



      }, error => {

        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
      });
  }

}
