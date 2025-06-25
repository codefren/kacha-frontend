import { take } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
declare var $: any;
import * as moment from 'moment-timezone';
import { VehicleMaintenance } from '@optimroute/backend';
import { sliceMediaString } from '@optimroute/shared';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';


@Component({
  selector: 'easyroute-vehicle-history-form',
  templateUrl: './vehicle-history-form.component.html',
  styleUrls: ['./vehicle-history-form.component.scss']
})
export class VehicleHistoryFormComponent implements OnInit {

  data: any;

  titleTranslate: string;


  MaintenanceDataFormReview: any = []

  vehicleMaintenace: VehicleMaintenance;

  sub_category_messages: any;

  loadingCategory: string = 'success';

  toggleSubcategory: boolean = true;

  me: boolean;

  imageError: string = '';
  franchiseImages: {
    id: number,
    urlImage: string,
    image?: string
  }[] = [];

  state: 'local' | 'server';

  show: boolean = true;

  

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private stateEasyrouteService: StateEasyrouteService,
    private toastService: ToastService,
    private translate: TranslateService,
    private loading: LoadingService,
    private _modalService: NgbModal,
    private authLocal: AuthLocalService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.load();

  }

  load() {
    this._activatedRoute.params.subscribe(params => {


      this.loading.showLoading();

      if (params['id'] !== 'new') {


        this.stateEasyrouteService.getVehcileMaintenance(params['id']).subscribe(
          ({ data }: any) => {

            this.vehicleMaintenace = data;
            
            this.franchiseImages = this.franchiseImages.concat(this.vehicleMaintenace.images);

            this.vehicleMaintenace.images = this.franchiseImages;

            this.MaintenanceDataFormReview = data.maintenanceReviewType;


            this.loading.hideLoading();


          },
          (error) => {
            this.loading.hideLoading();

            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
          },
        );



      } else {



      }

    });
  }


  getMaintenanceDataFormReview() {

    this.show = false;

    setTimeout(() => {
      this.stateEasyrouteService.getMaintenancePreferenceReview().subscribe(
        (data: any) => {

          this.MaintenanceDataFormReview = data.data;
          console.log(this.MaintenanceDataFormReview, 'this.MaintenanceDataFormReview')
          this.show = true;

          this.changeDetectorRef.detectChanges();

          this.loading.hideLoading();

        },
        (error) => {

          this.show = false;

          this.loading.hideLoading();

          this.toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
          );
        },
      );
    }, 1000);
  }



  /* find comenent */
  showcoment(id: any) {
    let comentary: any = this.vehicleMaintenace.maintenanceVehicleReview.find(x => x.maintenanceReviewTypeId === id);
    if (comentary) {
      return comentary.comentary;
    } else {
      return null;
    }

    /* return comentary.comentary; */
  }

  showComentary(id: any) {
    return this.vehicleMaintenace.maintenanceVehicleReview.find(x => x.maintenanceReviewTypeId === id) != null ? true : false;
  }



  _handleUpdateImage(image: any) {

    delete image.urlImage;

    if (this.vehicleMaintenace.id > 0) {  // crea la imagen de la compañia

      this.loading.showLoading();

      this.stateEasyrouteService.createCompanyImageClient({ ...image, deliveryPointId: this.vehicleMaintenace.id })
        .pipe(take(1))
        .subscribe((dataImage: any) => {
          console.log(dataImage.data, 'dataImage')
          image = {
            id: dataImage.data.id,
            urlimage: dataImage.data.image,
            image: dataImage.data.image
          };

          this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
            this.translate.instant('GENERAL.ACCEPT')
          );

          this.franchiseImages = this.franchiseImages.concat([image]);
          this.vehicleMaintenace.images = this.franchiseImages;

          this.loading.hideLoading();

          /* this.detectChanges.detectChanges(); */

        },
          (error) => {

            this.toastService.displayHTTPErrorToast(error.error);
            this.loading.hideLoading();
          });

    } else {   // cuando es nuevo se le asigna un id temporal a la imagen para poder filtrarlo

      image.id = Date.now();

      console.log(image);

      this.franchiseImages = this.franchiseImages.concat([image]);
      this.vehicleMaintenace.images = this.franchiseImages;
      this.changeDetectorRef.detectChanges();
    }
  }

  _handleDeleteImage(franchiseImageId: number, franchiseImage?: string) {

    if (this.vehicleMaintenace.id > 0) {

      this.stateEasyrouteService.deleteCompanyImageClient(franchiseImageId)
        .pipe(take(1))
        .subscribe(
          (resp) => {

            this.toastService.displayWebsiteRelatedToast(
              this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
              this.translate.instant('GENERAL.ACCEPT')
            );

            //this.ngOnInit();
            this.franchiseImages = this.franchiseImages.filter((image) => image.id !== franchiseImageId);
            this.vehicleMaintenace.images = this.franchiseImages;
            this.changeDetectorRef.detectChanges();
          },
          (error) => {
            this.toastService.displayHTTPErrorToast(error.error);
          }
        )

    } else {

      this.franchiseImages = this.franchiseImages.filter((image) => image.id !== franchiseImageId);
      this.vehicleMaintenace.images = this.franchiseImages;
      this.changeDetectorRef.detectChanges();
    }
  }

  formDate(date: string) {

    if (date.length > 0) {
      return moment(date).format('DD/MM/YYYY');
    }
    return 'No disponible';
  }

  sliceString(text: string) {
    return sliceMediaString(text, 40, '(min-width: 960px)');
  }

}
