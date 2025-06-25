import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment-timezone';
declare var $: any;
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import { dateToObject, getToday, objectToString } from '../../../../../../shared/src/lib/util-functions/date-format';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { NgbModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ToDayTimePipe } from '../../../../../../shared/src/lib/pipes/to-day-time.pipe';
import { dayTimeAsStringToSeconds } from '../../../../../../shared/src/lib/util-functions/day-time-to-seconds';
import { environment } from '@optimroute/env/environment';
import { ModalViewPdfGeneralComponent } from '../../../../../../shared/src/lib/components/modal-view-pdf-general/modal-view-pdf-general.component';
@Component({
  selector: 'easyroute-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.scss']
})
export class PackageListComponent implements OnInit {


tableclientAnalysis: any;

@Input() routeId: any;


delayTimeOnDelivery: any = '';

@Output('filterDate')
filterDate: EventEmitter<any> = new EventEmitter();

  constructor(
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    private Router: Router,
    private toastService: ToastService,
    private backendService: BackendService,
    private _modalService: NgbModal,
    private detectChanges: ChangeDetectorRef,
    private dayTime: ToDayTimePipe
  ) { }

  ngOnInit() {
   
  }

  ngOnChanges() {
  
    

    this.initMoment();

    this.cargar();

    
   
  }

  initMoment() {
    moment()
        .tz('Europe/Madrid')
        .format();
  }


  cargar() {
   
    let table = '#packegeList';

    let url = environment.apiUrl + 'route_planning/route_package_list/'+ this.routeId; 
   
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();

    this.tableclientAnalysis = $(table).DataTable({
        destroy: true,
        serverSide: false,
        processing: true,
        stateSave: true,
        cache: false,
        stateSaveParams: function (settings, data) {
            data.search.search = "";
        },
        scrollCollapse: true,
        lengthMenu: [50, 100],
        order: [1, 'asc'],
        dom: `
            <'row'
                <'col-sm-8 col-lg-10 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'>
                <'col-sm-4 col-lg-2 col-12 label-search'>
            >
            <'row p-0 reset'
              <'offset-sm-6 offset-lg-6 offset-5'>
              <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>
            >
            <"top-button-hide"><'table-responsive't>
            <'row reset'
                <'col-lg-5 col-md-5 col-12 pl-4 pr-4 d-flex flex-column justify-content-center align-items-cente'i>
                <'col-lg-7 col-md-7 col-12 pl-5 pr-5 d-flex flex-column justify-content-center align-items-lg-start align-items-md-start'p>
            >
        `,
        /* headerCallback: ( thead, data, start, end, display ) => {               
            $('.buttons-collection').html('<i class="far fa-edit"></i>'+ ' ' + this._translate.instant('GENERAL.SHOW/HIDE')) 
        }, */
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
                data: 'deliveryNoteCode', 
                title: this._translate.instant('PARCEL.PACKAGE'),
                render: (data, type, row) => {

                 if(data){

                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +data +'">' +'Paquete num. #' +data +'</span>'
                    );
                 } else {
                    '<span data-toggle="tooltip" data-placement="top" title="' +data +'">' +'' +'</span>'
                 }
                   
                   
                },
             },
           
            {
                data: 'checkedLoad',
                title: this._translate.instant('PARCEL.LOAD_STATUS'),
                render: (data, type, row) => {
                    if (data) {
                        return (
                            '<span data-toggle="tooltip" data-placement="top" >' + 'Cargado' +'</span>'
                        ); 
                    } else {
                        return (
                            '<span class="font-roja" data-toggle="tooltip" data-placement="top" >' + 'No cargado' +'</span>'
                        ); 
                    }

                   
                },
            },
            {
                data: 'verifiedDelivery',
                title: this._translate.instant('PARCEL.DELIVERY_STATUS'),
                render: (data, type, row) => {
                    if (data) {
                        return (
                            '<span data-toggle="tooltip" data-placement="top" >' + 'Entregado' +'</span>'
                        ); 
                    } else {
                        return (
                            '<span class="font-roja" data-toggle="tooltip" data-placement="top" >' + 'No entregado' +'</span>'
                        ); 
                    }

                   
                },
            },
            {
                data: 'total_product',
                title: this._translate.instant('PARCEL.PRODUCT'),
                render: (data, type, row) => {
                    
                   
                    if (!data) {
                        return '<span class="text-center">' + '---' + '</span>';
                    } else {
                      
     
                         
                        return '<span class="text-center">' + row.total_product_verified + '/' + data + '</span>';
                    }


                },
            },
            {
                data: 'name_client',
                title: this._translate.instant('PARCEL.CLIENT'),
                render: (data, type, row) => {
                    if (data) {
                         
                        return (
                            
                            '<span data-toggle="tooltip" data-placement="top" title="' +data +'" >' + data +'</span>'
                        ); 
                    } else {
                        return (
                            '<span data-toggle="tooltip" data-placement="top">' + '---' + '</span>'
                        ); 
                    }
                },
            },
          
            {
                data: null,
                sortable: false,
                searchable: false,
                orderable:false,
                 render: (data, type, row) => {
                        let botones = '';
                        botones += `
                                <div class="text-center editar">
                                    <img class="point" src="assets/icons/External_Link.svg">
                                </div>
                            `;

                        return botones;
                    },
            }
          
            
           
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
    $('#search').on('keyup', function() {
        $(table)
            .DataTable()
            .search(this.value)
            .draw();
    });

    $('.dataTables_filter').removeAttr('class');
    this.editar('#packegeList tbody', this.tableclientAnalysis);
    
}

editar(tbody: any, table: any, that = this) {   

  $(tbody).unbind();

  $(tbody).on('click', '.editar', function() {

      let data = table.row($(this).parents('tr')).data();
      
      that.openModalViewPdf(data.deliveryNoteId);
      
    
  });
}



  returnsHour(date: any){
    if (date) {
      return moment(date).format('HH:mm');
    } else {
      return '----'
    }
    

  }
  decimal(numb) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numb);
}



openModalViewPdf(deliveryNoteId: any){

    console.log('abrir ver pdf')
    
    const modal = this._modalService.open( ModalViewPdfGeneralComponent, {
      
      backdropClass: 'modal-backdrop-ticket',
  
      centered: true,
  
      windowClass:'modal-view-pdf',
  
      size:'lg'
  
    });

    let url = 'route_planning/route_package_pdf/'+ deliveryNoteId ; 

   /*  url += this.dates.from ? '?from=' + this.dates.from : '';

    url += this.dates.to ? '&to=' + this.dates.to : '';
 */


    modal.componentInstance.url= url;

    modal.componentInstance.title = this._translate.instant('PARCEL.PACKAGE_LIST');
    
    
  }

}
