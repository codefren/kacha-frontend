import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { LoadingService } from '../../../../../../shared/src/lib/services/loading.service';
import { take, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalViewPdfGeneralComponent } from 'libs/shared/src/lib/components/modal-view-pdf-general/modal-view-pdf-general.component';
import { TranslateService } from '@ngx-translate/core';
import { Profile } from 'libs/backend/src/lib/types/profile.type';
import { ProfileSettingsFacade } from '../../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { Subject } from 'rxjs';
import { secondsToAbsoluteTime } from 'libs/shared/src/lib/util-functions/day-time-to-seconds';

@Component({
  selector: 'easyroute-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  idRoute: any;

  summary: any;

  showSummary: boolean = false;

  corporate:any [];

  showCoporate: boolean = false;

  pointNoDelivered:any [];

  showPointNoDelivered: boolean = false;

  delay: any [];

  showDelay: boolean = false;

  pointNotDelivered: any [];

  showPointNotDelivered: boolean = false;

  albaranModified:any [];

  showAlbaranModified: boolean = false;

  productNotDelivered: any [];

  showProductNotDelivered: boolean = false;

  devolution: any [];

  showDevolution : boolean = false;

  secondRound :any [];

  showSecondRound : boolean = false;

  bill: any;

  showBill : boolean = false;

  showOutRange: boolean = false;

  outRange: any [];

  totales: any;

  totalPage: number = 1;

  profile: Profile;

  unsubscribe$ = new Subject<void>();

  costControl:any [];

  showCostControl: boolean = false;

  refueling:any [];

  showRefueling: boolean = false;

  packagingList: any =[];

  showPackaging: boolean = false;

  constructor(
    private router: Router,
    private _modalService: NgbModal,
    private loading: LoadingService,
    private toastService: ToastService,
    private _translate: TranslateService,
    private backendService: BackendService,
    private _activatedRoute: ActivatedRoute,
    private detectChanges: ChangeDetectorRef,
    private facadeProfile: ProfileSettingsFacade,
  ) { }

  ngOnInit() {

    this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
      
      if (loaded) {
          this.facadeProfile.profile$
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe((data) => {
                  this.profile = data;
              });
      }

    });

    this.load();
  }

  load(){

    this._activatedRoute.params.subscribe(({ id }) => {

      if (id === 'new') {

      } else {

        this.idRoute = id;

        this.showSummary = false;

        this.loading.showLoading();          

          this.backendService.get(`report_route_summary/${id}`).pipe(take(1)).subscribe(

              ({ data }) => {

                  this.summary = data;

                  this.showSummary = true;

                  this.loading.hideLoading();

                  this.detectChanges.detectChanges();

                  this.getCorporate();
                 
              },
              (error) => {

                this.showSummary = true;

                this.loading.hideLoading();

                  this.toastService.displayHTTPErrorToast(
                      error.status,
                      error.error.error,
                  );
              },
          );
      }
  });
  
  }

  getCorporate(){

    this.showCoporate = false;

    this.backendService.get(`report_route_corporate/${this.idRoute}`).pipe(take(1)).subscribe(

      ({ data }) => {

          this.corporate = data;

          this.showCoporate = true;

          this.detectChanges.detectChanges();

          this.getDelay();

      },
      (error) => {

        this.showCoporate = true;
        
          this.toastService.displayHTTPErrorToast(
              error.status,
              error.error.error,
          );
      },
  );
  }

  getDelay(){

    this.showDelay = false;

    this.backendService.get(`report_route_delay/${this.idRoute}`).pipe(take(1)).subscribe(

      ({ data }) => {

          
          this.delay = data;

          this.showDelay = true;

          this.detectChanges.detectChanges();

          this.getPointNoDelivered();
         
      },
      (error) => {

        this.showDelay = true;
        
          this.toastService.displayHTTPErrorToast(
              error.status,
              error.error.error,
          );
      },
  );
  }

  getPointNoDelivered(){

    this.showPointNoDelivered = false;

    this.backendService.get(`report_route_point_no_delivered/${this.idRoute}`).pipe(take(1)).subscribe(

      ({ data }) => {

          this.pointNoDelivered = data;

          this.showPointNoDelivered = true;

          this.detectChanges.detectChanges();

          this.getAlbaranModified();
         
      },
      (error) => {

        this.showPointNoDelivered = true;
        
          this.toastService.displayHTTPErrorToast(
              error.status,
              error.error.error,
          );
      },
  );
  }

  getAlbaranModified(){

    this.showAlbaranModified = false;

    this.backendService.get(`report_route_albaran_modified/${this.idRoute}`).pipe(take(1)).subscribe(

      ({ data }) => {

          
          this.albaranModified = data;

          this.showAlbaranModified = true;

          this.detectChanges.detectChanges();

          this.getProductsNotDeliveried();
     
      },
      (error) => {

        this.showAlbaranModified = true;
        
          this.toastService.displayHTTPErrorToast(
              error.status,
              error.error.error,
          );
      },
  );
  }

  getProductsNotDeliveried(){

    this.showProductNotDelivered = false;

    this.backendService.get(`report_route_products_no_delivered/${this.idRoute}`).pipe(take(1)).subscribe(

      ({ data }) => {
          
          this.productNotDelivered = data;

          this.showProductNotDelivered = true;

          this.detectChanges.detectChanges();

          this.getDevolution();
         
      },
      (error) => {

        this.showProductNotDelivered = true;
        
          this.toastService.displayHTTPErrorToast(
              error.status,
              error.error.error,
          );
      },
  );
  }

  getDevolution(){

    this.showDevolution = false;

    this.backendService.get(`report_route_devolution/${this.idRoute}`).pipe(take(1)).subscribe(

      ({ data }) => {

          
          this.devolution = data;

          this.showDevolution = true;

          if ((this.delay && this.delay.length > 0) 
          || (this.pointNoDelivered && this.pointNoDelivered.length > 0)
          || (this.albaranModified && this.albaranModified.length > 0)
          || (this.devolution && this.devolution.length > 0) 
          || (this.productNotDelivered && this.productNotDelivered.length > 0)
          || (this.costControl && this.costControl.length > 0)) {

            this.totalPage = this.totalPage + 1;
            
          }

          this.detectChanges.detectChanges();

          this.getSecondRound();
         
      },
      (error) => {

        this.showDevolution = true;
        
          this.toastService.displayHTTPErrorToast(
              error.status,
              error.error.error,
          );
      },
  );
  }

  getSecondRound(){

    this.showSecondRound = false;

    this.backendService.get(`report_route_second_round/${this.idRoute}`).pipe(take(1)).subscribe(

      ({ data }) => {

          
          this.secondRound = data;

          this.showSecondRound = true;

          this.detectChanges.detectChanges();

          this.getOutRange();
     
      },
      (error) => {

        this.showSecondRound = true;
        
          this.toastService.displayHTTPErrorToast(
              error.status,
              error.error.error,
          );
      },
  );
  }

  getOutRange(){

    this.showOutRange = false;

    this.backendService.get(`report_route_out_range/${this.idRoute}`).pipe(take(1)).subscribe(

      ({ data }) => {

          this.outRange = data;

          this.showOutRange = true;

          this.detectChanges.detectChanges();

          this.getBill();

      },
      (error) => {

        this.showOutRange = true;
        
          this.toastService.displayHTTPErrorToast(
              error.status,
              error.error.error,
          );
      },
    );
  }

  getBill(){

    this.showBill = false;

    this.backendService.get(`report_route_bill/${this.idRoute}`).pipe(take(1)).subscribe(

      ({ data }) => {
          
          this.bill = data;

          this.totales = data.totales;

          this.showBill = true;

          this.detectChanges.detectChanges();

          this.getCostControl();
         
      },
      (error) => {

        this.showBill = true;
        
          this.toastService.displayHTTPErrorToast(
              error.status,
              error.error.error,
          );
      },
  );
  }

  getCostControl(){

    this.showCostControl = false;

    this.backendService.get(`report_route_cost_control/${this.idRoute}`).pipe(take(1)).subscribe(

      ({ data }) => {

          this.costControl = data;

          this.showCostControl = true;

          this.detectChanges.detectChanges();

          this.getPackaging();

          

      },
      (error) => {

        this.showCostControl = true;
        
          this.toastService.displayHTTPErrorToast(
              error.status,
              error.error.error,
          );
      },
    );
  }

  getPackaging(){

    this.showPackaging = false;

    this.backendService.get(`report_route_boxes/${this.idRoute}`).pipe(take(1)).subscribe(

      ({ data }) => {

        this.packagingList = data;
        
        this.showPackaging = true;

        this.detectChanges.detectChanges();

        this.getRefueling();

      },
      (error) => {

        this.showPackaging = true;
        
          this.toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
          );
      },
    );

  }

  getRefueling(){

    this.showRefueling = false;

    this.backendService.get(`report_route_refueling/${this.idRoute}`).pipe(take(1)).subscribe(

      ({ data }) => {

        this.refueling = data;


        if ((this.bill && this.bill.list && this.bill.list.length > 0)
          || (this.secondRound && this.secondRound.length > 0) || (this.outRange && this.outRange.length > 0) 
          || (this.refueling && this.refueling.length > 0 || this.packagingList && this.packagingList.length > 0) ) {

            this.totalPage = this.totalPage + 1;
            
          }
        
        this.showRefueling = true;

        this.detectChanges.detectChanges();

      },
      (error) => {

        this.showRefueling = true;
        
          this.toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
          );
      },
    );

  }

  

  returnTable(){
    this.router.navigate(['report/route']);
  }
  
  openModalViewPdf(){

    let url ='report_route_download_detail/' + this.idRoute;
  
    
    const modal = this._modalService.open( ModalViewPdfGeneralComponent, {
      
      backdropClass: 'modal-backdrop-ticket',
  
      centered: true,
  
      windowClass:'modal-view-pdf',
  
      size:'lg'
  
    });

    modal.componentInstance.title = this._translate.instant('REPORT.DOWNLOAD_ALL');

    modal.componentInstance.url = url;
  }

  returnDate(date:any){
    if (date) {
      return moment(date).format('DD/MM/YYYY');
    } else {
      return '';
    }
    
  }

  returHourse(hour: any){
    if (hour) {
      return moment(hour).format('HH:mm');
    } else {
      return '--:--';
    }
    
  }

  returnDiff(timeTravel: any){
   return secondsToAbsoluteTime(timeTravel, true);

  }

  moduleCost(){
    if (this.profile &&
        this.profile.email !== '' &&
        this.profile.company &&
        this.profile.company &&
        this.profile.company.active_modules && this.profile.company.active_modules.find(x => x.id === 14)) {
  
        return true;
        
    } else {
  
        return false;
  
    }
  }

  decimal(numb) {

    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numb);

  }

  getHour( date: string ): string {
    return moment( date ).format('HH:mm');
  }

}
