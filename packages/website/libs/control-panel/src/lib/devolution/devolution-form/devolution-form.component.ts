import { take } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
declare var $: any;
import * as moment from 'moment-timezone';
import { BackendService } from '../../../../../backend/src/lib/backend.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { ActivatedRoute } from '@angular/router';
import { StateRoutePlanningService } from '../../../../../state-route-planning/src/lib/state-route-planning.service';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';

@Component({
  selector: 'easyroute-devolution-form',
  templateUrl: './devolution-form.component.html',
  styleUrls: ['./devolution-form.component.scss']
})
export class DevolutionFormComponent implements OnInit {

  table: any;

  products: any = [];

  data: any;

  deliveryNoteId: number;

  show : boolean = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
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
    this._activatedRoute.params.subscribe((params) => {
        if (params['id'] !== 'new') {
            this.stateRoutePlanningService
                .getDevolutionDetail(params['id'])
                .subscribe(
                    (resp: any) => {
                        
                        this.data = resp.data;

                        this.show = true;
                      
                        try {
                            this.detectChange.detectChanges();
                            this.cargar();
                            /* if (!this.data.isMultiDeliveryNote) {
                               
                                this.cargarBillnoPayment();
                            } else {
                               
                            } */
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
        } else {
            
        }
    });
    
  }

  cargar() {


    //this.backend.

  

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
                lengthMenu: [20],
                dom: `
                    <"top-button-hide"><'point no-scroll-x table-responsive't>
                    <'row reset'
                    <'col-lg-12 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-center align-items-md-center'p>
                    >
                `,
                columns: [
                    {
                        data: 'nameProduct',
                    },
                   
                    {
                        data: 'quantityProduct',
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

}
