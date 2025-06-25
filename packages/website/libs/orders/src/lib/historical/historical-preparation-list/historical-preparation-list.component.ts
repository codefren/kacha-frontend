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
import { TicketModalComponent } from '../ticket-modal/ticket-modal.component';
declare var $: any;


@Component({
  selector: 'easyroute-historical-preparation-list',
  templateUrl: './historical-preparation-list.component.html',
  styleUrls: ['./historical-preparation-list.component.scss']
})

export class HistoricalPreparationListComponent implements OnInit {
  
    table: any;
    private unsubscribe$ = new Subject<void>();
    timeInterval: any;
    today: string;
    nextDay: boolean = false;
    change: string = 'preparation';
    
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
            'order_historical_preparation_datatables?dateFrom=' +
            this.filter.dateFrom +
            '&dateTo=' +
            this.filter.dateTo +
            '&userAsignedId=' +
            this.filter.userAsignedId;
    
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#historical_preparation';
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
                {
                    data: 'company.name',
                    title: this._translate.instant('ORDERS.ORDERS_HISTORICAL.STORE'),
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
                { data: 'code', title: this._translate.instant('ORDERS.ORDERS_HISTORICAL.ORDER') },
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
                    data: 'preparationStart', // fecha recepción
                    title: this._translate.instant('ORDERS.ORDERS_HISTORICAL.RECEPTION_DATE'),
                    render: ( data, type, row ) => {
                        if ( data ) {
                            return (`<span>${ moment( data ).format('DD/MM/YYYY HH:mm:ss') }</span>`);
                        }

                        return 'No disponible';
                    }
                },
                {
                    data: 'preparationEnd', //fecha entrega
                    title: this._translate.instant('ORDERS.ORDERS_HISTORICAL.DELIVER_DATE'),
                    render: ( data, type, row ) => {
                        if ( data ) {
                            return (`<span>${ moment( data ).format('DD/MM/YYYY HH:mm:ss') }</span>`);
                        }

                        return 'No disponible';
                    }
                },
                {
                    data: 'user_assigned',
                    title: this._translate.instant('ORDERS.ORDERS_HISTORICAL.ASSIGNED'),
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
                    data: 'created_at',
                    title: this._translate.instant('ORDERS.ORDERS_HISTORICAL.ENTRY_TIME'),
                    render: (data, type, row) => {
                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        '">' +
                        moment(data).format('HH:mm') +
                        '</span>'
                    );
                    },
                },
                {
                    data: 'preparationStart',
                    title: this._translate.instant('ORDERS.ORDERS_HISTORICAL.ASSIGNED_ORDER'),
                    render: (data, type, row) => {
                        if(data)
                        {
                            return (
                                '<span data-toggle="tooltip" style="color:#afe24e;" data-placement="top" title="' +
                                '">' +
                                moment(data).format('HH:mm') +
                                '</span>'
                            );
                        }else {
                            return (
                                '<span> </span>'
                            );
                        }
                   
                    },
                },
                {
                    data: 'preparationEnd',
                    title: this._translate.instant('ORDERS.ORDERS_HISTORICAL.TICKET_ATTACHED'),
                    render: (data, type, row) => {
                        if(data)
                        {
                            return (
                                '<span data-toggle="tooltip" style="color:#afe24e;" data-placement="top" title="' +
                                '">' +
                                moment(data).format('HH:mm') +
                                '</span>'
                            );
                        }else{
                            return (
                                '<span> </span>'
                            );
                        }
                    }
                },
                {
                    data: 'preparationTime',
                    title: this._translate.instant('ORDERS.ORDERS_HISTORICAL.PREPARATION_TIME'),
                    render: (data, type, row) => {
                        if(data !== '')
                        {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                '">' +
                                data + 
                                ' min</span>'
                            );
                        }else{
                            return (
                                '<span> </span>'
                            );
                        }
                    },
                },
                {
                    data: 'deliveryEnd',
                    title: this._translate.instant('ORDERS.ORDERS_HISTORICAL.ORDER_DELIVERED'),
                    render: (data, type, row) => {
                        if(data)
                        {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                '">' +
                                moment(data).format('HH:mm') +
                                '</span>'
                            );
                        }else{
                            return (
                                '<span> </span>'
                            );
                        }
                    }
                },
                {
                    data: 'ticketTotal',
                    title: this._translate.instant('ORDERS.ORDERS_HISTORICAL.TICKET_COST'),
                    render: (data, type, row) => {
                        if (data == null || data == 0) {
                            return '<span class="text center" aria-hidden="true"> No disponible</span>';
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                '">' +
                                data + 
                                ' €</span>'
                            );
                        }
                    },
                },
                {
                    data: 'ticket',
                    title: this._translate.instant('ORDERS.ORDERS_HISTORICAL.SEE_TICKET'),
                    render: (data, type, row) => {
                        if (data == null || data == 0) {
                            return '<img class="icons-datatable point" src="assets/icons/optimmanage/ticket-gris.svg">';
                        } else {
                            return (`
                                <div class="row ticket justify-content-center backgroundColorRow">
                                    <img class="icons-datatable point" src="assets/icons/optimmanage/ticket.svg">
                                </div>
                            `);
                        }
                    },
                },
                {
                    data: null,
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('ORDERS.ORDERS_HISTORICAL.DETAIL'),
                    render: (data, type, row) => {
                        let botones = '';
                        botones +=
                            `<div class="text-center detail point">
                                <i class="fas fa-expand-arrows-alt"></i>
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
        this.showTicket(tbody, table);
    }
  
    editar(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'div.detail', function() {
            let data = table.row($(this).parents('tr')).data();
        
            that.Router.navigate([`/orders/historical-preparation/${data.id}`]);
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
        console.log('enviando al modal', this.filter);

        const modal = this._modalService.open(ModalGeneralFiltersComponent, {
            size: 'xl',
            backdrop: 'static',
            windowClass: 'modal-filter-orders'
        });
        
        modal.componentInstance.filter = this.filter;
    
        modal.result.then(
            (data) => {
                if (data) {
                    console.log('lo que se recibe del modal', data);
                    this.filter = data;
    
                    this.cargar();
                }
            },
            (reason) => {},
        );
    }

    showTicket(tbody: any, table: any, that = this) {
        console.log('aqe');
        $(tbody).on('click', 'div.ticket', function() {
            let data = table.row($(this).parents('tr')).data();
            that.modalTicket(data);
            console.log(data, 'data')
        });
    }

    modalTicket(data: any) {

        const modal = this._modalService.open(TicketModalComponent, {
            size: 'sm',
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            windowClass: 'modal-Ticket',
            centered: true,
        });
        
        modal.componentInstance.data = data;
    }

}
