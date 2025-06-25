import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-modal-other-licenses',
  templateUrl: './modal-other-licenses.component.html',
  styleUrls: ['./modal-other-licenses.component.scss']
})
export class ModalOtherLicensesComponent implements OnInit {

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
     
    });
  }

  close(){
    this.activeModal.close(false);
  }

  submit(){
    
    if (this.otherLicenseForm.valid) {
      let data ={
        name: this.otherLicenseForm.value.name,
      }

      if(this.actions === "new"){
      
          this.backendService.post('company_other_license', data).pipe(take(1)).subscribe((data)=>{
    
            this.toastService.displayWebsiteRelatedToast(
              this.translate.instant('CONFIGURATIONS.REGISTRATION'),
          );
    
          this.activeModal.close(true);
        
          }, error => {
            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
          });
      } else {
          this.backendService.put('company_other_license/'+this.data.id, data).pipe(take(1)).subscribe((data)=>{
      
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
    this.backendService.delete('company_other_license/'+ send.id).pipe(take(1)).subscribe((data)=>{

      this.activeModal.close(true);

      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
      );

      this.detectChanges.detectChanges();
  
      }, error => {
  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
      });
  }

}
