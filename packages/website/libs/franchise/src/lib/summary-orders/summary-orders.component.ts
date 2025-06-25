

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { NgbDate, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerI18n, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { ToastService, dateToObject, getToday, objectToString, getDateMomentHours, getDateMoment, Language, MomentDateFormatter, CustomDatepickerI18n, ToDayTimePipe } from '@optimroute/shared';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';

import { take, map, takeUntil } from 'rxjs/operators';
 
import * as moment from 'moment-timezone';
import { ModalFiltersComponent } from './modal-filters/modal-filters.component';
import { secondsToAbsoluteTimeAlterne } from 'libs/shared/src/lib/util-functions/time-format';
import { Subject } from 'rxjs';

import { WebSocketService } from './../../../../orders/src/lib/products.websocket';
import { PreferencesFacade } from '@optimroute/state-preferences';

declare var $: any;

@Component({
  selector: 'easyroute-summary-orders',
  templateUrl: './summary-orders.component.html',
  styleUrls: ['./summary-orders.component.scss'],
  providers: [
    Language,
    {provide: NgbDateParserFormatter, useClass: MomentDateFormatter},
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
})
export class SummaryOrdersComponent implements OnInit {

  dateSearchFrom: FormControl = new FormControl( dateToObject( getToday() ) );
  dateSearchTo: FormControl = new FormControl( dateToObject( getToday() ) );

  
  table: any;
  franchiseList: any[] = [];
  loading: 'loading' | 'success' | 'error' = 'loading';

  statusList: any[] = [];
  
  idCompany: string = '';

  from: string = getToday();
  to: string = getToday();
  dateMax: any;

  filter: any = {
    profileId: '',
    idCompany: '',
    statusId: '',
    zoneId: '',
    dateFrom: getToday(),
    dateTo: getToday(),
  };
  multiStoreTotalSummary: any;
  showInfoDetail: boolean = true;
  zones: any;

  private unsubscribe$ = new Subject<void>();

  timeInterval: any;
  refreshTime: number = environment.refresh_datatable_assigned;

  constructor(
    private dialog: NgbModal,
    public _translate: TranslateService,
    private authLocal: AuthLocalService,
    private Router: Router,
    private stateEasyrouteService: StateEasyrouteService,
    private preferencesFacade: PreferencesFacade,
    private toastService: ToastService,
    private ws: WebSocketService
  ) { }


  ngOnInit() {

    this.ws.connect();

    this.ws.sync.pipe(takeUntil(this.unsubscribe$)).subscribe((data)=>{
        if(data){
            this.table.ajax.reload();
            this.getResument();
        }
    });
    
    this.getStatus();
    this.getFranchises();
    this.setZone();
    this.initMoment();
    this.load();
    this.getResument();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.ws.sync.next(false);
    this.ws.desconnect();
    this.table.destroy();
  }

  initMoment() {
    moment()
        .tz('Europe/Madrid')
        .format();
  }

  getFranchises() {
    this.stateEasyrouteService.getFranchiseList()
      .pipe( 
        take(1), 
        map( 
          ({ data }) => data.map(( franchise ) => {
              return { 
                id: franchise.id,
                name: franchise.name
              }
            } 
          ) 
        )  
      )
      .subscribe(
        ( franchises ) => {
         
          this.franchiseList = franchises 
          this.loading = 'success';
        },
        ( error ) => {
          this.loading = 'error';
          this.toastService.displayHTTPErrorToast( error.status, error.error.error );
        }
      )
  }

  getStatus() {
    this.stateEasyrouteService.getMultistoreOrderStatusList()
      .pipe( 
        take(1),
      )
      .subscribe(
        ( status ) => {
          this.statusList = status ;
          this.loading = 'success';
        },
        ( error ) => {
          this.loading = 'error';
          this.toastService.displayHTTPErrorToast( error.status, error.error.error );
        }
      )
  }

  changeDate( name: string, dataEvent: NgbDate ) {
    if (name == 'from') {
      //this.from = objectToString( dataEvent );
      this.filter.dateFrom = objectToString( dataEvent );
      this.dateMax =  dataEvent;

      if (this.from <= this.to) {
        this.getResument();
        this.load();
      }

    } else {

      //this.to = objectToString( dataEvent );
      this.filter.dateTo = objectToString( dataEvent );
      this.getResument();
      this.load();

    }
    
  }

  changeShop( idFranchise: string ) {
    //this.idCompany = idFranchise;
    this.filter.idCompany = idFranchise;
    this.getResument();
    this.load();
  }

  ChangeZone(zoneId: string){
    this.filter.zoneId = zoneId;
    this.getResument();
    this.load();
  }

  changeStatus( statusOrderId: string ) {
    //this.idCompany = idFranchise;
    this.filter.statusId = statusOrderId;
    this.getResument();
    this.load();
  }

 /*  parseUrl( url: string ): string {
    
    if ( this.idCompany.length > 0 && this.from.length > 0 && this.to.length > 0 ) {
      return url += `?dateFrom=${ this.from }&dateTo=${ this.to}&idCompany=${ this.idCompany }`;
    
    } else if ( this.idCompany.length === 0 && this.from.length > 0 && this.to.length > 0  ) {
      return url += `?dateFrom=${ this.from }&dateTo=${ this.to}`;
    
    } else if ( this.idCompany.length > 0 && this.from.length === 0 && this.to.length === 0 ) {
      return url += `?idCompany=${ this.idCompany }`;
    
    } else {
      return url;
    
    }
  } */

  load() {


    let table = '#summary_orders';
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    //let url = environment.apiUrl + 'order_summary_datatables';

    let url =
      environment.apiUrl +
      'order_summary_datatables?dateFrom=' +
      this.filter.dateFrom +
      '&dateTo=' +
      this.filter.dateTo +
      '&profileId=' +
      this.filter.profileId +
      '&statusId=' +
      this.filter.statusId +
      '&idCompany=' +
      this.filter.idCompany +
      '&zoneId=' +
      this.filter.zoneId;

    //url = this.parseUrl( url ); 

    this.table = $( table ).DataTable({
      destroy: true,
      serverSide: true, 
      processing: true,
      stateSave: true,
      cache: false,
      order: [0, 'asc'],
      stateSaveParams: function (settings, data) {
          data.search.search = "";
      },
      lengthMenu: [50, 100],
      dom: `
        <'row'
            <'col-sm-5 col-md-5 col-xl-8 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
            <'col-sm-4 col-md-5 col-xl-3 col-12 label-search'f>
            <'col-sm-3 col-md-2 col-xl-1 col-12'
            <'row p-0 justify-content-sm-end justify-content-center'B>
            >
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
        /* beforeSend: () => {
            this.detectChanges.detectChanges();
            this.disabled = true;
        }, */
        /* complete: () => {
            this.detectChanges.detectChanges();
            this.disabled = false;
        }, */
        error: (xhr, error, thrown) => {
            let html = '<div class="container" style="padding: 10px;">';
            html +=
                '<span class="text-orange">Ha ocurrido un errror al procesar la informacion.</span> ';
            html +=
                '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
            html += '</div>';

            $('#companies_processing').html(html);

            $('#refrescar').click(() => {
                this.load();
            });
        },
      },
      columns: [
        {
          data: 'id',
          title: this._translate.instant('ID'),
        },
        {
          data: 'code',
          title: this._translate.instant('CONFIGURATIONS.CODE'),
        },
        {
          data: 'zone_name',
          title: this._translate.instant('FRANCHISE.SUMMARY_ORDERS.ZONE_NAME'),
          render: ( data, type, row ) => {
            if ( !data ) {
              return ' --- ';
            }

            return data;
          }
        },
        {
          data: 'company.name',
          title: this._translate.instant('FRANCHISE.SUMMARY_ORDERS.SHOP_NAME'),
        },
        /* {
          data: 'rol_user_assigned',
          title: this._translate.instant('FRANCHISE.SUMMARY_ORDERS.ROLE'),
        }, */
        {
          data: 'user_assigned',
          title: this._translate.instant('FRANCHISE.SUMMARY_ORDERS.ASSIGNED'),
          render: ( data, type, row ) => {
            if ( !data ) {
              return 'no disponible';
            }
            return data;
          }
        },
        {
          data: 'orderDate',
          title: this._translate.instant('FRANCHISE.SUMMARY_ORDERS.DATE_OF_THE_ORDER'),
          render: ( data, type, row ) => {
            return moment(data).format('DD/MM/YYYY');
          }
        },
        {
          data: 'created_at',
          title: this._translate.instant('FRANCHISE.SUMMARY_ORDERS.CREATION_DATE'),
          render: ( data, type, row ) => {
            return moment(data).format('DD/MM/YYYY');
          }
        },
        {
          data: 'created_at',
          title: this._translate.instant('FRANCHISE.SUMMARY_ORDERS.CHECK_IN_TIME'),
          render: ( data, type, row ) => {
           
            if ( data ) {
              return (`<span>${ moment( data ).format('HH:mm') }</span>`);
            }
            return '-';
          
          }
        },
        {
          data: 'preparationStart',
          title: this._translate.instant('FRANCHISE.SUMMARY_ORDERS.ASSIGNED_ORDERS'),
          render: (data, type, row) => {
            
            if ( data ) {
              return (`<span>${ moment( data ).format('HH:mm') }</span>`);
          }
          return '-';
          },
        },
        {
          data: 'totalTimeOne',
          title: this._translate.instant('FRANCHISE.SUMMARY_ORDERS.TOTAL_TIME'),
          searchable: false,
          render: ( data, type, row ) => {
            if ( data !=null) {
              return ('<span style="font-weight: bold;">'+ secondsToAbsoluteTimeAlterne(data, true) +'</span>');
            } else {
              return (`<span style="font-weight: bold;"> - </span>`);
            }
          }
        },
       /*  {
          data: 'preparationEnd',
          title: this._translate.instant('FRANCHISE.SUMMARY_ORDERS.END_OF_PREPARATION_TIME'),
          render: (data, type, row) => {
              if(data)
              {
                  return (
                      '<span data-toggle="tooltip" data-placement="top" title="' +
                      '">' +
                      moment(data).format('HH:mm') +
                      '</span>'
                  );
              }else {
                  return (
                      '<span>---</span>'
                  );
              }
         
          },
        }, */
       
        {
          data: 'preparationEnd',
          title: this._translate.instant('FRANCHISE.SUMMARY_ORDERS.ATTACHED_TICKET'),
          render: ( data, type, row ) => {
            if(data)
            {
                return (
                    '<span data-toggle="tooltip" data-placement="top" title="' +
                    '">' +
                    moment(data).format('HH:mm') +
                    '</span>'
                );
            }
            return ('<span>-</span>');
          }
        },
       

        {
          data: 'totalTimeTwo',
          title: this._translate.instant('FRANCHISE.SUMMARY_ORDERS.TOTAL_TIME_2'),
          searchable: false,
          render: ( data, type, row ) => {
            if ( data !=null) {
              return ('<span style="font-weight: bold;">'+ secondsToAbsoluteTimeAlterne(data, true) +'</span>');
            } else {
              return (`<span style="font-weight: bold;"> - </span>`);
            }
          }
        },
        {
          data: 'deliveryStart',
          title: this._translate.instant('FRANCHISE.SUMMARY_ORDERS.RIDER_DELIVERY_TIME'),
          render: ( data, type, row ) => {
            if(data)
            {
                return (
                    '<span data-toggle="tooltip" data-placement="top" title="' +
                    '">' +
                   // moment(data).format('HH:mm') +
                   moment(data).format('HH:mm') +
                    '</span>'
                );
            }else {
                return (
                    '<span>---</span>'
                );
            }
          }
        },
        {
          data: 'deliveryEnd',
          title: this._translate.instant('FRANCHISE.SUMMARY_ORDERS.DELIVERY_CONFIRMATION'),
          render: ( data, type, row ) => {
            if(data)
            {
                return (
                    '<span data-toggle="tooltip" data-placement="top" title="' +
                    '">' +
                    moment(data).format('HH:mm') +
                    '</span>'
                );
            }else {
                return (
                    '<span>---</span>'
                );
            }
          }
        },
        

        {
          data: 'totalTimeThree', // falta
          title: this._translate.instant('FRANCHISE.SUMMARY_ORDERS.TOTAL_TIME_3'),
          searchable: false,
          render: ( data, type, row ) => {
            if ( data !=null) {
              return ('<span style="font-weight: bold;">'+ secondsToAbsoluteTimeAlterne(data, true) +'</span>');
            } else {
              return (`<span style="font-weight: bold;"> - </span>`);
            }
           
          }
        },
        {
          data: 'status',
          title: this._translate.instant('FRANCHISE.SUMMARY_ORDERS.CONDITION'),
          searchable: false,
          render: (data, type, row) => {
            let varClass = '';

            if (data) {

            if (data == 'Sin asignar') {
              varClass = 'no-asigned';
            }
            if (data =='En preparación' || data =='En camino') {
              varClass = 'blue';
            }
            if (data === 'Entregado') {
              varClass = 'green';
            }
            if (data =='No entregado') {
              varClass = 'red';
            }
            if (data == 'Pospuesto') {
              varClass = 'orange';
            }
            if (data == 'Cancelada') {
                varClass = 'yellow';
            }
            if (data === 'En trámite') {
                varClass = '';
            }

            return (
                '<div class="d-flex justify-content-center backgroundColorRow">' +
               ' <div class="text-center editar col-12 p-0 m-0">'+
                    '<button style="font-size: 11px;" class="btn btn-default warning ' +
                        varClass +
                        '">' +
                        data +
                    ' </button> ' +
                    '</div>'+
                '</div>'
            );
            } else {
              return (`<span style="font-weight: bold;"> no disponible </span>`);
            }
            
        },
        },
        {
          data: null,
          title: this._translate.instant('GENERAL.DETAILS'),
          orderable: false,
          searchable: false,
          render: ( data, type, row ) => {
            return (`
              <div class="text-center editar">
                <i class="fas fa-eye fa-2x point" style="color: #24397c;"></i>
              </div>
            `)
          }
        }
      ]    
    });

    // style-searchbar
    $('.dataTables_filter').html(`
          <div class="row p-0 justify-content-sm-end justify-content-center">
              <div class="input-group datatables-input-group-width mr-xl-2">
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
          .search( this.value )
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


  editar(tbody: any, table: any, that = this ) {
    $(tbody).unbind();

    $(tbody).on('click', 'div.editar', function() {
      let data = table.row($(this).parents('tr')).data();  
      
      that.Router.navigate(['franchise/summary-orders/', data.id]);      
    });
  }

  filterOpen(){
    const modal = this.dialog.open(ModalFiltersComponent, {
        size: 'xl',
        backdrop: 'static',
        windowClass: 'modal-left'
    });
    
    modal.componentInstance.filter = this.filter;

    modal.result.then(
        (data) => {
            if (data) {

              this.filter = data;

              this.load();
            }
        },
        (reason) => {},
    );
}

getResument() {
  let url =
      'multistore_order_total_summary?dateFrom=' +
      this.filter.dateFrom +
      '&dateTo=' +
      this.filter.dateTo +
      '&profileId=' +
      this.filter.profileId +
      '&statusId=' +
      this.filter.statusId +
      '&idCompany=' +
      this.filter.idCompany +
      '&zoneId=' +
      this.filter.zoneId;

  this.showInfoDetail = false;
  this.stateEasyrouteService.getMultiStoreOrderTotalSummary(url).subscribe(
      (data: any) => {
          this.multiStoreTotalSummary = data.orders;
          this.showInfoDetail = true;
      },
      (error) => {
          this.showInfoDetail = true;
          this.toastService.displayHTTPErrorToast(
              error.status,
              error.error.error,
          );
      },
  );
}


setZone() {
  this.loading = 'loading';
  
  setTimeout(() => {
    this.stateEasyrouteService.getZone().subscribe(
      ( resp ) => {
        this.loading = 'success';
        this.zones = resp.data;
      },
      (error) => {
        this.loading = 'error';

        this.toastService.displayHTTPErrorToast(
          error.status,
          error.error.error,
        );
      },
    );
  }, 1000);
 
}



}
