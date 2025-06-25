import { ModalViewPdfGeneralComponent } from './../../../../../shared/src/lib/components/modal-view-pdf-general/modal-view-pdf-general.component';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbDatepickerI18n, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@optimroute/env/environment';
import { AuthLocalService } from '@optimroute/auth-local';
import { CustomDatepickerI18n, dateToObject, getToday, Language, MomentDateFormatter, objectToString, ToastService } from '@optimroute/shared';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment-timezone';
import { Router } from '@angular/router';
import { StateFilterStateFacade } from '@easyroute/filter-state';
import { ModalSearchClientComponent } from './modal-search-client/modal-search-client.component';
import { FilterState } from 'libs/backend/src/lib/types/filter-state.type';
import { take } from 'rxjs/operators';
import { BackendService } from '@optimroute/backend';

declare var $: any;


@Component({
  selector: 'easyroute-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.scss'],
  providers: [
    Language,
    {provide: NgbDateParserFormatter, useClass: MomentDateFormatter},
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
})
export class BillListComponent implements OnInit {
  
  loading: 'loading' | 'success' | 'error' = 'loading';
  loadingPaymentStatus: 'loading' | 'success' | 'error' = 'loading';
  loadingPaymentType: 'loading' | 'success' | 'error' = 'loading';
  loadingChargeType: 'loading' | 'success' | 'error' = 'loading';

  deliveryPoints: any = [];
  billPaymentStatus: any = [];
  billPaymentType: any = [];
  billChargeType: any = [];

  from: string  = getToday() ; 
  to: string = getToday();
  dateSearchFrom: FormControl = new FormControl( dateToObject( getToday() ) );
  dateSearchTo: FormControl = new FormControl( dateToObject( getToday() ) );

  table: any;
  timeInterval: any;

  dateMax: any;
  moneySymbol = environment.MONEY_SYMBOL;
  
  /* filter: any = {
    deliveryPointId: '',
    billPaymentStatusId: '',
    billPaymentTypeId: '',
    billChargeTypeId: '',
    dateFrom: getToday(),
    dateTo: getToday(),
  }; */
  filter: FilterState = {
    name: 'bills',
    values:{
        deliveryPointId: '',
        billPaymentStatusId: '',
        billPaymentTypeId: '',
        billChargeTypeId: '',
        dateFrom: getToday(), //getStartOf(), //this.getToday(),
        dateTo: getToday(), //getEndOf(), 
        nameClient:''
       
    }
   
  };
  fromDate: NgbDateStruct | null;

  toDate: NgbDateStruct | null;

  hoveredDate: NgbDate | null = null;

  placement = 'bottom';

  showInfoDetail: boolean = true;

  informativeDevolution: any;

  

  constructor(

    private stateEasyrouteService: StateEasyrouteService,
    private _toastService: ToastService,
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    private changeDetect: ChangeDetectorRef,
    private router: Router,
    public formatter: NgbDateParserFormatter,
    private calendar: NgbCalendar,
    private stateFilters: StateFilterStateFacade,
    private _modalService: NgbModal,
    private backend: BackendService,


  ) { }

  ngOnInit() {

    this.fromDate = dateToObject(getToday()); 

    this.toDate = dateToObject(getToday()); 

    this.getBillPaymentStatus();

    this.getBillPaymentType();

    this.getBillChargeType();

    this.getResument();

    this.cargar();

  }

  getBillPaymentStatus() {
    this.loadingPaymentStatus = 'loading';

    setTimeout(() => {
        this.stateEasyrouteService.getBillPaymentStatus().pipe(take(1)).subscribe(
            (data: any) => {
                this.billPaymentStatus = data.data;

                this.loadingPaymentStatus = 'success';
            },
            (error) => {
                this.loadingPaymentStatus = 'error';

                this._toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
    }, 1000);
  }

  getBillPaymentType() {
    this.loadingPaymentType = 'loading';

    setTimeout(() => {
        this.stateEasyrouteService.getBillPaymentType().pipe(take(1)).subscribe(
            (data: any) => {
                this.billPaymentType = data.data;

                this.loadingPaymentType = 'success';
            },
            (error) => {
                this.loadingPaymentType = 'error';

                this._toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
    }, 1000);
  }

  getBillChargeType() {
    this.loadingChargeType = 'loading';

    setTimeout(() => {
        this.stateEasyrouteService.getBillChargeType().pipe(take(1)).subscribe(
            (data: any) => {
                this.billChargeType = data.data;

                this.loadingChargeType = 'success';
            },
            (error) => {
                this.loadingChargeType = 'error';

                this._toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
    }, 1000);
  }

  getResument() {

    let data = {

        deliveryPointId: this.filter.values.deliveryPointId,

        billPaymentStatusId: this.filter.values.billPaymentStatusId,

        billPaymentTypeId: this.filter.values.billPaymentTypeId,

        billChargeTypeId: this.filter.values.billChargeTypeId,

        dateFrom: this.filter.values.dateFrom,

        dateTo: this.filter.values.dateTo

    };

    this.showInfoDetail = false;

    this.stateEasyrouteService
        .getInformativeBills(data)
        .pipe(take(1))
        .subscribe(
            (data: any) => {

              
                this.informativeDevolution = data;

                console.log(this.informativeDevolution, 'this.informativeDevolution');
    

                this.showInfoDetail = true;
            },
            (error) => {
                this.showInfoDetail = true;
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
    
    let url =
      environment.apiUrl +
      'company_bill_datatables?dateFrom=' +
      this.filter.values.dateFrom +
      '&dateTo=' +
      this.filter.values.dateTo +
      '&deliveryPointId=' +
      this.filter.values.deliveryPointId +
      '&billPaymentStatusId=' +
      this.filter.values.billPaymentStatusId +
      '&billPaymentTypeId=' +
      this.filter.values.billPaymentTypeId +
      '&billChargeTypeId=' +
      this.filter.values.billChargeTypeId;


    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#bills';

    this.table = $(table).DataTable({
      destroy: true,
      processing: true,
      stateSave: true,
      responsive: true,
      serverSide: true,
      cache: false,
      order:[ 1, 'desc'],
      stateSaveParams: function (settings, data) {
          data.search.search = "";
      },
      initComplete : function (settings, data) {
          settings.oClasses.sScrollBody="";
       
      },
      lengthMenu: [50, 100],
      dom: `
          <'row'
              <'col-xl-6 col-12 d-flex flex-column justify-content-start align-items-center align-items-md-start p-0'
                  <'col-xl-12 col-md-12 col-12 col-sm-12 pl-2'>
              >
              <'col-xl-6 col-12 d-flex flex-column justify-content-center align-items-center align-items-md-end p-0'
                  <'row'
                      <'col-sm-6 col-md-6 col-xl-3 col-5 dt-buttons-table-otro pb-0 pt-0'B>
                  >
              >
          >
          <'row p-0 reset'
            <'offset-sm-6 offset-lg-6 offset-5'>
            <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>
          >
          <"top-button-hide"><'table-responsive't>
          <'row reset'
              <'col-lg-5 col-md-5 col-xl-5 col-12 pl-3 pr-3 d-flex flex-column justify-content-center align-items-cente'i>
              <'col-lg-7 col-md-7 col-xl-7 col-12 pl-3 pr-3 d-flex flex-column justify-content-center align-items-lg-end align-items-sm-center'
                  <'row reset align-items-center'
                      <'col-sm-6 col-md-6 col-xl-6 col-6'l>
                      <'col-sm-6 col-md-6 col-xl-6 col-6'p>
                  >
              >
          >
     `,
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
            data: 'code', 
            title: this._translate.instant('BILLS.CODE') 
          },
          {
              data: 'name_client',
              title: this._translate.instant('BILLS.CLIENT'),
              render: (data, type, row) => {

                if (!data) {
                  return ('<span class="text-center">No disponible</span>');
                }

                return (
                    '<span data-toggle="tooltip" data-placement="top" title="' +
                    '">' +
                    data +
                    '</span>'
                );
              },
          },
          {
            data: 'address_client',
            title: this._translate.instant('BILLS.ADDRESS'),
            render: (data, type, row) => {

              if (!data) {
                return ('<span class="text-center">No disponible</span>');
              }

              return (
                  '<span data-toggle="tooltip" data-placement="top" title="' + data + '">' + data + '</span>'
              );
            },
        },
          {
              data: 'paymentDate',
              title: this._translate.instant('BILLS.COLLECTION_DATE'),
              render: (data, type, row) => {

                if ( !data ) {
                  return ('<span class="text-center">---</span>');
                }

                return moment(data).format('DD/MM/YYYY');
              },
          },
          {
            data: 'total',
            title: this._translate.instant('BILLS.AMOUNT'),
            render: (data, type, row) => {
                return (
                    '<span data-toggle="tooltip" data-placement="top" title="' +
                    data +
                    '">' +
                    data + this.moneySymbol +
                    '</span>'
                );
            },
          },
          {
              data: 'name_payment_type',
              visible: true,
              title: this._translate.instant('BILLS.PAYMENT_METHOD'),
              render: (data, type, row) => {
                  if ( !data ) {
                      return ('<span class="text-center">---</span>');
                  }

                  return (`<span class="text-center">${ data }</span>`);
              },
          },
          {
            data: 'bill_charge_type',
            searchable: false,
            visible: true,
            title: this._translate.instant('BILLS.PAYMENT_CHANNEL'),
            render: (data, type, row) => {
                if ( !data ) {
                    return ('<span class="text-center">---</span>');
                }

                return (`<span class="text-center">${ data.name }</span>`);
            },
          },
          {
            data: 'billPaymentStatusId',
            title: this._translate.instant('BILLS.PAYMENTS'),
            render: (data, type, row) => {

              if (data == 1) {

                return '<buttom class="btn btn-primary btn-pendiente btn-status-datatable">Pendiente</buttom>';
  
              } else if (data == 2) {

                return '<buttom class="btn btn-primary btn-entregado btn-status-datatable">Realizado</buttom>';

              } else if (data == 3) {

                return '<buttom class="btn btn-primary  btn-pendiente btn-status-datatable">No Firmado</buttom>';

              } else if (data == 4) {

                return '<buttom class="btn btn-primary  btn-firmado btn-status-datatable">Firmado</buttom>';

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
                      (`
                        <div class="text-center detail point">
                          <img class="point" src="assets/icons/External_Link.svg">
                        </div>
                      `);
                      
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
  $('.dt-button').css("border", "0px");

  $('.dt-button').css("height", "0px");

  const $elem = $('.dt-button');


  $elem[0].style.setProperty('padding', '0px', 'important');

  $('.dt-buttons').css("height", "0px");

  $('#dt-buttons-table').off('click');

  $('#dt-buttons-table').on('click', function (event: any) {

      $('.dt-button').click();

  });
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
    this.detail( tbody, table );
  }

  detail(tbody: any, table: any, that = this) {
    $(tbody).on('click', 'div.detail', function() {
        let data = table.row($(this).parents('tr')).data();
        that.router.navigate(['bills', data.id]);
    });
}

  ChangeFilter(event) {
    let value = event.target.value;

    let id = event.target.id;

    this.setFilter(value, id, true);
  }

  setFilter(value: any, property: string, sendData?: boolean) {

      this.filter = {
  
        ...this.filter,
  
        values: {
  
            ...this.filter.values,
  
            [property]: value
        }
    } 
  
    this.stateFilters.add(this.filter);
  
  
    if (sendData) {
        this.cargar();

        this.getResument();
  
        this.changeDetect.detectChanges();
    }

  }

  changeDate( name: string, dataEvent: NgbDate ) {

    
    if (name == 'from') {
      
      this.from = objectToString( dataEvent );
      this.filter.values.dateFrom =this.from;
      this.dateMax =  dataEvent;

      this.cargar();

    } else {

      this.to = objectToString( dataEvent );
      this.filter.values.dateTo = this.to;

      this.cargar();
    }
    
  }

  openPdf(){
    
    let url = 'company_bill_pdf?' +

    (this.filter.values.dateFrom != '' ? '&dateFrom=' +
     this.filter.values.dateFrom : '') +

    (this.filter.values.dateTo != '' ? '&dateTo=' +
        this.filter.values.dateTo : '') +
    
    (this.filter.values.deliveryPointId != '' ? '&deliveryPointId=' +
        this.filter.values.deliveryPointId : '') +

    (this.filter.values.billPaymentStatusId != '' ? '&billPaymentStatusId=' +
        this.filter.values.billPaymentStatusId : '') + 

    (this.filter.values.billPaymentTypeId != '' ? '&billPaymentTypeId=' +
        this.filter.values.billPaymentTypeId : '') + 

    (this.filter.values.billChargeTypeId != '' ? '&billChargeTypeId=' +
        this.filter.values.billChargeTypeId : '') ;


    const modal = this._modalService.open( ModalViewPdfGeneralComponent, {
  
        backdropClass: 'modal-backdrop-ticket',
    
        centered: true,
    
        windowClass:'modal-view-pdf',
    
        size:'lg'
    
      });

      modal.componentInstance.url = url;
  
      modal.componentInstance.title = this._translate.instant('BILLS.BILLING');
  }
  openCsv(){

    let url ='company_bill_excel?' +

    (this.filter.values.dateFrom != '' ? '&dateFrom=' +
     this.filter.values.dateFrom : '') +

    (this.filter.values.dateTo != '' ? '&dateTo=' +
        this.filter.values.dateTo : '') +
    
    (this.filter.values.deliveryPointId != '' ? '&deliveryPointId=' +
        this.filter.values.deliveryPointId : '') +

    (this.filter.values.billPaymentStatusId != '' ? '&billPaymentStatusId=' +
        this.filter.values.billPaymentStatusId : '') + 

    (this.filter.values.billPaymentTypeId != '' ? '&billPaymentTypeId=' +
        this.filter.values.billPaymentTypeId : '') + 

    (this.filter.values.billChargeTypeId != '' ? '&billChargeTypeId=' +
        this.filter.values.billChargeTypeId : '') ;
    
    return this.backend.getDownloadExcel(url, 'Bills').then((data: string)=>{ })

  }

  addclient() {
    const modal = this._modalService.open(ModalSearchClientComponent, {
        size: 'xl',
        centered: true,
        backdrop: 'static',
    });
  
    modal.result.then(
        (data) => {
            if (data) {
  
              this.filter = {
                  ...this.filter,
                  values: {
                      ...this.filter.values,
                      deliveryPointId: data.id,
                      nameClient: data.name
                  },
              };
        
                this.stateFilters.add(this.filter);
  
                this.changeDetect.detectChanges();
                
                this.cargar();
  
                this.getResument();
            }
        },
        (reason) => {},
    );
  }

  /// new

  onDateSelection(date: NgbDate) {
  
    if (!this.fromDate && !this.toDate) {
  
      this.fromDate = date;
  
        this.filter = {
            ...this.filter,
            values: {
                ...this.filter.values,
                dateFrom: objectToString(date),
            }
        }
      
        
        this.stateFilters.add(this.filter);

        this.cargar();

        this.getResument();
  
  
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
  
      this.toDate = date;
  
        this.filter = {
            ...this.filter,
            values: {
                ...this.filter.values,
                dateTo: objectToString(date),
            }
        
        }
      
      
        this.stateFilters.add(this.filter);

        this.cargar();

        this.getResument();
  
    } else {
  
        this.filter = {
            ...this.filter,
            values: {
                ...this.filter.values,
                dateFrom: objectToString(date),
                dateTo:objectToString(date)
            }
        }
  
  
        this.toDate = null;
      
        this.fromDate = date;
      
        this.stateFilters.add(this.filter);

        this.cargar();

        this.getResument();
  
    }
  }

  isHovered(date: NgbDate) {

    return (
  
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
  
    );
  
  }
  
  isInside(date: NgbDate) {
  
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  
  }
  
  
  isRange(date: NgbDate) {
  
    return (
  
      date.equals(this.fromDate) ||
  
      (this.toDate && date.equals(this.toDate)) ||
  
      this.isInside(date) ||
  
      this.isHovered(date)
  
    );
  }
  
  validateInput(currentValue: NgbDateStruct | null, input: string): NgbDate | NgbDateStruct | null {
  
    const parsed = this.formatter.parse(input);
  
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  
  }

  clearClient(){


    this.filter = {
        ...this.filter,
        values: {
            ...this.filter.values,
            deliveryPointId: '',
            nameClient:''
           
        }
    }
  
    this.stateFilters.add(this.filter);

    this.changeDetect.detectChanges();

    this.cargar();
    
    this.getResument();
      
}

openSetting() {

  //this.router.navigate(['bills/settings']);
  this.router.navigateByUrl('/preferences?option=bill');
}

}
