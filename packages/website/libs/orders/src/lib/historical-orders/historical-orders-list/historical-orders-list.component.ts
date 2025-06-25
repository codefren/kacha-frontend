import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Filter } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { ToastService } from '@optimroute/shared';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { Subject } from 'rxjs';
import { WebSocketService } from '../../products.websocket';
import * as moment from 'moment-timezone';
import { take, takeUntil } from 'rxjs/operators';
import { ModalGeneralFiltersComponent } from '../../modal-general-filters/modal-general-filters.component';
declare var $: any;


@Component({
  selector: 'easyroute-historical-orders-list',
  templateUrl: './historical-orders-list.component.html',
  styleUrls: ['./historical-orders-list.component.scss']
})
export class HistoricalOrdersListComponent implements OnInit {
  
  table: any;
  private unsubscribe$ = new Subject<void>();
  timeInterval: any;
  today: string;
  nextDay: boolean = false;
  change: string = 'orders';
    
  filter: any = {
    userAsignedId: '',
    dateFrom: '',
    dateTo: '',
  };

  refreshTime: number = environment.refresh_datatable_assigned;
  
    constructor(
        private authLocal: AuthLocalService,
        private stateEasyrouteService: StateEasyrouteService,
        private _toastService: ToastService,
        private _translate: TranslateService,
        private Router: Router,
        private changeDetect: ChangeDetectorRef,
        private _modalService: NgbModal,
        private preferencesFacade: PreferencesFacade,
        private rendered2: Renderer2,
        private ws: WebSocketService,
    ) { }

    ngOnInit() {
        this.ws.connect();
        
        this.ws.sync.pipe(takeUntil(this.unsubscribe$)).subscribe((data)=>{
            if(data){
                this.table.ajax.reload();
            }
        })
       
        this.preferencesFacade.panelControlPreferencs$.pipe(take(1)).subscribe((data) => {
                
            /* this.refreshTime =
                data.refreshTime !== null && data.refreshTime > 0
                    ? data.refreshTime * 1000
                    : this.refreshTime; */
        
            this.nextDay = data.assignedNextDay;
        
            /* this.initMoment();
            this.cargar(); */
        });
        this.initMoment();
        this.cargar();
    }

    initMoment() {
        moment()
            .tz('Europe/Madrid')
            .format();
        this.today = this.getToday( this.nextDay );
    }

    getToday( nextDay: boolean = false ) {
    
        if ( nextDay ) {
            return  moment(new Date().toISOString()).add( 1, 'day' ).format('YYYY-MM-DD');
        }
            
        return moment( new Date().toISOString() ).format('YYYY-MM-DD');
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this.ws.sync.next(false);
        this.ws.desconnect();
        this.table.destroy();
    }

    cargar() {
        if ( this.table ) {
            this.table.clear(); // limpia la tabla sin destruirla
        }
    
        let url =
            environment.apiUrl +
            'order_historical_order_datatables?dateFrom=' +
            this.filter.dateFrom +
            '&dateTo=' +
            this.filter.dateTo +
            '&userAsignedId=' +
            this.filter.userAsignedId;
    
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#historical_orders';
        this.table = $(table).DataTable({
            destroy: true,
            processing: true,
            serverSide: true,
            stateSave: true,
            order:[ 5, 'desc'],
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            initComplete : function (settings, data) {
                settings.oClasses.sScrollBody="";
                
            },
            cache: false,
            lengthMenu: [50, 100],
            dom: `
            <'row'
                <'col-sm-8 col-lg-10 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
                <'col-sm-4 col-lg-2 col-12 label-search'f>
            >
            <'row p-0 reset'
            <'offset-sm-6 offset-lg-6 offset-5'>
            <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>>
            <"top-button-hide"><'table-responsive't>
            <'row reset'
                <'col-lg-5 col-md-5 col-12 pl-4 pr-4 d-flex flex-column justify-content-center align-items-cente'i>
                <'col-lg-7 col-md-7 col-12 pl-5 pr-5 d-flex flex-column justify-content-center align-items-lg-start align-items-md-start'p>
            >
        `,
            headerCallback: ( thead, data, start, end, display ) => {               
                $('.buttons-collection').html('<i class="far fa-edit"></i>'+ ' ' + this._translate.instant('GENERAL.SHOW/HIDE')) 
            },
            buttons: [
                {
                    extend: 'colvis',
                    text: this._translate.instant('GENERAL.SHOW/HIDE'),
                    columnText: function(dt, idx, title) {
                        return title;
                    },
                },
            ],
            language: environment.DataTableEspaniol,
            ajax: {
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: tok,
                },
                error: (xhr, error, thrown) => {
                    let html = '<div class="container" style="padding: 30px;">';
                    html +=
                        '<span class="text-orange">Ha ocurrido un errror al procesar la informacion.</span> ';
                    html +=
                        '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
                    html += '</div>';
    
                    $('#companies_processing').html(html);
    
                    $('#refrescar').click(() => {
                        this.cargar();
                    });
                },
        },
        columns: [

            { data: 'code', title: this._translate.instant('ORDERS.ORDERS_LIST.CODE') },
            {
                data: 'delivery_point.name',
                title: this._translate.instant('ORDERS.ORDERS_HISTORICAL.CLIENT'),
                render: (data, type, row) => {
                    if (data == null || data == 0) {
                        return '<span class="text center" aria-hidden="true"> No disponible</span>';
                    } else {
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            '">' +
                            data +
                            '</span>'
                        );
                    }
                },
            },
            {
                data: 'orderDate',
                title: this._translate.instant('ORDERS.ORDERS_LIST.DATE'),
                render: (data, type, row) => {
                    return moment(data).format('DD/MM/YYYY');
                },
            },
            {
                data: 'preparationStart',
                title: this._translate.instant('ORDERS.ORDERS_HISTORICAL.RECEPTION_DATE'),
                render: (data, type, row) => {

                    if ( data ) {
                        return moment(data).format('DD/MM/YYYY HH:mm:ss');
                    }

                    return 'No disponible'
                },
            },
            {
                data: 'preparationEnd',
                title: this._translate.instant('ORDERS.ORDERS_HISTORICAL.DELIVER_DATE'),
                render: (data, type, row) => {

                    if ( data ) {
                        return (`<span>${ moment( data ).format('DD/MM/YYYY HH:mm:ss') }</span>`)
                    }

                    return 'No disponible';
                },
            },
            {
                data: 'status_order.name',
                title: this._translate.instant('GENERAL.STATE_ORDER'),
                render: (data, type, row) => {

                    return (
                        '<div class="text-center warning ' +
                        '">' +
                        data +
                        '</div>'
                    );
                },
            },
            {
                data: 'created_by_user',
                title: this._translate.instant('COMPANIES.CREATED_BY'),
                render: (data, type, row) => {
                    return data !== '' ? data : 'No disponible';
                },
            },
            {
                data: 'observations',
                visible: false,
                title: this._translate.instant('ORDERS.ORDERS_FORM.OBSERVATIONS'),
                render: (data, type, row) => {
                    let description = data;
                    if (description != null && description.length > 80) {
                        description = description.substr(0, 79) + '...';
                    } else {
                        return data !== null ? data : 'No disponible';
                    }
                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        data +
                        '">' +
                        description +
                        '</span>'
                    );
                },
            },
            /* {
                data: 'fromApp',
                visible: true,
                title: this._translate.instant('ORDERS.ORDERS_HISTORICAL.WEB'),
                render: (data, type, row) => {
                    if (data == '1') {
                        return (`
                            <div class="justify-content-center row reset">
                            <div class="success-chip">
                                <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                            </div>
                            </div>
                        `);
                    } else {
                        return (`
                        <div class="justify-content-center row reset">
                            <div class="times-chip">
                            <i class="fas fa-times mt-2"></i>
                            </div>  
                        </div> 
                        `);
                    }
                },
            }, */
            {
                data: 'fromApp',
                visible: true,
                title: this._translate.instant('ORDERS.ORDERS_HISTORICAL.APP'),
                render: (data, type, row) => {
                    if (data == '1') {
                        return (`
                            <div class="justify-content-center row reset">
                            <div class="success-chip">
                                <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                            </div>
                            </div>
                        `);
                    } else {
                        return (`
                        <div class="justify-content-center row reset">
                            <div class="times-chip">
                            <i class="fas fa-times mt-2"></i>
                            </div>  
                        </div> 
                        `);
                    }
                },
            },
            {
                data: 'user_seller',
                title: this._translate.instant('GENERAL.COMMERCIAL'),
                render: (data, type, row) => {
                    if (data) {
                        return (`
                            <div class="justify-content-center row reset">
                            <div class="success-chip">
                                <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                            </div>
                            </div>
                        `);
                    } else {
                        return (`
                        <div class="justify-content-center row reset">
                            <div class="times-chip">
                            <i class="fas fa-times mt-2"></i>
                            </div>  
                        </div> 
                        `);
                    }
                },
            },
            {
                data: 'sentFtp',
                visible: true,
                title: this._translate.instant('ORDERS.SENT_FTP'),
                render: (data, type, row) => {
                    if (data == true) {
                        return (`
                            <div class="justify-content-center row reset">
                            <div class="success-chip">
                                <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                            </div>
                            </div>
                        `);
                    } else {
                        return (`
                        <div class="justify-content-center row reset">
                            <div class="times-chip">
                            <i class="fas fa-times mt-2"></i>
                            </div>  
                        </div> 
                        `);
                    }
                },
            },
            {
                data: null,
                sortable: false,
                searchable: false,
                title: this._translate.instant('GENERAL.ACTIONS'),
                render: (data, type, row) => {
                    let botones = '';
                    botones +=
                        `<div class="text-center detail">
                            <img class="icons-datatable point" src="assets/icons/optimmanage/create-outline.svg">
                        </div>`;
                        
                    return botones;
                },
            },
        ]
        });
        $('.dataTables_filter').html(`
            <div class="row p-0 justify-content-sm-end justify-content-center">
                <div class="input-group">
                    <input id="search" type="text" class="form-control pull-right input-personalize-datatable" placeholder="Buscar">
                    <span class="input-group-append">
                        <span class="input-group-text table-append">
                            <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                        </span>
                    </span>
                </div>
            </div>
        `);
        $('#search').on('keyup', function() {
            $(table)
                .DataTable()
                .search(this.value)
                .draw();
        });
    
        $('.dataTables_filter').removeAttr('class');
    
        this.initEvents(table + ' tbody', this.table);
    }

    initEvents(tbody: any, table: any, that = this) {
        $(tbody).unbind();
        window.clearInterval(this.timeInterval);
        this.editar(tbody, table);
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'div.detail', function() {
            let data = table.row($(this).parents('tr')).data();
        
            that.Router.navigate([`/orders/historical-orders/${data.id}`]);
        });
    }

    changePage(name: string){
        
    switch (name) {
        case 'preparation':
            this.change = name;
            this.Router.navigate(['/orders/historical-preparation']);
            console.log('entro al router preparation');

            break;

        case 'orders':
            this.change = name;
            this.Router.navigate(['/orders/historical-orders']);
            console.log('entro al router orders');

        break;

        default:
            break;
    }
    }
    
    filterOpen(){
        const modal = this._modalService.open(ModalGeneralFiltersComponent, {
            size: 'xl',
            backdrop: 'static',
            windowClass: 'modal-filter-orders'
        });

        modal.componentInstance.filter = this.filter;
        
        modal.result.then(
            (data) => {
                if (data) {
                    console.log(data);
                    this.filter = data;
        
                    this.cargar();
                }
            },
            (reason) => {},
        );
    }

}
