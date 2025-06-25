import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalDrivingLicensesComponent } from './modal-driving-licenses/modal-driving-licenses.component';
import { take } from 'rxjs/operators';
import { DeliveryModalConfirmationComponent } from 'libs/shared/src/lib/components/delivery-modal-confirmation/delivery-modal-confirmation.component';
import { LoadingService, ToastService } from '@optimroute/shared';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

declare var $;

@Component({
  selector: 'easyroute-driving-licenses',
  templateUrl: './driving-licenses.component.html',
  styleUrls: ['./driving-licenses.component.scss']
})
export class DrivingLicensesComponent implements OnInit {

  drivingLicenseList: any [] =[];

  constructor(
    private _modalService: NgbModal,
    private toastService: ToastService,
    private backendService: BackendService,
    private translate: TranslateService,
    private detectChanges: ChangeDetectorRef,
    private loading:LoadingService,
  ) { }

  ngOnInit() {
    this.load();
  }

  load(){
    this.loading.showLoading();

    this.backendService.get('license').pipe(take(1)).subscribe((data)=>{

      this.drivingLicenseList = data.data;
  
      this.loading.hideLoading();
  
      this.detectChanges.detectChanges();

    }, error => {
      
      this.loading.hideLoading();

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  activateToogle(event: any, data:any){

    const modal = this._modalService.open(DeliveryModalConfirmationComponent, {
      centered: true,
      backdrop: 'static'
    });

    if (data.isActive) {
        modal.componentInstance.title = this.translate.instant('GENERAL.CONFIRM_REQUEST');
        modal.componentInstance.message = this.translate.instant('GENERAL.INACTIVE?');
    } else {
        modal.componentInstance.title = this.translate.instant('GENERAL.CONFIRM_REQUEST');
        modal.componentInstance.message = this.translate.instant('GENERAL.ACTIVE?');
    }

    modal.result.then((result) => {
        if (result) {
            if (data.isActive) {
                data = {
                    ...data,
                    isActive: event
                }
                this.updateIsActive(data);
            } else {
                data = {
                    ...data,
                    isActive: event
                }
                this.updateIsActive(data);
            }
  
        } else {
          $('#isActiveitem' + data.id).prop('checked', data.isActive);
        }
    })
  
  }

  updateIsActive(send:any){

    this.backendService.post('company_license',{isActive:send.isActive, licenseId:send.id}).pipe(take(1)).subscribe((data)=>{

      this.load();

      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
      );

      this.detectChanges.detectChanges();
  
    }, error => {
        
      this.toastService.displayHTTPErrorToast(error.status, error.error.error);

    });
  }

  openModalForm(data:any){
    const modal = this._modalService.open( ModalDrivingLicensesComponent, {
      backdropClass: 'modal-backdrop-ticket',
      windowClass:'modal-view-Roadmap',
      size:'md'
    });
    
    modal.componentInstance.data = data;

     modal.result.then(
        (data) => {
            
        },
        (reason) => {},
    ); 
 
   }

}
