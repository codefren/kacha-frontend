import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-modal-add-vehicle-status',
  templateUrl: './modal-add-vehicle-status.component.html',
  styleUrls: ['./modal-add-vehicle-status.component.scss']
})
export class ModalAddVehicleStatusComponent implements OnInit {

  vehicleStatusForm: FormGroup;

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
    this.vehicleStatusForm = this.fb.group({

      order: [(this.data) ? this.data.order : '', [Validators.required]], 
      name: [(this.data) ? this.data.name : '', [Validators.required]],
     
    });
  }

  close(){
    this.activeModal.close(false);
  }

  submit(){
    
    if (this.vehicleStatusForm.valid) {
      let data ={
        order: this.vehicleStatusForm.value.order,
        name: this.vehicleStatusForm.value.name,
      }

      if(this.actions === "new"){
      
          this.backendService.post('dock_company_predefined_answer', data).pipe(take(1)).subscribe((data)=>{
    
            this.toastService.displayWebsiteRelatedToast(

              this.translate.instant('CONFIGURATIONS.REGISTRATION'),

          );
    
          this.activeModal.close(true);
        
          }, error => {

            this.toastService.displayHTTPErrorToast(error.status, error.error.error);

          });

      } else {

          this.backendService.put('dock_company_predefined_answer/'+this.data.id, data).pipe(take(1)).subscribe((data)=>{
      
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
    
    this.backendService.delete('dock_company_predefined_answer/'+ send.id).pipe(take(1)).subscribe((data)=>{

      this.activeModal.close(true);

      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
      );

  
      }, error => {
  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
      });
  }

}
