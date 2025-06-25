import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../../../../../../shared/src/lib/services/loading.service';
import * as moment from 'moment-timezone';
import { take } from 'rxjs/operators';
import { ModalViewPdfGeneralComponent } from '@optimroute/shared';
import { getToday, getYearToToday } from '../../../../../../shared/src/lib/util-functions/date-format';
import { StateEasyrouteService } from '../../../../../../state-easyroute/src/lib/state-easyroute.service';
declare var $: any;
@Component({
  selector: 'easyroute-management-form-clients-analysis',
  templateUrl: './management-form-clients-analysis.component.html',
  styleUrls: ['./management-form-clients-analysis.component.scss']
})
export class ManagementFormClientsAnalysisComponent implements OnInit {

  select: string ='sheetRoute';

  change = {
      sheetRoute: 'sheetRoute',
      deliveryNotes: 'deliveryNotes',
      summary: 'summary',
  };


  roadMapData: any;

  clientAnalysisData: any;
  
  routeId: number = 0;

  routePlanningRouteId: number =0;

  idClient:any;

 dates: any ={
    from: getYearToToday(),  //getToday(),
    to: getToday(),
    userId: '',
    delayTimeOnDelivery:''
 };

 franchiseImages: {
  id: number;
  urlImage: string;
  image?: string;
}[] = [];
imageError: string = '';
cardImageBase64: string;
filterYear: any;


  constructor(
    private detectChanges: ChangeDetectorRef,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private backendService: BackendService,
    private _toastService: ToastService,
    private _modalService: NgbModal,
    private _translate:TranslateService,
    private loadingService: LoadingService,
    private stateEasyrouteService: StateEasyrouteService
  ) { 
    this._activatedRoute.queryParams.pipe(
      take(1)).subscribe(params => {

      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras

          && this.router.getCurrentNavigation().extras.state) {

              console.log('if');

          this.filterYear = this.router.getCurrentNavigation().extras.state;

          console.log(this.filterYear, 'this.filterYear');



      }
  });
  }

  ngOnInit() {
    this.load();
  }

  load(){

    this.loadingService.showLoading();

    this._activatedRoute.params.subscribe((params) => {
    
      this.idClient = params['id'];

      if (params['id'] !== 'new') {
          this.backendService
              .get('delivery_point_analysis_detail/' + params['id'])
              .pipe(take(1),)
              .subscribe(
                  (resp: any) => {

                     this.clientAnalysisData = resp.data;

                    this.getImage();

                     this.loadingService.hideLoading();
                    
                     this.detectChanges.detectChanges();
                  },
                  (error) => {

                      this.loadingService.hideLoading();

                      this._toastService.displayHTTPErrorToast(
                          error.status,
                          error.error.error,
                      );
                  },
              );
      } 
  });
  }
  
  getImage() {
    if (this.clientAnalysisData.id.length > 0 && this.clientAnalysisData.id != null) {
        this.stateEasyrouteService
            .getCompanyImagenClient(this.clientAnalysisData.id)
            .pipe(take(1))
            .subscribe(
                (data: any) => {
                  
                    this.franchiseImages = this.franchiseImages.concat(data.data);

                  
                    this.detectChanges.detectChanges();
                },
                (error) => {
                    this._toastService.displayHTTPErrorToast(error.error);
                },
            );
    }
}

  getImg(){
    this.backendService
      .get('delivery_point_image?deliveryPointId=' +this.idClient)
      .pipe(take(1),)
      .subscribe(
          (resp: any) => {

            console.log(resp.data, 'respuesta del servicio imganes');
            
              this.detectChanges.detectChanges();
          },
          (error) => {

              

              this._toastService.displayHTTPErrorToast(
                  error.status,
                  error.error.error,
              );
          },
      );
  }

  changePage(name: string) {
        
    this.select = this.change[name];

    this.detectChanges.detectChanges();
  }

  returnsList(){
    this.router.navigateByUrl('management/clients/analysis');
  }

  openModalViewPdf(){
    
    const modal = this._modalService.open( ModalViewPdfGeneralComponent, {
      
      backdropClass: 'modal-backdrop-ticket',
  
      centered: true,
  
      windowClass:'modal-view-pdf',
  
      size:'lg'
  
    });

    let url = 'delivery_point_analysis_pdf/'+ this.idClient ; 

    url += this.dates.from ? '?from=' + this.dates.from : '';

    url += this.dates.to ? '&to=' + this.dates.to : '';

    url += this.dates.userId ? '&userId=' + this.dates.userId : '';

    url += this.dates.delayTimeOnDelivery ? '&delayTimeOnDelivery=' + this.dates.delayTimeOnDelivery : '';

   // url += this.filterYear && this.filterYear.year ? '&year=' + this.filterYear.year : '';

    console.log(this.filterYear, 'this.filterYear');

    console.log(url, 'pdf');

    modal.componentInstance.url= url;

    modal.componentInstance.title = this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.CUSTOMER_ANALYSIS');
    
    
  }
  
  returnsHour(date: any){
    if (date) {
      return moment(date).format('HH:mm');
    } else {
      return 'No disponible'
    }
    

  }

  getData(data: any){

    this.dates = data;

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
  
    let data = {
      id: null,
      image: reader,
      urlImage: reader,    
      main: false 
       
    };
    
    this._handleUpdateImage(data);
  
  
    return reader;
  }

  _handleUpdateImage(image: any) {

    delete image.urlImage;

    if (this.clientAnalysisData.id > 0 || this.clientAnalysisData.id.length > 0) {
        // crea la imagen de la compañia

        this.loadingService.showLoading();

        this.stateEasyrouteService
            .createCompanyImageClient({ ...image, deliveryPointId: this.clientAnalysisData.id })
            .pipe(take(1))
            .subscribe(
                (dataImage: any) => {
                    
                    image = {
                        id: dataImage.data.id,
                        urlimage: dataImage.data.image,
                        image: dataImage.data.image,
                    };

                    this._toastService.displayWebsiteRelatedToast(
                        this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                        this._translate.instant('GENERAL.ACCEPT'),
                    );

                    this.franchiseImages = this.franchiseImages.concat([image]);
                   

                    this.loadingService.hideLoading();

                    this.detectChanges.detectChanges();
                },

                (error) => {
                    this._toastService.displayHTTPErrorToast(error.error);
                    this.loadingService.hideLoading();
                },
            );
    }
}

_handleDeleteImage(franchiseImageId: number, franchiseImage?: string) {

  if (this.clientAnalysisData.id.length > 0 || this.clientAnalysisData.id >0) {

      this.stateEasyrouteService
          .deleteCompanyImageClient(franchiseImageId)
          .pipe(take(1))
          .subscribe(
              (resp) => {
                  this._toastService.displayWebsiteRelatedToast(
                      this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                      this._translate.instant('GENERAL.ACCEPT'),
                  );

                  //this.ngOnInit();
                  this.franchiseImages = this.franchiseImages.filter(
                      (image) => image.id !== franchiseImageId,
                  );
                 
                  this.detectChanges.detectChanges();
              },
              (error) => {
                  this._toastService.displayHTTPErrorToast(error.error);
              },
          );
  } 
}

}
