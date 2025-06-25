import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-modal-add-accesories',
  templateUrl: './modal-add-accesories.component.html',
  styleUrls: ['./modal-add-accesories.component.scss']
})
export class ModalAddAccesoriesComponent implements OnInit {

  digitalForm: FormGroup;

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

    console.log(this.data);

    this.digitalForm = this.fb.group({

      name: [(this.data) ? this.data.name : '', [Validators.required]],
      type:[(this.data) ? this.data.type : '', [Validators.required]]

    });

    if (this.data && this.data.id > 0) {

      this.digitalForm.get('type').disable();
      this.digitalForm.get('type').updateValueAndValidity();
      
    }
  }

  close(){
    this.activeModal.close(false);
  }

  submit(){

    if (this.digitalForm.valid) {
      let data ={
        name: this.digitalForm.value.name,
        type: this.digitalForm.value.type
      }

      if(this.actions === "new"){

          this.backendService.post('company_digital_complement', data).pipe(take(1)).subscribe((data)=>{

            this.toastService.displayWebsiteRelatedToast(
              this.translate.instant('CONFIGURATIONS.REGISTRATION'),
          );

          this.activeModal.close(true);

          }, error => {
            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
          });
      } else {
          this.backendService.put('company_digital_complement/'+this.data.id, data).pipe(take(1)).subscribe((data)=>{

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
    this.backendService.delete('company_digital_complement/'+ send.id).pipe(take(1)).subscribe((data)=>{

      this.activeModal.close(true);

      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
      );


      }, error => {

        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
      });
  }

}
