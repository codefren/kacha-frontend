import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '@optimroute/auth-local';
import { BackendService, Vehicle } from '@optimroute/backend';
import { LoadingService, ModalViewPdfGeneralComponent, ToastService } from '@optimroute/shared';
import { StateDeliveryZonesFacade } from '@optimroute/state-delivery-zones';
import { StateEasyrouteFacade } from '@optimroute/state-easyroute';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { StateUsersFacade } from '@optimroute/state-users';
import { VehiclesFacade } from '@optimroute/state-vehicles';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { StateUsersService } from 'libs/state-users/src/lib/state-users.service';
import { take } from 'rxjs/operators';
import { getEndOf, getStartOf } from '../../../../../../shared/src/lib/util-functions/date-format';
declare var $: any;
@Component({
  selector: 'easyroute-management-vehicles-analysis-form',
  templateUrl: './management-vehicles-analysis-form.component.html',
  styleUrls: ['./management-vehicles-analysis-form.component.scss']
})
export class ManagementVehiclesAnalysisFormComponent implements OnInit {
  
  vehiclesAnalysis: Vehicle;

  idVehicle:any;

  imageError: string = '';

  imgLoad: string ='';

  select: string ='generic_information';

  change = {
      
      generic_information:'generic_information',
      assignments:'assignments',
      documentation:'documentation',
      maintenance:'maintenance',
      costs:"costs"
      
  };

  status: any = '';

  filter = {

    dateFrom: getStartOf(), 

    dateTo: getEndOf(), 

    userId:''
  };

  filters = {

    dateFrom: getStartOf(), 

    dateTo: getEndOf(), 

    userId:''
  };

  constructor(
    public facadeProfile: ProfileSettingsFacade,
    private toastService: ToastService,
    private translate: TranslateService,
    private vehiclesFacade: VehiclesFacade,
    private easyRouteFacade: StateEasyrouteFacade,
    private usersFacade: StateUsersFacade,
    private _activatedRoute: ActivatedRoute,
    private backendService: BackendService,
    private zoneFacade: StateDeliveryZonesFacade,
    private service: StateUsersService,
    public authLocal: AuthLocalService,
    private router: Router,
    private fb: FormBuilder,
    private detectChange: ChangeDetectorRef,
    private stateEasyrouteService: StateEasyrouteService,
    private loading: LoadingService,
    private _modalService: NgbModal,

) {}

  ngOnInit() {

    this.validateRoute();
  }

  returnsList(){

    this.router.navigate(['management-logistics/vehicles/analysis']);
      
  }

  validateRoute() {

    this._activatedRoute.params.pipe(take(1)).subscribe((params) => {
    
      this.idVehicle = params['id'];

      this.backendService.get('vehicle/' + params['id']).pipe(take(1)).subscribe(

          ({ data }) => {

              this.vehiclesAnalysis = data;

              this.status = data.isActive ? 'Activo': 'Inactivo'

              this.imgLoad = this.vehiclesAnalysis.urlImage;

              this.detectChange.detectChanges();
             
          },
          (error) => {
              this.toastService.displayHTTPErrorToast(
                  error.status,
                  error.error.error,
              );
          },
      );
    });
  }

  openModalViewPdf(){
    
    let url = 'vehicle_analysis_detail_pdf/' + this.vehiclesAnalysis.id + '?' +

    (this.filter.dateFrom != '' ? '&dateFrom=' +
        this.filter.dateFrom : '') +

    (this.filter.dateTo != '' ? '&dateTo=' +
        this.filter.dateTo : '') +

    (this.filter.userId != '' ? '&userId=' +
    this.filter.userId : '');

    const modal = this._modalService.open( ModalViewPdfGeneralComponent, {
  
        backdropClass: 'modal-backdrop-ticket',
    
        centered: true,
    
        windowClass:'modal-view-pdf',
    
        size:'lg'
    
      });

      modal.componentInstance.url = url;
  
      modal.componentInstance.title = this.translate.instant('VEHICLES.VEHICLES_ANALYSIS.VEHICLES_ANALYSIS_DETAILS');
    
  }

  fileChangeEvent($event: any) {
   
    return this.loadImage64($event);
  }

  loadImage64(e: any) {

    this.imageError = '';
  
    const allowedTypes = ['image/jpeg', 'image/png'];

    const reader = new FileReader();

    const maxSize = 1000000;

  
    let file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
  
    if (file.size > maxSize) {
        this.imageError = 'Tamaño máximo permitido ' + '('+maxSize / 1000 / 1000 + 'Mb' +')';
        return;
    }
  
    if (!allowedTypes.includes(file.type)) {
        this.imageError = 'Formatos permitidos ( JPG | PNG )';
        return;
    }
  

    reader.onload = this.validateSizeImg.bind( this );

  
    reader.readAsDataURL( file );

    $("input[type='file']").val('');
    
  }

  validateSizeImg( $event) {

    const reader = $event.target.result;

    this._handleUpdateImage(reader);
  
  
    return reader;
  }

  _handleUpdateImage(image: any) {


    delete image.urlImage;

    if (this.vehiclesAnalysis && this.vehiclesAnalysis.id && this.vehiclesAnalysis.id >0) {


        this.loading.showLoading();

        // crea la imagen de la compañia

        this.backendService.put(`vehicle_update_image/${ this.vehiclesAnalysis.id }`,{ image:image }).pipe(take(1)).subscribe(
            ({ data }) => {


                this.imgLoad = image;


                this.toastService.displayWebsiteRelatedToast(

                    this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),

                    this.translate.instant('GENERAL.ACCEPT'),

                );
    
               
                this.loading.hideLoading();

                this.detectChange.detectChanges();
            },
            (error) => {
                
                this.loading.hideLoading();

                this.toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
       
    } else {
       
        this.imgLoad = image;

        this.detectChange.detectChanges();
    }
}

_handleDeleteImage() {

    

  if (this.vehiclesAnalysis && this.vehiclesAnalysis.id >0) {

    this.loading.showLoading();

       this.backendService.put(`vehicle_delete_image/${ this.vehiclesAnalysis.id }`).pipe(take(1))
          .subscribe(
              (resp) => {
                
                this.imgLoad = '';

                $("input[type='file']").val('');

                  this.toastService.displayWebsiteRelatedToast(
                      this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                      this.translate.instant('GENERAL.ACCEPT'),
                  );

                  this.loading.hideLoading();
                 
                  this.detectChange.detectChanges();
              },
              (error) => {

                this.loading.hideLoading();

                this.toastService.displayHTTPErrorToast(error.error);
              },
          );
  } else {
    
    this.imgLoad ='';

    this.detectChange.detectChanges();

    
  }
}

getValidateDateFilter(filter: any){

  this.filter = filter;

}


}
