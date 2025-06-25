import { take, takeUntil } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
declare var $: any;
import * as moment from 'moment';
import * as _ from 'lodash';

import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../../apps/easyroute/src/environments/environment';
import { Subject, Observable } from 'rxjs';
import { Profile } from '../../../../../backend/src/lib/types/profile.type';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { MeasureService } from '../../../../../measure/src/lib/measure.service';
import { Router } from '@angular/router';
import { ProfileSettingsFacade } from '../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { User } from '../../../../../backend/src/lib/types/user.type';
import { StateUsersFacade } from '../../../../../state-users/src/lib/+state/state-users.facade';
import { Filter } from '../../../../../backend/src/lib/types/filter.type';
import { Language, MomentDateFormatter, CustomDatepickerI18n, dateToObject, getToday, objectToString, getStartOf, getEndOf } from '../../../../../shared/src/lib/util-functions/date-format';
import { ModalSearchClientComponent } from './modal-search-client/modal-search-client.component';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { FormControl } from '@angular/forms';
import { StateFilterStateFacade } from '@easyroute/filter-state';
import { FilterState } from 'libs/backend/src/lib/types/filter-state.type';
import { ModalViewPdfGeneralComponent } from 'libs/shared/src/lib/components/modal-view-pdf-general/modal-view-pdf-general.component';
import { BackendService } from '@optimroute/backend';
import { ModalViewDetailComponent } from './modal-view-detail/modal-view-detail.component';
declare function init_plugins();
@Component({
  selector: 'easyroute-devolution-list',
  templateUrl: './devolution-list.component.html',
  styleUrls: ['./devolution-list.component.scss'],
  providers: [
    Language,
    { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
],
})
export class DevolutionListComponent implements OnInit {

  table: any;
  unsubscribe$ = new Subject<void>();
  profile: Profile;
  showInfoDetail: boolean = true;
  informativeDevolution: any;
  users: Observable<User[]>;
  filter: FilterState = {
    name: 'devolution',
    values:{
        deliveryPointId: '',
        dateFrom: getToday(), //getStartOf(), //this.getToday(),
        dateTo: getToday(), //getEndOf(),
        userDriverId:'',
        nameClient:''
    }

  };
  model: any;

  model2: any;

  disabledateto: boolean = true;

  showIntervalFiel: boolean;

  typeInterval: string = 'hoy';

  dateNow: NgbDateStruct;

  today: string;

  datemin: any;

  dateMax: any;


  dateFrom: string = 'from';

  datedateTo: string = 'To';

  clientName: any;

  fromDate: NgbDateStruct | null;

  toDate: NgbDateStruct | null;

  hoveredDate: NgbDate | null = null;

  placement = 'bottom';

  constructor(
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    private _modalService: NgbModal,
    private _toastService: ToastService,
    private _measureService: MeasureService,
    private _router: Router,
    private calendar: NgbCalendar,
    public facadeProfile: ProfileSettingsFacade,
    public formatter: NgbDateParserFormatter,
    private usersFacade: StateUsersFacade,
    private changeDetect: ChangeDetectorRef,
    private stateFilters: StateFilterStateFacade,
    private stateEasyrouteService: StateEasyrouteService,
    private backend: BackendService
  ) { }

  ngOnInit() {
    setTimeout(()=>{
        init_plugins();
    }, 1000);
    this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
        if (loaded) {

            this.facadeProfile.profile$
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((data) => {
                    this.profile = data;
                });
        }
    });

    this.loadFilters();


}

async loadFilters() {

    const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();

    this.filter = filters.find(x => x && x.name === 'devolution') ? filters.find(x => x.name === 'devolution') : this.filter;

    if (this.filter.values.dateFrom && this.filter.values.dateTo) {

      this.fromDate = dateToObject(this.filter.values.dateFrom);

      this.toDate = dateToObject(this.filter.values.dateTo);

    } else {

      this.fromDate = dateToObject(getStartOf()); //this.calendar.getToday();

      this.toDate = dateToObject(getEndOf()); //this.calendar.getToday();
    }

    this.cargar();
    this.getResument();
    this.getUsers();

  }

getUsers() {
  this.usersFacade.loadAllDriver();

  this.users = this.usersFacade.allUsersDrivers$;

  this.users.subscribe((data) => {
  });
}

cargar() {


    let url =
        environment.apiUrl +
        'route_planning/delivery_point/datatablesDevolution?' +
        '&dateFrom=' +
        this.filter.values.dateFrom +
        '&dateTo=' +
        this.filter.values.dateTo +
        '&deliveryPointId=' +
        this.filter.values.deliveryPointId +
        '&userDriverId=' +
        this.filter.values.userDriverId;


    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#devolution';

    this.table = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: true,
        stateSaveParams: function (settings, data) {
            data.search.search = "";
        },
        cache: false,
        order: [0, 'desc'],
        lengthMenu: [50, 100],
        language: environment.DataTableEspaniol,
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
        /* dom: `
            <'row'
                <'col-sm-8 col-xl-8 col-lg-7 col-md-5 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
                <'col-sm-4 col-xl-3 col-lg-4 col-md-5 col-12 label-search'f>
                <'col-sm-3 col-xl-1 col-lg-1 col-md-2 col-12'
                <'row p-0 justify-content-md-end justify-content-center'>
                <'buttonDom'>
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
        `, */
        buttons: [
            {
                extend: 'colvis',
                text: '',
                columnText: function (dt, idx, title) {
                    return title;
                },
            },
        ],
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
                data: 'route_planning_route.dateDeliveryStart',
                title: this._translate.instant('DEVOLUTION.DELIVERY_DATE'),
                render: (data, type, row) => {
                    if (!data) {
                        return '<span class="text center" aria-hidden="true"> No disponible</span>';
                    }

                    return (
                        '<span data-toggle="tooltip" data-placement="top">' +
                            moment( data).format('DD/MM/YYYY') +
                        '</span>'
                    );
                },
            },
            {
                data: 'delivery_point.name',
                title: this._translate.instant('DEVOLUTION.CLIENT'),
                render: (data, type, row) => {
                    let name = data;
                    if (name.length > 30) {
                        name = name.substr(0, 29) + '...';
                    }
                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        name  +
                        '">' +
                        name +
                        '</span>'
                    );
                },
            },
            {
                data: 'user_driver',
                title: this._translate.instant('DEVOLUTION.DRIVER'),
                render: (data, type, row) => {

                    if (data.length > 30) {
                        data = data.substr(0, 29) + '...';
                    }
                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        data+
                        '">' +
                        data +
                        '</span>'
                    );
                },
            },
            {
                data: 'returnedProducts',
                sortable: false,
                title: this._translate.instant('DEVOLUTION.RETURNED_PRODUCTS'),
                render: (data, type, row) => {
                    if (data == null || data == 0) {
                        return '<p class="text center" aria-hidden="true"> No disponible</p>';
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
                data: 'devolutionDeliveryNote',
                title: this._translate.instant('DEVOLUTION.OBSERVATIONS'),
                render: (data, type, row) => {
                    let name = data;

                    if (data) {

                        if (name.length > 30) {
                            name = name.substr(0, 29) + '...';
                        }

                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            name  +
                            '">' +
                            name +
                            '</span>'
                        );

                    } else {
                      return '<p class="text center" aria-hidden="true"> No disponible</p>';
                    }

                },
            },
            {
                data: null,
                sortable: false,
                searchable: false,
                //title: this._translate.instant('DEVOLUTION.ACTIONS'),
                render: (data, type, row) => {
                    let botones = '';

                    botones += `
                        <div class="text-center editar reset">
                            <img class="point" src="assets/icons/External_Link.svg">
                        </div>
                    `;

                    return botones;
                },
            },
        ],
    });
    /* $('.dataTables_filter').html(`
         <div class="d-flex justify-content-md-end justify-content-center mr-xl-2">
                <div class="input-group datatables-input-group-width">
                    <input
                        id="search"
                        type="text"
                        class="form-control
                        pull-right input-personalize-datatable"
                        placeholder="Buscar"
                        style="max-width: initial;"
                    >
                    <span class="input-group-append">
                        <span class="input-group-text table-append">
                            <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                        </span>
                    </span>
                </div>
            </div>
    `); */

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
    $('.buttonDom').html(`
        <div class="row p-0 justify-content-sm-end justify-content-center">
                <div id="refresh" class="col-12 text-xl-left text-center refresh" >
                    <img  class="img-refresh" src="assets/icons/optimmanage2/iconorefresh.svg">
                </div>
        </div>
    `);


    $('.refresh').click(() => {

        this.refresh();
    });
    this.editar('#devolution tbody', this.table);
    this.isActive('#devolution tbody', this.table);
}

editar(tbody: any, table: any, that = this) {
    $(tbody).unbind();

    $(tbody).on('click', 'div.editar', function() {
        let data = table.row($(this).parents('tr')).data();

       // that._router.navigate(['control-panel/devolution/', data.id]);
       that.viewModalDetils(data);
    });
}

isActive(tbody: any, table: any, that = this) {
    $(tbody).on('click', '.isActive', function() {
        let data = table.row($(this).parents('tr')).data();
        that.activateMeasure(data.id, !data.isActive, data);
    });
}

viewModalDetils(data: any){

    const modal = this._modalService.open(ModalViewDetailComponent, {

        backdrop: 'static',

        size:'lg',

        backdropClass: 'modal-backdrop-ticket',

        windowClass:'modal-devolution',

        centered: true

    });

    modal.componentInstance.id =  data.id;

    modal.result.then((data: any) => {
        if (data) { }
    });

}

activateMeasure(productId: number, element: any, product: any) {

   /*  let data = {
        isActive: element,
        name: product.name
    };

    const modal = this.dialog.open(MeasureModalActiveComponent, {
        backdrop: 'static',
        backdropClass: 'customBackdrop',
        centered: true,
    });

    modal.componentInstance.data = data;

    modal.result.then(
        (result) => {
            if (result) {
                this.editActiveMeasure(productId, data);
            } else {
                element = !element;
            }
        },
        (reason) => {
            this._toastService.displayHTTPErrorToast(reason.status, reason.error.error);
        },
    ); */

}

ngOnDestroy() {
    this.unsubscribe$.complete();
    this.unsubscribe$.next();
}

ChangeFilter(event) {
  let value = event.target.value;

  let id = event.target.id;

  this.validateData(value, id);
}

changeFilterGeneral(event: any){

    let value = event.target.value;

    let id = event.target.id;

    this.setFilter(value, id, true);

  }


validateData(value: any, id: string) {

  if (id === 'interval') {
      this.checkInterval(value);
  } else if (id === 'dateFrom' || id === 'dateTo') {
      //this.checkDateInterval( value, id );
  } else {
      this.setFilter(value, id, true);
  }
}

checkInterval(value: any) {
  if (value === 'todas') {
      this.setFilter('', 'date', false);
      this.setFilter('', 'dateTo', false);
      this.setFilter('', 'dateFrom', true);
      this.setFilter('', 'deliveryTomorrow', false);
      this.model = '';
      this.model2 = '';
      this.disabledateto = true;
  } else if (value === 'hoy') {
      this.setFilter(this.getToday( false ), 'date', false);
      this.setFilter('', 'dateTo', false);
      this.setFilter('', 'dateFrom', true);
      this.setFilter('', 'deliveryTomorrow', false);
      this.model = '';
      this.model2 = '';
      this.disabledateto = true;
  } else if(value === 'mañana'){
    this.setFilter('', 'date', false);
    this.setFilter('', 'dateTo', false);
    this.setFilter('', 'dateFrom', false);
    this.setFilter(this.getToday( true ), 'deliveryTomorrow', true);
    this.model = '';
    this.model2 = '';
    this.disabledateto = true;
  } else {
    this.setFilter('', 'deliveryTomorrow', false);
    this.setFilter('', 'date', false);
  }

  this.showInterval(value);
}

showInterval(value: string) {
  if (value === 'por fecha') {
      this.showIntervalFiel = true;
  } else {
      this.showIntervalFiel = false;
  }
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
    this.getResument()
  }
}



getToday( nextDay: boolean = false ) {

  if ( nextDay ) {
    return  moment(new Date().toISOString()).add( 1, 'day' ).format('YYYY-MM-DD');
  }

  return moment( new Date().toISOString() ).format('YYYY-MM-DD');
}

getDate(date: any, name: any) {
  if (name == 'from') {
      this.disabledateto = false;

      this.dateMax = date;

      this.filter.values.dateFrom = moment(
          `${date.year}-${date.month
              .toString()
              .padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`,
      ).format('YYYY-MM-DD');
  } else {
      this.filter.values.dateTo = moment(
          `${date.year}-${date.month
              .toString()
              .padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`,
      ).format('YYYY-MM-DD');
      this.cargar();
      this.getResument()
  }
}



editActiveMeasure(productId: number, element: any) {
    this._measureService.updateMeasure(productId, element).subscribe(
        (data: any) => {
            this._toastService.displayWebsiteRelatedToast(
                this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                this._translate.instant('GENERAL.ACCEPT'),
            );
            this.table.ajax.reload();
        },
        (error) => {
            this._toastService.displayHTTPErrorToast(error.status, error.error.error);
        },
    );
}

openDowloadDevolution(){


    this.stateEasyrouteService.getPdfDEvolution(this.filter);


}

showSentProductFranshise (){
    if ( this.profile &&
        this.profile.company &&
        this.profile.company.companyParentId != null
        ) {
            return false;
        }
        else{
            return true
        }
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

getResument() {
    let data = {

        dateFrom: this.filter.values.dateFrom,
        dateTo: this.filter.values.dateTo,
        date: this.filter.values.date,
        deliveryPointId: this.filter.values.deliveryPointId,
        userDriverId:this.filter.values.userDriverId
    };
    this.showInfoDetail = false;

    this.stateEasyrouteService
        .getInformativeDevolution(data)
        .pipe(take(1))
        .subscribe(
            (data: any) => {

                this.informativeDevolution = data.dataDevolution;


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

clearClient(){

    this.clientName = '';

    this.filter = {
        ...this.filter,
        values: {
            ...this.filter.values,
            deliveryPointId: '',

        }
    }

    this.stateFilters.add(this.filter);

    this.changeDetect.detectChanges();

    this.cargar();

    this.getResument();

}

refresh() {
  this.table.ajax.reload();
  this.getResument();
}


changeDate(name: string, dataEvent: NgbDate) {

    if (name == 'from') {

        this.filter = {

            ...this.filter,

            values: {

                ...this.filter.values,

                dateDeliveryStart: objectToString(dataEvent)
            }
        }

        this.stateFilters.add(this.filter);

    }


   // this.getAssigned();



}

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
                dateTo:objectToString(null)
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

  exelDonwload(){

  }

  openPdf() {

    let url = 'route_planning/print_devolution?' +

    (this.filter.values.dateFrom != '' ? '&dateFrom=' +
     this.filter.values.dateFrom : '') +

    (this.filter.values.dateTo != '' ? '&dateTo=' +
        this.filter.values.dateTo : '') +

    (this.filter.values.deliveryPointId != '' ? '&deliveryPointId=' +
        this.filter.values.deliveryPointId : '')+

    (this.filter.values.userDriverId != '' ? '&userDriverId=' +
        this.filter.values.userDriverId : '');

    const modal = this._modalService.open( ModalViewPdfGeneralComponent, {

        backdropClass: 'modal-backdrop-ticket',

        centered: true,

        windowClass:'modal-view-pdf',

        size:'lg'

      });


      modal.componentInstance.url = url;

      modal.componentInstance.title = this._translate.instant('DEVOLUTION.NAME');
  }

  openCsv() {



    let url ='route_planning/excel_devolution?' +

    (this.filter.values.dateFrom != '' ? '&dateFrom=' +
     this.filter.values.dateFrom : '') +

    (this.filter.values.dateTo != '' ? '&dateTo=' +
        this.filter.values.dateTo : '') +

    (this.filter.values.deliveryPointId != '' ? '&deliveryPointId=' +
        this.filter.values.deliveryPointId : '')+

    (this.filter.values.userDriverId != '' ? '&userDriverId=' +
        this.filter.values.userDriverId : '');

    return this.backend.getDownloadExcel(url, 'Devolution').then((data: string)=>{ })
  }



}
