import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { BackendService } from '../../../../../backend/src/lib/backend.service';
import { take } from 'rxjs/operators';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import * as moment from 'moment-timezone';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { ModalViewPdfGeneralComponent } from '@optimroute/shared';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'easyroute-sheet-route-form',
  templateUrl: './sheet-route-form.component.html',
  styleUrls: ['./sheet-route-form.component.scss']
})
export class SheetRouteFormComponent implements OnInit {

  select: string ='sheetRoute';

  change = {
      sheetRoute: 'sheetRoute',
      deliveryNotes: 'deliveryNotes',
      summary: 'summary',
  };


  roadMapData: any;
  
  routeId: number = 0;

  routePlanningRouteId: number =0;


  constructor(
    private detectChanges: ChangeDetectorRef,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private backendService: BackendService,
    private _toastService: ToastService,
    private _modalService: NgbModal,
    private _translate:TranslateService,
    private loadingService: LoadingService,
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
              .get('route_sheet_route/' + params['id'])
              .pipe(take(1),)
              .subscribe(
                  (resp: any) => {

                     this.roadMapData = resp.data;

                     this.routePlanningRouteId = resp.data.routePlanningRouteId;

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

  changePage(name: string) {
        
    this.select = this.change[name];

    this.detectChanges.detectChanges();
  }

  returnsList(){
    this.router.navigateByUrl('sheet-route');
  }

  openModalViewPdf(){
    
    
    const modal = this._modalService.open( ModalViewPdfGeneralComponent, {
      
      backdropClass: 'modal-backdrop-ticket',
  
      centered: true,
  
      windowClass:'modal-view-pdf',
  
      size:'lg'
  
    });

    modal.componentInstance.url='route_sheet_route/print/' + this.routeId;

    modal.componentInstance.title = this._translate.instant('SHEET_ROUTE.NAME');
    
    
  }
  
  returnsHour(date: any){
    if (date) {
      return moment(date).format('HH:mm');
    } else {
      return 'No disponible'
    }
    

  }
}
