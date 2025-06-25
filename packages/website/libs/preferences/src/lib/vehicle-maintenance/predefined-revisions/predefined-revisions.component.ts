import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddPrefefinedComponent } from './modal-add-prefefined/modal-add-prefefined.component';
import { BackendService } from 'libs/backend/src/lib/backend.service';
import { LoadingService, ToastService } from '@optimroute/shared';
import { StatePreferencesService } from 'libs/state-preferences/src/lib/state-preferences.service';
import { ModalDeletePredefinedComponent } from './modal-delete-predefined/modal-delete-predefined.component';

@Component({
  selector: 'easyroute-predefined-revisions',
  templateUrl: './predefined-revisions.component.html',
  styleUrls: ['./predefined-revisions.component.scss']
})
export class PredefinedRevisionsComponent implements OnInit {

  companyPreferenceMaintenance: any ={
    allowComentary: '',
    allowImages: '',
    showVerificationStateCheck: ''
  };

  MaintenanceReviewType: any;

  MaintenancePreferenceReview: any

  showReviewType: boolean = true;

  show: boolean = true;

  constructor(
    private service: StatePreferencesService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private translate: TranslateService,
    private _modalService: NgbModal,
    private backendService:BackendService
  ) { }

  ngOnInit() {
    this.getCompanyPreferenceMaintenance();
    this.getMaintenanceReviewType()
    this.getMaintenancePreferenceReview();
  }
    /* Listar los toogle  */
    getCompanyPreferenceMaintenance(){

   
      this.loadingService.showLoading();
  
      this.service.getCompanyPreferenceMaintenance().pipe( take(1) )
        .subscribe(
          ({ data }) => {
  
            this.loadingService.hideLoading(); 
  
            this.companyPreferenceMaintenance = data; 

           
          } ,
          ( error ) => {
  
            this.loadingService.hideLoading();
  
            this.toastService.displayHTTPErrorToast( error.status, error.error.error );
          }
        )
    }
  /* update companyPreferenceMaintenance */

  changeCompanyPreferenceMaintenance(name :string, event){
  
    this.companyPreferenceMaintenance[name] = event;
    
   this.service.updateCompanyPreferenceMaintenance(this.companyPreferenceMaintenance).pipe( take(1) )
   .subscribe(
     ({ data }) => {
     
       this.toastService.displayWebsiteRelatedToast(
         this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
         this.translate.instant('GENERAL.ACCEPT'),
     );
       
     } ,
     ( error ) => {
       this.loadingService.hideLoading();
       this.show= true;
       this.toastService.displayHTTPErrorToast( error.status, error.error.error );
     }
   )
   
   }


  // listado de previsiones dibujar tabla

  getMaintenanceReviewType(){
    this.showReviewType = false;
    this.service.getMaintenanceReviewType().pipe( take(1) )
      .subscribe(
        ({ data }) => {
          
          this.MaintenanceReviewType = data; 

          this.showReviewType = true;

        } ,
        ( error ) => {
          this.showReviewType = true;

          this.toastService.displayHTTPErrorToast( error.status, error.error.error );
        }
      )
  }

   /* listado de revision en preferencias para validar */
   getMaintenancePreferenceReview(){
    this.showReviewType = false;
    this.service.getMaintenancePreferenceReview().pipe( take(1) )
      .subscribe(
        ({ data }) => {
          
          this.MaintenancePreferenceReview = data; 

          this.showReviewType = true;

        } ,
        ( error ) => {
          this.showReviewType = true;

          this.toastService.displayHTTPErrorToast( error.status, error.error.error );
        }
      )
  }

  /* mostrar cual esta activo */

  showMaintenancePreferenceReview(id:any) {
    return this.MaintenancePreferenceReview.find(x => x.maintenanceReviewTypeId ===id && x.isActive) !=undefined ? true: false ;
  }

 /* update changeMaintenaceVehicles */

  changeMaintenanceReviewtype(data:any , event:any){
  
    let sendMaintenancePreference ={
      isActive: event,
      maintenanceReviewTypeId: data.id
    };
  
    this.service.updateMaintenanceReviewType(sendMaintenancePreference).pipe( take(1) )
    .subscribe(
      ({ data }) => {
      
        this.toastService.displayWebsiteRelatedToast(
          this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
          this.translate.instant('GENERAL.ACCEPT'),
          
      );
      this.getMaintenanceReviewType();
  
      this.getMaintenancePreferenceReview();
      } ,
      ( error ) => {
        this.loadingService.hideLoading();
        this.show= true;
        this.toastService.displayHTTPErrorToast( error.status, error.error.error );
      }
    )
  
  }

  addPredefined(){
  
    if (!this._modalService.hasOpenModals()) {
  
      const modal = this._modalService.open( ModalAddPrefefinedComponent, {
    
        backdropClass: 'modal-backdrop-ticket',
  
        windowClass:'modal-view-Roadmap',
    
        size:'md',
  
        backdrop: 'static'
    
      });
      
    modal.componentInstance.data = 'new';
  
     modal.componentInstance.actions ='new';
  
     modal.componentInstance.title =this.translate.instant('VEHICLE_MAINTENANCE.ADD_PRESETS'),
  
       modal.result.then(
          (data) => {
            if (data) {
  
              this.getMaintenanceReviewType();
  
              this.getMaintenancePreferenceReview();
  
            }
          
          },
          (reason) => {
            
            
          },
      ); 
    }
  
  }

  editPredefined(data ?: any){
  
    let send ={
      companyId: data.companyId,
      id: data.id,
      isActive:this.showMaintenancePreferenceReview(data.id),
      name:data.name
    }
  
    if (!this._modalService.hasOpenModals()) {
  
      const modal = this._modalService.open( ModalAddPrefefinedComponent, {
    
        backdropClass: 'modal-backdrop-ticket',
  
        windowClass:'modal-view-Roadmap',
    
        size:'md',
  
        backdrop: 'static'
    
      });
      
    modal.componentInstance.data = send;
  
     modal.componentInstance.actions ='edit';
  
     modal.componentInstance.title =this.translate.instant('VEHICLE_MAINTENANCE.EDIT_PRESETS'),
  
       modal.result.then(
          (data) => {
            if (data) {
               this.getMaintenanceReviewType();
  
              this.getMaintenancePreferenceReview();
            }
          
          },
          (reason) => {
            
            
          },
      ); 
    }
  
  }

modalDelete(send: any, index: any){

  const modal = this._modalService.open(ModalDeletePredefinedComponent, {

    backdropClass: 'modal-backdrop-ticket',

    centered: true,

    windowClass:'modal-cost',

    size:'md'

  });

  modal.componentInstance.title = this.translate.instant('VEHICLE_MAINTENANCE.CONFIRD');

  modal.componentInstance.Subtitle = this.translate.instant('VEHICLE_MAINTENANCE.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THE_SELECTED_RECORD');

  modal.componentInstance.accept =  this.translate.instant('VEHICLE_MAINTENANCE.YES_DELETE');
  
  modal.componentInstance.cssStyle = 'btn btn-red-general';

  modal.result.then(

    (data) => {
      if (data) {

       this.deletePredefineService(send, index);
      
      }      
    },
    (reason) => {
      
    },
  ); 

}

  deletePredefineService(data: any, index: any){
  
    this.backendService.delete('maintenance_review_type/' + data.id).pipe(take(1)).subscribe((data)=>{
  
      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
    );
      this.MaintenanceReviewType.splice(index,1);
  
      }, error => {
  
  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
      });
  
}

}
