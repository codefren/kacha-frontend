import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthLocalService } from '../../../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../../../apps/easyroute/src/environments/environment';
import { Router } from '@angular/router';
import { BackendService } from '../../../../../../../backend/src/lib/backend.service';
import { ToastService } from '../../../../../../../shared/src/lib/services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { sliceMediaString } from '@optimroute/shared';

declare var $: any;

@Component({
  selector: 'easyroute-modal-incidencias',
  templateUrl: './modal-incidencias.component.html',
  styleUrls: ['./modal-incidencias.component.scss']
})
export class ModalIncidenciasComponent implements OnInit {

  tableIncident: any;

  routePlanningRouteId: any;

  numberLength: any;

  incidentList:any;

  showIncident: boolean = true ;

  constructor(
    private authLocal: AuthLocalService,
    private Router: Router,
    private _translate: TranslateService,
    private backendService: BackendService,
    private _toastService: ToastService,
    public activeModal: NgbActiveModal,
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {

   this.getIncident();

  }

  getIncident(){

    this.showIncident = false;

    this.backendService
    .get('route_planning/route/'+ this.routePlanningRouteId + '/incident_list')
    .pipe(
        take(1),
       
    )
    .subscribe(
        (resp: any) => {


         this.incidentList = resp.data;


         this.showIncident  = true; 

         this.detectChanges.detectChanges()
    
        },
        (error) => {

            this.showIncident  = true; 

            this._toastService.displayHTTPErrorToast(
                error.status,
                error.error.error,
            );
        },
    );
  }

  sliceString( text: string ) {
    return sliceMediaString( text, 35, '(min-width: 960px)' );
}

 

  donwload(){
      console.log('abrir descargar ticket');
  }
  
  downloadPdf(){
      console.log('descargar como pdf');
  }

}
