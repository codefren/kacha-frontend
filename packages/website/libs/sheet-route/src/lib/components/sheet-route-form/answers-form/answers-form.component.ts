import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { environment } from '@optimroute/env/environment';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalViewTicketComponent } from './modal-view-ticket/modal-view-ticket.component';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { take } from 'rxjs/operators';
import * as moment from 'moment-timezone';
import { secondsToAbsoluteTime } from 'libs/shared/src/lib/util-functions/time-format';
import { secondsToDayTimeAsString, secondsToTimeAsTime } from '@optimroute/shared';
declare var $: any;
import * as _ from 'lodash';
@Component({
  selector: 'easyroute-answers-form',
  templateUrl: './answers-form.component.html',
  styleUrls: ['./answers-form.component.scss']
})
export class AnswersFormComponent implements OnInit, OnChanges {
  
  tableAnswers: any;

  tableEndRoadmap: any;

  @Input() roadMap: any;

  img: any;

  constructor(  
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    private toastService: ToastService,
    private backendService: BackendService,
    private _modalService: NgbModal,
    
    ) { }

  ngOnInit() {
  
  }

  ngOnChanges() {
  
    if(this.roadMap){

        this.initMoment();

        this.cargar();

        this.cargarEndRoadmap();
    }
   
  }

  initMoment() {
    moment()
        .tz('Europe/Madrid')
        .format();
  }


  cargar() {
   
    let table = '#tableAnswers';
    this.tableAnswers = $(table).DataTable({
        destroy: true,
        serverSide: false,
        processing: true,
        data: this.transformData(this.roadMap.routeSheetRouteInitialForm),
        stateSave: true,
        cache: false,
        stateSaveParams: function (settings, data) {
            data.search.search = "";
        },
        scrollCollapse: true,
        lengthMenu: [50, 100],
        order: [0, 'asc'],
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
        /* ajax: {
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
        }, */
        columns: [
            { data: 'formStructureName', title: this._translate.instant('SHEET_ROUTE.GUY') },
            {
                data: 'firstAnswer',
                title: this._translate.instant('SHEET_ROUTE.RESPONSE'),
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
                data: 'secondAnswer',
                title: this._translate.instant('SHEET_ROUTE.RESPONSE_2'),
                render: (data, type, row) => {
                    let name = data;
                    if (name.length > 30) {
                        name = name.substr(0, 29) + '...';
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
                data: 'urlFile',
                title: this._translate.instant('SHEET_ROUTE.ATTACHMENTS'),
                render: (data, type, row) => {
                    if (data == null || data == 0) {
                        return '<p class="text center" aria-hidden="true"> </p>';
                      // return '<buttom class="btn btn-primary btn-ticket view">Ver ticket</buttom>';

                    } else {
                        return (
                            '<buttom class="btn btn-primary font-ticker btn-ticket view">Ver ticket</buttom>'
                        );
                    }
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
    $('#search').on('keyup', function() {
        $(table)
            .DataTable()
            .search(this.value)
            .draw();
    });

    $('.dataTables_filter').removeAttr('class');
    this.view('#tableAnswers tbody', this.tableAnswers);
    
}

view(tbody: any, table: any, that = this) {   

  $(tbody).unbind();

  $(tbody).on('click', '.view', function() {
      let data = table.row($(this).parents('tr')).data();
      console.log(data, 'ABrir modal de visualizar ticket');
      that.openModalVerifed(data.urlFile);
    
  });
}


openModalVerifed(url: string){
  
  const modal = this._modalService.open( ModalViewTicketComponent, {
    
    backdropClass: 'modal-backdrop-ticket',

    centered: true,

    windowClass:'modal-content-temp',

    size:'md'

  });

  modal.componentInstance.img = url;

}

cargarEndRoadmap(){
   
    console.log(this.roadMap, 'this.roadMap');
    let table = '#tableEndRoadmap';

    this.tableEndRoadmap = $(table).DataTable({
        destroy: true,
        serverSide: false,
        processing: true,
        data: this.transformData(this.roadMap.routeSheetRouteFinalForm),
        stateSave: true,
        cache: false,
        order: [0, 'asc'],
        stateSaveParams: function (settings, data) {
            data.search.search = "";
        },
        scrollCollapse: true,
        lengthMenu: [50, 100],
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
       
        columns: [
            { data: 'formStructureName', title: this._translate.instant('SHEET_ROUTE.GUY') },
            {
                data: 'firstAnswer',
                title: this._translate.instant('SHEET_ROUTE.RESPONSE'),
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
                data: 'secondAnswer',
                title: this._translate.instant('SHEET_ROUTE.RESPONSE_2'),
                render: (data, type, row) => {
                    let name = data;
                    if (name.length > 30) {
                        name = name.substr(0, 29) + '...';
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
                data: 'urlFile',
                title: this._translate.instant('SHEET_ROUTE.ATTACHMENTS'),
                render: (data, type, row) => {
                    if (data == null || data == 0) {
                        return '<p class="text center" aria-hidden="true"> </p>';
                      // return '<buttom class="btn btn-primary btn-ticket view">Ver ticket</buttom>';

                    } else {
                        return (
                            '<buttom class="btn btn-primary btn-ticket font-ticker viewRoad">Ver ticket</buttom>'
                        );
                    }
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
    $('#search').on('keyup', function() {
        $(table)
            .DataTable()
            .search(this.value)
            .draw();
    });

    $('.dataTables_filter').removeAttr('class');
    this.viewRoad('#tableEndRoadmap tbody', this.tableEndRoadmap);
}

viewRoad(tbody: any, table: any, that = this) {   

    $(tbody).unbind();
  
    $(tbody).on('click', '.viewRoad', function() {
        let data = table.row($(this).parents('tr')).data();
        console.log(data, 'ABrir modal de visualizar ticket viewRoad');
        that.openModalVerifed(data.urlFile);
      
    });
  }

  returnsHour(date: any){
    if (date) {
      return moment(date).format('HH:mm');
    } else {
      return '----'
    }
    

  }

  transformData(data: any){
    let values = _.cloneDeep(data);
    /* 
    let indexUserCharger = data.findIndex(x => x.id === 1);

    let indexTime = data.findIndex(x => x.id === 2);

    let indexTemperature = data.findIndex(x => x.id === 3);

    let indexKm = data.findIndex(x => x.id === 4);

    let indexCarburantes = data.findIndex(x => x.id === 5);

    let indexContainers = data.findIndex(x => x.id === 6);

    let indexGastos = data.findIndex(x => x.id === 7);

     */
    

    let dataToShow = [];

    values.forEach(element => {
        if(!(element.firstAnswer == null || element.firstAnswer == 0)){
            dataToShow.push(element);
        }
    });

    values = dataToShow
    let indexTime = values.findIndex(x => x.id === 2);

    if(indexTime > -1){

        
        values[indexTime].firstAnswer = secondsToDayTimeAsString(values[indexTime].firstAnswer);
        values[indexTime].secondAnswer = secondsToDayTimeAsString(values[indexTime].secondAnswer);
        
    }

    return values;
  }

}
