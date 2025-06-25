import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { StateFilterStateFacade } from '../../../../../../filter-state/src/lib/+state/filter-state.facade';
import * as moment from 'moment-timezone';
import { ToDayTimePipe } from '../../../../../../shared/src/lib/pipes/to-day-time.pipe';
declare var $: any;
@Component({
  selector: 'easyroute-summary-of-updates',
  templateUrl: './summary-of-updates.component.html',
  styleUrls: ['./summary-of-updates.component.scss']
})
export class SummaryOfUpdatesComponent implements OnInit {

  @Input() filter:any;

  @Output('filters')
  filters: EventEmitter<any> = new EventEmitter();

  deliveryPointUpdateList: any[];

  show: boolean = true;

  tableDriverHaveServedClientTable: any;



  constructor( 
    private backend: BackendService,
    private toastService: ToastService,
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    private detectChanges: ChangeDetectorRef,
    private stateFilters: StateFilterStateFacade,
    private dayTime: ToDayTimePipe
  ) { }


  ngOnInit() {
   
  }

  ngOnChanges(){


    if (this.filter) {
        this.load(); 
    }     

  }

  load(){
    
    this.show = false;

    this.backend.get('delivery_point_update_status').pipe(take(1)).subscribe((data)=>{
      
      this.deliveryPointUpdateList = data.data;

      this.show = true;


      try {

        this.detectChanges.detectChanges();

        this.cargarSummary();

      } catch (error) {
        
      }

     

    }, error => {

      this.show= true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }


   /* Chóferes que han servido a este cliente */
   cargarSummary() {

    if (this.tableDriverHaveServedClientTable) {
        this.tableDriverHaveServedClientTable.clear();
        this.tableDriverHaveServedClientTable.state.clear();
    }

    let table = '#clientsDataUpdate';
    
    

    let url =  environment.apiUrl + 'report_data_update_datatables?' +

        (this.filter.values.dateFrom != '' ? '&dateFrom=' +
            this.filter.values.dateFrom : '') +

        (this.filter.values.dateTo != '' ? '&dateTo=' +
            this.filter.values.dateTo : '') +

        (this.filter.values.deliveryPointId != '' ? '&deliveryPointId=' +
        this.filter.values.deliveryPointId : '') +

        (this.filter.values.userId != '' ? '&userId=' +
        this.filter.values.userId : '') +

        (this.filter.values.deliveryPointUpdateStatusId != '' ? '&deliveryPointUpdateStatusId=' +
        this.filter.values.deliveryPointUpdateStatusId : '') +
        
        (this.filter.values.deliveryPointUpdateTypeId != '' ? '&deliveryPointUpdateTypeId=' +
        this.filter.values.deliveryPointUpdateTypeId : '') +

        (this.filter.values.deliveryZoneId != '' ? '&deliveryZoneId=' +
            this.filter.values.deliveryZoneId : '');
    
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    
    this.tableDriverHaveServedClientTable = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: false,
        cache: false,
        stateSaveParams: function (settings, data) {
            data.search.search = "";
        },
        lengthMenu: [11, 100],
        order: [[0, 'desc']],

        columnDefs: [{ orderData: 0, targets: [0] }],
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
                    this.cargarSummary();
                });
            },
        },
        columns: [
            {
                data: 'updateAt',
                //sortable: false,
               // searchable: false,
                className: 'text-left',
                title: this._translate.instant('REPORT.SUMMARY_UPDATE_OF_DATA.DATE'),
                render: (data, type, row) => {
                   
                    return (
                        '<span >' +moment(data).format('DD/MM/YYYY') +'</span>'
                    );
                },
            },
            {
                data: 'user_driver',
                sortable: false,
                searchable: false,
                className: 'text-left',
                title: this._translate.instant('REPORT.SUMMARY_UPDATE_OF_DATA.USER'),
                render: (data, type, row) => {
                    if (data == null || data == 0) {
                        return '<span class="text center" aria-hidden="true">No disponible</span>';
                    } else {
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            '">' +
                            data.name +
                            ' ' +
                            data.surname +
                            '</span>'
                        );
                    }
                },
            },
            {
                data: 'delivery_point.name',
                sortable: false,
                searchable: false,
                className: 'text-left',
                title: this._translate.instant('REPORT.SUMMARY_UPDATE_OF_DATA.CUSTOMER'),
                render: (data, type, row) => {
                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        data +
                        '">' +
                        data +
                        '</span>'
                    );
                },
            },
            {
                data: 'delivery_point_update_type.name',
                sortable: false,
                searchable: false,
                className: 'text-left',
                title: this._translate.instant('REPORT.SUMMARY_UPDATE_OF_DATA.TYPE'),
                render: (data, type, row) => {
                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        data +
                        '">' +
                        data +
                        '</span>'
                    );
                },
            },
            {
                data: 'deliveryPointCurrentData',
                sortable: false,
                searchable: false,
                className: 'text-left',
                title: this._translate.instant('REPORT.SUMMARY_UPDATE_OF_DATA.ANCIENT'),
                orderable: false,
                render: (data, type, row) => {
                    let name = data;

                    if (name.length > 30) {

                        name = name.substr(0, 29) + '...';
                    }
                    if (data == null || data == 0) {
                        return '<span class="text center" aria-hidden="true"></span>';
                    } else {
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' + data + '">' +
                            name +
                            '</span>'
                        );
                    }
                },
            },
            {
                data: 'deliveryPointDataUpdate',
                sortable: false,
                searchable: false,
                className: 'text-left',
                title: this._translate.instant('REPORT.SUMMARY_UPDATE_OF_DATA.UPDATED'),
                render: (data, type, row) => {
                    let name = data;

                    if (name.length > 30) {

                        name = name.substr(0, 29) + '...';
                    }
                    if (data == null || data == 0) {
                        return '<span class="text center" aria-hidden="true"></span>';
                    } else {
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title=" '+ data +'">' +
                            name +
                            '</span>'
                        );
                    }
                },
            },
            {
                data: 'delivery_point_update_status.name',
                sortable: false,
                searchable: false,
                className: 'text-left',
                title: this._translate.instant('REPORT.SUMMARY_UPDATE_OF_DATA.STATE'),
                render: (data, type, row) => {

                    let classColor ='';

                    if (data === 'Aceptado') {

                        classColor ='color-greed-update';

                    } else if(data === 'Rechazado'){

                        classColor ='color-red-update';

                    } else{

                        classColor ='';
                    }
    
                    if (data) {
                        return (
                            '<span class="'+classColor+'">' + data +'</span>'
                        );
                    } else {
                        return (
                            '<span>' + this._translate.instant('GENERAL.FOR_FREE') + '</span>'
                        );
                    }
    
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
    //this.editar('#driverHaveServedClientTable tbody', this.tableclientAnalysis);
    
}

changeFilterGeneral(event: any){

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

    this.filters.emit( this.filter );

    this.cargarSummary();

    this.detectChanges.detectChanges();
   
  }


}
