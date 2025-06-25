import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;
import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import { environment } from '@optimroute/env/environment';
import { Language, MomentDateFormatter, CustomDatepickerI18n, dateToObject, getToday, objectToString, getTodaysubtract } from '../../../../../../shared/src/lib/util-functions/date-format';
import { NgbDateParserFormatter, NgbDatepickerI18n, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { StateEasyrouteService } from '../../../../../../state-easyroute/src/lib/state-easyroute.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';

@Component({
  selector: 'easyroute-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  providers: [
    Language,
    {provide: NgbDateParserFormatter, useClass: MomentDateFormatter},
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
})
export class InvoiceListComponent implements OnInit {

  change: string = 'invoice';
  table: any;
  me: boolean;
  dateSearchFrom: FormControl = new FormControl( dateToObject( getTodaysubtract() ) );
  dateSearchTo: FormControl = new FormControl( dateToObject( getToday() ) );
  from: string  = getTodaysubtract() ; 
  to: string = getToday();
  dateMax: any;
  loading: 'loading' | 'success' | 'error' = 'loading';
  CompanyList: any[] = [];
  companyId: string = '';
  constructor(
    private _router: Router,
    private toastService: ToastService,
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    private stateEasyrouteService: StateEasyrouteService,
  ) { }

  ngOnInit() {
    this.getInvoiceCompany();
    this.Cargar();
    }

    getInvoiceCompany() {
      this.stateEasyrouteService.getInvoiceCompany()
        .subscribe(
          ( data ) => {
          
            this.CompanyList = data.data;
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
        this.from = objectToString( dataEvent );
        this.dateMax =  dataEvent;
  
        if (this.from <= this.to) {
          //this.Cargar();
        }
  
      } else {
  
        this.to = objectToString( dataEvent );
       // this.Cargar();
  
      }
      
    }
  
  
    changeShop( companyId: string ) {
      this.companyId = companyId;
      //this.Cargar();
    }
  
    parseUrl( url: string ): string {
      
      if ( this.companyId.length > 0 && this.from.length > 0 && this.to.length > 0 ) {
        return url += `?date_from=${ this.from }&date_to=${ this.to}&companyId=${ this.companyId }`;
      
      } else if ( this.companyId.length === 0 && this.from.length > 0 && this.to.length > 0  ) {
        return url += `?date_from=${ this.from }&date_to=${ this.to}`;
      
      } else if ( this.companyId.length > 0 && this.from.length === 0 && this.to.length === 0 ) {
        return url += `?companyId=${ this.companyId }`;
      
      } else {
        return url;
      
      }
    }

    Cargar() {    
        let url = environment.apiUrl + 'list_admin_invoices' ;
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#invoice';

        url = this.parseUrl( url ); 
    
        this.table = $(table).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            cache: false,
            lengthMenu: [30, 50, 100],
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            order: [[ 2, "desc" ]],
            dom: `
                <'row'
                    <'col-sm-8 col-lg-10 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
                    <'col-sm-4 col-lg-2 col-12 label-search'f>
                >
                <'row p-0 reset'
                    <'offset-sm-6 offset-lg-6 offset-5'>
                    <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>
                >
                <"top-button-hide"><t>
                <'row reset'
                    <'col-lg-5 col-md-5 col-12 pl-4 pr-4 d-flex flex-column justify-content-center align-items-cente'i>
                    <'col-lg-7 col-md-7 col-12 pl-5 pr-5 d-flex flex-column justify-content-center align-items-lg-start align-items-md-start'p>
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
                        this.Cargar();
                    });
                },
            },
            columns: [
                  {
                    data: 'created',
                    title: this._translate.instant('INVOICES.DATE'),
                    render: (data, type, row) => {
                      return moment(data).format('DD/MM/YYYY');
                      return (
                        '<span class="text center" aria-hidden="true">No disponible</span>'
                      );
                  },
                },
                { 
                 data: 'companyName',
                 title: this._translate.instant('INVOICES.COMPANY'),
                 render: (data, type, row) => {
                 if (data) {
                  return (
                    '<span class="text center" aria-hidden="true">'+data+'</span>'
                  );
                 } else {
                  return (
                    '<span class="text center" aria-hidden="true">No disponible</span>'
                  );
                 }
                 
              },
                },
                {
                    data: 'number',
                    title: this._translate.instant('INVOICES.INVOICE_NUMBER'),
                    render: (data, type, row) => {
                      let name = data;
                      if (name.length > 65) {
                          name = name.substr(0, 67) + '...';
                      }
                      return (
                          '<span data-toggle="tooltip" data-placement="top" title="' +
                          data +
                          '">' +
                          name +
                          '</span>'
                      );
                  },
                },
                {
                    data: 'amount',
                    title: this._translate.instant('INVOICES.AMOUNT'),
                    render:(data, type, row) =>{
        
                      if (data == null || data ==0) {
              
                        return '<p class="text center" aria-hidden="true"> No disponible</p>';
              
                      } else {
              
                        let euro = data;
              
                        return euro + " " + '<i class="fas fa-euro-sign"></i>'
                      }
                    }  
          
                },
             
                {
                    data: null,
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('INVOICES.DOWNLOAD'),
                    render: (data, type, row) => {
                        return `<span class="invoiceDownload point"> <img class="icons-datatable point" src="assets/icons/optimmanage/download-outline.svg"></i></span>`;
                    },
                },
            ],
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
    
        $('#search').on('keyup', function () {
            $(table).DataTable().search(this.value).draw();
        });
    
        $('.dataTables_filter').removeAttr('class');
    
        this.invoiceDownload('#invoice tbody', this.table);
   
    }
    isSalesman() {
      return this.authLocal.getRoles()
          ? this.authLocal.getRoles().find((role: any) => role === 2) !== undefined
          : false;
    }
    
    invoiceDownload(tbody: any, table: any, that = this) {
      $(tbody).unbind();
    
      $(tbody).on('click', 'span.invoiceDownload', function() {
          let data = table.row($(this).parents('tr')).data();
          that.downloadElement(data);
         
      });
    }

  changePage(name: string){
     
    switch (name) {
        case 'company':
            this.change = name;
            this._router.navigate(['/super-admin/company']);
            break;

            case 'user':
                this.change = name;
                this._router.navigate(['/super-admin/user']);
            break;

              case 'novelty':
                  this.change = name;
                  this._router.navigate(['/super-admin/novelty']);
                  break;
                case 'invoice':
                    this.change = name;
                    this._router.navigate(['/super-admin/invoice']);
                    break;
                      case 'start':
                        this.change = name;
                        this._router.navigate(['/super-admin/start']);
                      break;
    
        default:
            break;
    }
}

  downloadElement(archivo: any): void {
    
    let link= document.createElement('a');
    document.body.appendChild(link); //required in FF, optional for Chrome
    link.target = '_blank';
    let fileName = 'img';
    link.download = fileName;
    link.href = archivo.url_pdf;
    link.click();
  }
}
