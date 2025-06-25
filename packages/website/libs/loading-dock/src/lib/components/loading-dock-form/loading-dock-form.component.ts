import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { LoadingService, secondsToAbsoluteTime, secondsToDayTimeAsString, ToastService } from '@optimroute/shared';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { ModalForceFinishedComponent } from '../loading-dock-modal/modal-force-finished/modal-force-finished.component';

@Component({
  selector: 'easyroute-loading-dock-form',
  templateUrl: './loading-dock-form.component.html',
  styleUrls: ['./loading-dock-form.component.scss']
})
export class LoadingDockFormComponent implements OnInit {

  loadingDockData: any;

  routeId: any = 0;

  downloadPackage: any [] = [];

  totalDownloadPackage: any = 0;

  loadPackage: any [] = [];

  totalLoadPackage : any = 0;

  hoverBad: boolean = false;

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

      this.routeId = params['id'];

      if (params['id'] !== 'new') {

          this.backendService
              .get('dock_route/' + params['id'])// Carbiar ruta
              .pipe(take(1),)
              .subscribe(
                  (resp: any) => {

                     this.loadingDockData = resp.data;



                     this.downloadPackage = this.loadingDockData.downloadPackage;

                     this.totalDownloadPackage = this.loadingDockData.downloadTotal;

                     this.loadPackage = this.loadingDockData.loadPackage;

                     this.totalLoadPackage = this.loadingDockData.loadTotal;

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
    this.router.navigateByUrl('loading-dock');
  }

  returnsHour(seconds: any){
    return secondsToDayTimeAsString(seconds);

  }

  returnHoursDiff(seconds){
    return secondsToAbsoluteTime(seconds);
  }
  returnsDate(date: any){
    if (date) {
      return moment(date).format('DD/MM/YYYY');
    } else {
      return 'No disponible'
    }

  }



  forceFinished () {
    const modal = this._modalService.open(ModalForceFinishedComponent, {
      backdrop: 'static',
      backdropClass: 'modal-backdrop-ticket',
      centered: true,
      size: 'sm',
      windowClass: 'modal-infor'
    });

    modal.componentInstance.title = this._translate.instant('LOADING_DOCK.FORM.FINALIZE_ROUTE');
    modal.componentInstance.subTitle = this._translate.instant('LOADING_DOCK.FORM.SUB_TITLE_FINALIZE_ROUTE');
    modal.componentInstance.message = this._translate.instant('LOADING_DOCK.FORM.MESSAGE_FINALIZE_ROUTE');
    modal.componentInstance.titleBotton = this._translate.instant('LOADING_DOCK.FORM.FINISH');

    modal.result.then((result) => {
      if (result) {
        this.loadingService.showLoading();
        this.backendService.put('dock_route_force_finished/' + this.routeId).pipe(take(1)).subscribe(()=>{
            this.loadingService.hideLoading();
            this.ngOnInit();
        }, error => {
            this.loadingService.hideLoading();
            this._toastService.displayHTTPErrorToast(error.status, error.error.error);
        })
      }
    }, (reason) => {

      this._toastService.displayHTTPErrorToast(reason.status, reason.error.error);
    });
  }

}
