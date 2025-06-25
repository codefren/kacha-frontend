import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthLocalService } from '../../../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../../../apps/easyroute/src/environments/environment';
import { BackendService } from '../../../../../../../backend/src/lib/backend.service';
import { ToastService } from '../../../../../../../shared/src/lib/services/toast.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
@Component({
  selector: 'easyroute-modal-extra-boxes',
  templateUrl: './modal-extra-boxes.component.html',
  styleUrls: ['./modal-extra-boxes.component.scss']
})
export class ModalExtraBoxesComponent implements OnInit {

  tableExtraboxes: any;

  routePlanningRouteId: any;

  numberLength: any;

  extraBoxesList:any;

  showBoxes: boolean = true ;

  constructor(
    private Router: Router,
    private backendService: BackendService,
    private _toastService: ToastService,
    public activeModal: NgbActiveModal,
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.getExtraBox();

  }

  getExtraBox(){

    this.showBoxes = false;

    this.backendService
    .get('route_planning/route/'+ this.routePlanningRouteId + '/extra_boxes_list')
    .pipe(
        take(1),
       
    )
    .subscribe(
        (resp: any) => {

            console.log(resp, 'respues si hay cajas extras')

            this.extraBoxesList = resp;


          this.showBoxes  = true; 

         this.detectChanges.detectChanges()
    
        },
        (error) => {

            this.showBoxes  = true; 

            this._toastService.displayHTTPErrorToast(
                error.status,
                error.error.error,
            );
        },
    );
  }



  redirecto(data: any){
    this.Router.navigate([`/control-panel/assigned//${data.id}`]);

    this.activeModal.close(true);
  }
}
