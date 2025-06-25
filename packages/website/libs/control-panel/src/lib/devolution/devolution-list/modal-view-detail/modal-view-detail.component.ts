import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { ToastService } from '@optimroute/shared';
import { StateRoutePlanningService } from 'libs/state-route-planning/src/lib/state-route-planning.service';
declare var $: any;
import * as moment from 'moment-timezone';
@Component({
  selector: 'easyroute-modal-view-detail',
  templateUrl: './modal-view-detail.component.html',
  styleUrls: ['./modal-view-detail.component.scss']
})
export class ModalViewDetailComponent implements OnInit {

  id: any;

  table: any;

  products: any = [];

  data: any;

  deliveryNoteId: number;

  show : boolean = false;

  constructor(
    private toast: ToastService,
    public dialogRef: NgbActiveModal,
    private backendService: BackendService,
    private detectChanges: ChangeDetectorRef,
    private backend: BackendService,
    private _translate: TranslateService,
    private detectChange: ChangeDetectorRef,
    private _toastService: ToastService,
    private stateRoutePlanningService: StateRoutePlanningService,
  ) { }

  ngOnInit() {

    this.load();

  }

  load() {
  
    this.show = false;
        
    this.backend.get('route_planning/delivery_point/detailDevolution?routePlanningRouteDeliveryPointId='+ this.id).subscribe(
        (resp: any) => {
            
            this.data = resp.data;

            console.log( this.data, ' this.data');

            this.show = true;
          
            try {

                this.detectChange.detectChanges();

                this.cargar();
              
            } catch (e) { }
        },
        (error) => {

            this.show = true;

            this._toastService.displayHTTPErrorToast(
                error.status,
                error.error.error,
            );
        },
    );
        
    
    
  }

  cargar() {

    if (this.table) {
        this.table.clear();
    }


    let table = '#details_devolution';
    this.table = $(table).DataTable({
        destroy: true,
        stateSave: false,
        language: environment.DataTableEspaniol,
        data: this.data.listDevolution,
        ordering: false,
        lengthMenu: [10],
        dom: `
            <"top-button-hide"><'point no-scroll-x table-responsive't>
            <'row reset'
            <'col-lg-12 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-center align-items-md-center'p>
            >
        `,
        columns: [
            {
                data: 'nameProduct',
                className:'table-devolution'
            },
            
            {
                data: 'quantityProduct',
                className:'table-devolution'
            },
            
            

        ],
        buttons: [
            {
                extend: 'colvis',
                text: this._translate.instant('GENERAL.SHOW/HIDE'),
                columnText: function (dt, idx, title) {
                    return idx + 1 + ': ' + title;
                },
            },
        ],
    });
    $('easyroute-delivery-details').find('#details_filter').html(`
        <div class="row p-0 justify-content-sm-end justify-content-center">
            <div class="input-group input-search" style="width: initial !important;">
                <input id="search-modal" type="text" class="form-control pull-right input-personalize-datatable" placeholder="Buscar">
                <span class="input-group-append">
                    <span class="input-group-text table-append">
                        <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                    </span>
                </span>
            </div>
        </div>
    `);

    $('#search-modal').on('keyup', function () {
        $(table)
            .DataTable()
            .search(this.value)
            .draw();
    });

    $('.dataTables_filter').removeAttr('class');
        
  }

  formartDate(date:any){
      return moment(date).format('DD/MM/YYYY');

  }
  formartHour(date:any){
    return moment(date).format('HH:mm');

}
  close(value: any) {
    this.dialogRef.close(value);
  }

}
