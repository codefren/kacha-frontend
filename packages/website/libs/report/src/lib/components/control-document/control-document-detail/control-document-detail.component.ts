import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { LoadingService, ModalViewPdfGeneralComponent, ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
import { secondsToAbsoluteTimeAlterne } from 'libs/shared/src/lib/util-functions/time-format';


@Component({
  selector: 'easyroute-control-document-detail',
  templateUrl: './control-document-detail.component.html',
  styleUrls: ['./control-document-detail.component.scss']
})
export class ControlDocumentDetailComponent implements OnInit {
  
  idRoute: any;

  summary: any;

  showSummary: boolean = false;

  corporate:any [];

  showCoporate: boolean = false;

  unvisitedClient:any [];

  showUnvisitedClient: boolean = false;

  delay: any [];

  showDelay: boolean = false;

  pointNotDelivered: any [];

  showPointNotDelivered: boolean = false;

  showOutRange: boolean = false;

  outRange: any [];

  showRefueling: boolean = false;

  refueling: any [];

  totales: any;

  totalPage: number = 1;
  
  constructor(
    private router: Router,
    private _modalService: NgbModal,
    private loading: LoadingService,
    private toastService: ToastService,
    private _translate: TranslateService,
    private backendService: BackendService,
    private _activatedRoute: ActivatedRoute,
    private detectChanges: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.load();
  }

  load(){

    this._activatedRoute.params.subscribe(({ id }) => {

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

          this.getUnvisitedClient();
         
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

  getUnvisitedClient(){

    this.showUnvisitedClient = false;

    this.backendService.get(`report_route_point_no_delivered/${this.idRoute}`).pipe(take(1)).subscribe(

      ({ data }) => {

          this.unvisitedClient = data;

          this.showUnvisitedClient = true;

          this.detectChanges.detectChanges();

          this.getOutRange();
         
      },
      (error) => {

        this.showUnvisitedClient = true;
        
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

          if ((this.delay.length > 0) 
          || (this.unvisitedClient.length > 0)
          || (this.outRange.length > 0)) {

            this.totalPage = this.totalPage + 1;
            
          }

          this.detectChanges.detectChanges();

          this.getRefueling();

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

  getRefueling(){

    this.showRefueling = false;

    this.backendService.get(`report_control_document_refueling/${this.idRoute}`).pipe(take(1)).subscribe(

      ({ data }) => {
          
          this.refueling = data;

          this.showRefueling = true;

          if ((this.refueling.length > 0)) {

            this.totalPage = this.totalPage + 1;
            
          }

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
  
  openModalViewPdf(){

    let url ='report_control_document_detail_pdf/' + this.idRoute;
    
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
   return secondsToAbsoluteTimeAlterne(timeTravel, true);

  }

  returnTable(){
    this.router.navigate(['report/control-Documents']);
  }

  numerPage(value: number) {

    if (this.totalPage === 3 && value == 2) {
      return value;
    }

    if (this.totalPage === 2 && value == 3) {
      return this.totalPage;
    }

    return value;

  }

}
