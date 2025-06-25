import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-modal-change-boxes',
  templateUrl: './modal-change-boxes.component.html',
  styleUrls: ['./modal-change-boxes.component.scss']
})
export class ModalChangeBoxesComponent implements OnInit {

  packagingForm: FormGroup;

  data: any;

  actions: any;

  id: any;

  pendingContainers: any;
  
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
    this.packagingForm = this.fb.group({

      pendingContainers: [this.pendingContainers ? this.pendingContainers : 0, [Validators.required]],
     
    });
  }

  close(){
    this.activeModal.close(false);
  }

  submit(){
    
    if (this.packagingForm.valid) {

      let data ={

        pendingContainers: this.packagingForm.value.pendingContainers,

      }

      console.log(data, 'enviar al api cambio de envases');
  
      this.backendService.put('delivery_point/' + this.id, data).pipe(take(1)).subscribe((data)=>{
  
        this.toastService.displayWebsiteRelatedToast(

          this.translate.instant('CONFIGURATIONS.REGISTRATION'),

        );

      this.activeModal.close([true, this.packagingForm.value.pendingContainers]);
    
      }, error => {

        this.toastService.displayHTTPErrorToast(error.status, error.error.error);

      });

    

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
