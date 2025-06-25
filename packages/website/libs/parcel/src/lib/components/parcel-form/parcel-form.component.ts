import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendService } from '../../../../../backend/src/lib/backend.service';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import * as moment from 'moment-timezone';

import { take } from 'rxjs/operators';
import { getToday } from '../../../../../shared/src/lib/util-functions/date-format';
@Component({
  selector: 'easyroute-parcel-form',
  templateUrl: './parcel-form.component.html',
  styleUrls: ['./parcel-form.component.scss']
})
export class ParcelFormComponent implements OnInit {

  
  parcelData: any;

  routeId: any;
  
  constructor(
    private detectChanges: ChangeDetectorRef,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private backendService: BackendService,
    private _toastService: ToastService,
    private _modalService: NgbModal,
    private _translate:TranslateService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.load();
  }

  load(){

    this.loadingService.showLoading();

    this._activatedRoute.params.subscribe((params) => {
  
      this.routeId =params['id'];

      if (params['id'] !== 'new') {

          this.backendService
              .get('route_planning/route_package_detail/' + params['id'])
              .pipe(take(1),)
              .subscribe(
                  (resp: any) => {

                     
                     this.parcelData = resp.data;

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


  returnsList(){
    this.router.navigateByUrl('parcel');
  }

  openModalViewPdf(){

    console.log('abrir ver pdf')
    
   /*  const modal = this._modalService.open( ModalViewPdfGeneralComponent, {
      
      backdropClass: 'modal-backdrop-ticket',
  
      centered: true,
  
      windowClass:'modal-view-pdf',
  
      size:'lg'
  
    });

    let url = 'delivery_point_analysis_pdf/'+ this.idClient ; 

    url += this.dates.from ? '?from=' + this.dates.from : '';

    url += this.dates.to ? '&to=' + this.dates.to : '';



    modal.componentInstance.url= url;

    modal.componentInstance.title = this._translate.instant('CLIENTS.CLIENTS_ANALYSIS.CUSTOMER_ANALYSIS'); */
    
    
  }
  
  returnsHour(date: any){
    if (date) {
      return moment(date).format('HH:mm');
    } else {
      return 'No disponible'
    }
    

  }


}
