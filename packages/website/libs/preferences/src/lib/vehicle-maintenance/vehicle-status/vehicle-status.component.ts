import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService, ToastService } from '@optimroute/shared';
import { StatePreferencesService } from 'libs/state-preferences/src/lib/state-preferences.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-vehicle-status',
  templateUrl: './vehicle-status.component.html',
  styleUrls: ['./vehicle-status.component.scss']
})
export class VehicleStatusComponent implements OnInit {

  companyPreferenceMaintenance: any ={
    allowComentary: '',
    allowImages: '',
    showVerificationStateCheck: ''
  };

  show: boolean = true;

  MaintenanceVehicleStateType: any;

  MaintenancePreferenceVehicleStateType: any;

  constructor(
    private loadingService: LoadingService,
    private translate: TranslateService,
    private toastService: ToastService,
    private service: StatePreferencesService,
  ) { }


  ngOnInit() {

    this.getCompanyPreferenceMaintenance();

    this.getMaintenancePreferenceVehicleStateType();
    
  }

 
  getCompanyPreferenceMaintenance(){

    this.loadingService.showLoading();

    this.service.getCompanyPreferenceMaintenance().pipe( take(1) )
      .subscribe(
        ({ data }) => {

          this.loadingService.hideLoading(); 

          this.companyPreferenceMaintenance = data; 

          this.getMaintenanceVehicleStateType();
         
        } ,
        ( error ) => {

          this.loadingService.hideLoading();

          this.toastService.displayHTTPErrorToast( error.status, error.error.error );
        }
      )
  }



  /* Listar listado de bien mal etc */

  getMaintenanceVehicleStateType(){
    
    this.show= false;

    this.service.getMaintenanceVehicleStateType().pipe( take(1) )
      .subscribe(
        ({ data }) => {

          this.MaintenanceVehicleStateType = data; 

          this.show = true;

        } ,
        ( error ) => {

          this.show= true;

          this.toastService.displayHTTPErrorToast( error.status, error.error.error );
        }
      )
  }

    /* listado para vilidar si existe chequear */

    getMaintenancePreferenceVehicleStateType(){
    
      this.service.getMaintenancePreferenceVehicleStateType().pipe( take(1) )
        .subscribe(
          ({ data }) => {
  
            this.MaintenancePreferenceVehicleStateType = data; 
          } ,
          ( error ) => {
  
            this.toastService.displayHTTPErrorToast( error.status, error.error.error );
          }
        )
    }

    /* cambiar showVerificationStateCheck &&  allowImages && coment */
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
  

   /* update MaintenaceVehicles*/
  changeMaintenaceVehicles(data:any , event:any){

    let send ={
      isActive: event,
      maintenanceVehicleStateTypeId: data.id
    };

    this.service.updateMaintenanceVehicleStateType(send).pipe( take(1) )
    .subscribe(
      ({ data }) => {
        console.log(data, 'Respuesta cambiado')      
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

   /* funcion que valida ambos listados y si hay un mach return true o false */
   showcheck(id:any) {
    return this.MaintenancePreferenceVehicleStateType.find(x => x.maintenanceVehicleStateTypeId ===id && x.isActive) !=undefined ? true: false ;
  }

}
