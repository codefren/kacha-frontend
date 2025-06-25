import { ChangeDetectorRef, Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService, FilterState } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { CustomDatepickerI18n, dateToObject, getEndOf, getStartOf, getToday, Language, LoadingService, MomentDateFormatter, objectToString, ToastService } from '@optimroute/shared';
import { StateVehiclesService } from '@optimroute/state-vehicles';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { StateFilterStateFacade } from 'libs/filter-state/src/lib/+state/filter-state.facade';
import { ModalCheckCostComponent } from 'libs/shared/src/lib/components/modal-check-cost/modal-check-cost.component';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { ModalTableVehicleTicketComponent } from './modal-table-vehicle-ticket/modal-table-vehicle-ticket.component';
import * as _ from 'lodash';

declare var $: any;

@Component({
  selector: 'easyroute-table-vehicles',
  templateUrl: './table-vehicles.component.html',
  styleUrls: ['./table-vehicles.component.scss'],
  providers: [
    Language,
    {provide: NgbDateParserFormatter, useClass: MomentDateFormatter},
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
})
export class TableVehiclesComponent implements OnInit, OnDestroy, OnChanges {

  @Input() refreshVehicle: any;
  
  refreshTime: number = environment.refresh_datatable_assigned;

  showTotalized: boolean = false;
  showVehicle: boolean = true;
  showProvidersType: boolean = true;
  showProviders: boolean = true;
  showConcept: boolean = true;

  showProvidersTable: boolean = true;
  showConceptTable: boolean = true;

  disabledProviders: boolean = true;
  disabledConcept: boolean = true;

  disabledProvidersTable: boolean = true;
  disabledConceptTable: boolean = true;

  totalized: any;

  costStatusList: any = [];
  vehicleList: any[] = [];
  providerTypeList: any[] = []; // Listado tipos de proveedores
  providerList: any[] = []; //Listado de proveedores
  conceptList: any[] = []; //Listado concepto de proveedores

  providerTypeListTable: any[] = []; // Listado tipos de proveedores para table
  providerListTable: any[] = []; //Listado de proveedores para table
  conceptListTable: any[] = []; //Listado concepto de proveedores para table

  filter: FilterState = {
    name: 'cost_vehicle',
    values: {
      dateFrom: getStartOf(), //this.getToday(),
      dateTo: getEndOf(), //this.getToday(),
      vehicleId: '',
      providerTypeId: '',
      providerId: '',
      providerTypeConceptId: '',
      costStatusId: ''
    }
  };

  tableCosteVehicle: any;
  timeInterval: any;

  selectAll: boolean = false;
  selected: any = [];
  
  min: NgbDateStruct = dateToObject(moment().format('YYYY-MM-DD'));
  dateMax: any = dateToObject(getToday());
  nextDay: boolean = false;
  today: string;

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDateStruct | NgbDate | null;
	toDate: NgbDateStruct| NgbDate | null;

  showCost: boolean = false;
  showSubHidden: boolean = false;

  disabledBySelect: boolean = false;

  costVehicleForm: FormGroup;

  imageError: string = '';
  base64Image: string;
  

  
  constructor(
    private toastService: ToastService,
    private changeDetectorRef: ChangeDetectorRef,
    private backendService: BackendService,
    private translateService: TranslateService,
    private authLocal: AuthLocalService,
    private calendar: NgbCalendar, 
    private stateFilters: StateFilterStateFacade,
    private loadingService: LoadingService,
    private stateVehiclesService: StateVehiclesService,
    public formatter: NgbDateParserFormatter,
    private _modalService: NgbModal,
  ) { }

  ngOnInit() {

    this.form();

    this.fromDate = dateToObject(getStartOf()); //this.calendar.getToday();
  
    this.toDate = dateToObject(getEndOf()); //this.calendar.getToday();
   
    this.getCostStatus();

  }

  ngOnChanges()  {
    
    if(this.refreshVehicle) {

      this.getCostStatus();

    }

  }

  form(){

    this.costVehicleForm =  new FormGroup({
      vehicleId: new FormControl ('', [Validators.required]),
      providerTypeId: new FormControl ('', [Validators.required]),
      providerId: new FormControl ({value:'', disabled: true}, [Validators.required]),
      providerTypeConceptId: new FormControl ({value:'', disabled: true}, [Validators.required]),
      quantity: new FormControl ('', [ Validators.required , Validators.pattern("^[0-9]*$")]),
      import: new FormControl ('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      creationDate:  new FormControl(dateToObject(getToday())),
      base64Image: new FormControl ('')
    });

  }

  getCostStatus() {

    this.backendService.get('cost_status').pipe(take(1)).subscribe((data) => {
  
      this.costStatusList = data.data;
  
      this.loadFilters();
  
    }, error => {
  
      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  getToday(nextDay: boolean = false) {
    if (nextDay) {
        return moment(new Date().toISOString())
            .add(1, 'day')
            .format('YYYY-MM-DD');
    }

    return moment(new Date().toISOString()).format('YYYY-MM-DD');
  }

  async loadFilters() {
    const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();

    this.filter = filters.find(x => x && x.name === 'cost_vehicle') ? filters.find(x => x.name === 'cost_vehicle') : this.filter;

    if (this.filter.values.dateFrom && this.filter.values.dateTo) {

      this.fromDate = dateToObject(this.filter.values.dateFrom);

  	  this.toDate = dateToObject(this.filter.values.dateTo);
      
    }

    if ( this.filter.values.providerTypeId && !this.filter.values.providerId && !this.filter.values.providerTypeConceptId) {

      this.getSelectProvider(this.filter.values.providerTypeId);

      
    } else if (this.filter.values.providerTypeId && this.filter.values.providerId && !this.filter.values.providerTypeConceptId){


      this.getSelectProvider(this.filter.values.providerTypeId);

      this.getSelectConcept(this.filter.values.providerId);

    } else if (this.filter.values.providerId && this.filter.values.providerTypeId && this.filter.values.providerTypeConceptId ){


      this.getSelectProvider(this.filter.values.providerTypeId);

      this.getSelectConcept(this.filter.values.providerId);
    }

    this.getVehicles();
  }

  getVehicles() {

    this.showVehicle = false;

    this.stateVehiclesService.loadVehicles().pipe(take(1)).subscribe(
        (data: any) => {

            this.vehicleList = data.data;

            this.getProvidersTypeList();

            this.showVehicle = true;

        },
        (error) => {

            this.showVehicle = true;

            this.toastService.displayHTTPErrorToast(
                error.status,
                error.error.error,
            );
        },
    );

  }

  changeSelectVehicle(event: any) {
    let value = event.target.value;
    let id = event.target.id;
    
    this.setFilter(value, id, true);

    this.desabledSelectTable();
  }

  getProvidersTypeList() {

    this.showProvidersType = false;

    this.backendService.get('provider_type_cost_vehicle').pipe(take(1)).subscribe((data) => {

      this.providerTypeList = data.data;

      this.providerTypeListTable = data.data;

      this.loadTotalized(true);

      this.showProvidersType = true;

    }, error => {

      this.showProvidersType = true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  changeSelectProviderType(event: any) {

    let value = event.target.value;

    let id = event.target.id;

    this.filter = {
      ...this.filter,
      values: {
          ...this.filter.values,
          providerId: '',
      }
    }

    this.filter = {
      ...this.filter,
      values: {
          ...this.filter.values,
          providerTypeConceptId: '',
      }
    }

    this.stateFilters.add(this.filter);

    this.setFilter(value, id, true);

    if (value > 0) {

      this.conceptList = [];

      this.disabledConcept = true;

      this.getSelectProvider(value);

    } else {

      this.providerList = [];

      this.conceptList = [];

      this.disabledProviders = true;

      this.disabledConcept = true;

      this.changeDetectorRef.detectChanges();
      
    }

    this.desabledSelectTable();
   
  }

  changeSelectProviderTypeTable(value: any, etiqueta: string) {

    if (value > 0) {

      this.getSelectProvider(value, etiqueta);

    } else {
      this.costVehicleForm.get('providerId').disable();
      this.costVehicleForm.get('providerId').setValue('');
      this.costVehicleForm.get('providerId').updateValueAndValidity();
    }

  }

  getSelectProvider(providerTypeId: number, etiqueta: string =  null) {

    if (etiqueta == null) {
      this.showProviders = false;
      
    } else {
      this.showProvidersTable = false;
    }

    let sentData = {

      providerTypeId: providerTypeId,
  
      providerAssigmentTypeId : 1
  
    }

    this.backendService.post('providers_by_type', sentData).pipe(take(1)).subscribe((data) => {

      if (etiqueta == null) {

        console.log('en el if')

        this.showProviders = true;
        //this.costVehicleForm.get('providerId').disable();
        //this.costVehicleForm.get('providerId').updateValueAndValidity();
        this.providerList = data.data;

        this.disabledProviders = false;

      } else {

        console.log('else getSelectProvider');

        this.costVehicleForm.get('providerId').enable();
        this.costVehicleForm.get('providerId').setValue('');
        this.costVehicleForm.get('providerId').updateValueAndValidity();

        this.costVehicleForm.get('providerTypeConceptId').setValue('');
        this.costVehicleForm.get('providerTypeConceptId').disable();
        this.costVehicleForm.get('providerTypeConceptId').updateValueAndValidity();

        this.showProvidersTable = true;
        this.providerListTable = data.data;
        this.disabledProvidersTable = false;

      }

      this.changeDetectorRef.detectChanges();

    }, error => {

      this.showProviders = true;
      this.showProvidersTable = true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

  changeSelectProvider(event: any) {

    let value = event.target.value;

    let id = event.target.id;

    this.filter = {
      ...this.filter,
      values: {
          ...this.filter.values,
          providerTypeConceptId: '',
      }
    }

    this.stateFilters.add(this.filter);

    this.setFilter(value, id, true);

    if (value > 0) {

      this.getSelectConcept(value);

    } else {

      this.conceptList = [];

      this.disabledConcept = true;

      this.changeDetectorRef.detectChanges();
      
    }

    this.desabledSelectTable();

  }

  changeSelectProviderTable(value: any, etiqueta: string) {

    if (value > 0) {

      this.getSelectConcept(value, etiqueta);

    } else {
      this.costVehicleForm.get('providerTypeConceptId').disable();
      this.costVehicleForm.get('providerTypeConceptId').setValue('');
      this.costVehicleForm.get('providerTypeConceptId').updateValueAndValidity();
    }

  }

  getSelectConcept(providerId: number,  etiqueta: string =  null) {

    if (etiqueta == null) {
      this.showConcept = false;
    } else {
      this.showConceptTable = false;
    }

    this.backendService.post('provider_type_concept_by_provider', { providerId: providerId }).pipe(take(1)).subscribe((data) => {
      
      if (etiqueta == null) {

        this.showConcept = true;
        this.conceptList = data.data;
        this.disabledConcept = false;

      } else {
        
        this.costVehicleForm.get('providerTypeConceptId').enable();
        this.costVehicleForm.get('providerTypeConceptId').updateValueAndValidity();

        this.showConceptTable = true;
        this.conceptListTable = data.data;
        this.disabledConceptTable = false;

      }

      this.changeDetectorRef.detectChanges();

    }, error => {

      this.showConcept = true;
      this.showConceptTable = true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

  changeSelectConcept(event: any) {

    let value = event.target.value;

    let id = event.target.id;
    
    this.setFilter(value, id, true)

    this.desabledSelectTable();
  }

  loadTotalized(updateTable: boolean = false) {
    this.showTotalized = false;
    
    this.backendService
        .post('cost_vehicle_totalized', this.filter.values)
        .pipe(
            take(1)).subscribe(
                (resp: any) => {
                    this.totalized = null;
                    this.totalized = resp;

                    this.showTotalized = true;
                    this.changeDetectorRef.detectChanges();

                    if (updateTable) {
                      this.cargar();
                    }
                },
                (error) => {
                    this.showTotalized = true;

                    this.toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );

  }

  cargar() {

    if (this.tableCosteVehicle) {
        this.tableCosteVehicle.clear();
    }

    let url = environment.apiUrl + 'cost_vehicle_datatables?' +

        (this.filter.values.dateFrom != '' ? '&dateFrom=' +

        this.filter.values.dateFrom : '') +

        (this.filter.values.dateTo != '' ? '&dateTo=' +
        
        this.filter.values.dateTo : '') +

        (this.filter.values.vehicleId != '' ? '&vehicleId=' +

        this.filter.values.vehicleId : '') +

        (this.filter.values.providerTypeId != '' ? '&providerTypeId=' +

        this.filter.values.providerTypeId : '') +

        (this.filter.values.providerId != '' ? '&providerId=' +

        this.filter.values.providerId : '') +

        (this.filter.values.providerTypeConceptId != '' ? '&providerTypeConceptId=' +

        this.filter.values.providerTypeConceptId : '') +

        (this.filter.values.costStatusId != '' ? '&costStatusId=' +

        this.filter.values.costStatusId : '');

    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();

    let table = '#tableCosteVehicle';

    this.tableCosteVehicle = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: true,
        cache: false,
        order: [1, 'desc'],
        columnDefs: [{ targets: 5, type: 'date' }],
        stateSaveParams: function (settings, data) {
            data.search.search = "";
        },
        initComplete: function (settings, data) {
          settings.oClasses.sScrollBody = '';
        },
        lengthMenu: [50, 100],
        dom: `
            <'row'
                <'col-xl-10 col-12 d-flex flex-column justify-content-start align-items-center align-items-md-start p-0'
                    <'col-xl-12 col-md-12 col-12 col-sm-12 pl-2 '>
                >
                <'col-xl-2 col-12 d-flex flex-column justify-content-center align-items-center align-items-md-end p-0'
                    <'row'
                        <'col-sm-6 col-md-6 col-xl-12 col-7 p-0 label-search'>
                    >
                >
            >
            <"top-button-hide"><t>
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
        headerCallback: (thead, data, start, end, display) => {
            $('.buttons-collection').html(
                '<img class="icons-datatable point" src="assets/images/edit_datatable.svg">' +
                ' ' +
                this.translateService.instant('GENERAL.TABLE'),
            );
        },
        buttons: [
            {
                extend: 'colvis',
                text: this.translateService.instant('GENERAL.TABLE'),
                columnText: function (dt, idx, title) {
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
              data:'id',
              sortable: false,
              searchable: false,
              buttons: false,
              render: (data, type, row) => {
                return (`
                    <div class="row justify-content-center backgroundColorRow">
                      <div class="round-style-cost round-little-cost text-center">
                        <input type="checkbox" class="isActive" id="ck-${data}"  />
                        <label></label>
                      </div>
                    </div>
                `);
              }
            },
            {
              data: 'creationDate',
              className:'text-left',
              title: this.translateService.instant('COST.COST_VEHICLE.DATE'),
              render: (data, type, row) => {
                  return moment(data).format('DD/MM/YYYY');
              },
            },
            {
              data: 'vehicle.registration',
              className:'text-left',
              title: this.translateService.instant('COST.COST_VEHICLE.VEHICLE'),
              render: (data, type, row) => {
                  if (data != null) {
                      return '<span class="text-center">' + data +'</span>';
                  } else {
                      return '<span class="text-center"> No disponible </span>';
                  }
              },
          },
            {
              data: 'provider_type.name',
              className:'text-left',
              title: this.translateService.instant('COST.COST_VEHICLE.TYPE'),

              render: (data, type, row) => {
                 
                  let name ='Empresa';
                  if (data != null) {
                      return '<span class="text-center">' + data + '</span>';
                  } else {
                      return '<span class="text-center"> '+'no disponible'+' </span>';
                  }
              },
            },
            {
              data: 'provider.name',
              className:'text-left',
              title: this.translateService.instant('COST.COST_VEHICLE.PROVIDER'),
              render: (data, type, row) => {
                
                  let name='Empresa';
                  if (data != null) {
                      return '<span class="text-center">' + data + '</span>';
                  } else {
                      return '<span class="text-center"> '+name+' </span>';
                  }
              },
          },
          {
              data: 'provider_type_concept.name',
              className:'text-left',
              title: this.translateService.instant('COST.COST_VEHICLE.CONCEPT'),
              render: (data, type, row) => {


                  if (data != null) {

                      return '<span class="text-center">' + data + '</span>';

                  } else {

                      return '<span class="text-center"> '+'No disponible'+' </span>';

                  }
              },
          },
          {
              data: 'quantity',
              className:'text-left',
              title: this.translateService.instant('COST.COST_VEHICLE.UNI_LIT'),
              render: (data, type, row) => {

                    if (data != null) {
  
                      return '<span class="text-center">' + data + '</span>';
  
                  } else {
  
                      return '<span class="text-center"> '+'No disponible'+' </span>';
  
                  }

              },
          },
          {
              data: 'import',
              className:'text-left',
              title: this.translateService.instant('COST.COST_VEHICLE.AMOUNT'),
              render: (data, type, row) => {
                  if (data) {
                      return '<span class="text-center">' + this.decimal(data) + '</span>';
                  } else {
                      return '<span class="text-center"> '+'No disponible'+' </span>';
                  }
              },

          },
          {
            data: 'urlImage',
            title: this.translateService.instant('COST.COST_VEHICLE.ATTACH'),
            render: (data, type, row) => {
              let option = 'Adjunto';

              if(data !== null){
                return '<button type="button" id="btnTicket-'+row.id+'" style="width: 94px; border-radius: 5px !important;" class="btn btn-block button-blue-coste btn-sm attached"><img src="assets/icons/click.svg">' +
                          option +
                        '</button>'
              } else {

                return '<button type="button" id="btnTicket-'+row.id+'" style="width: 94px; border-radius: 5px !important;" class="btn btn-block button-gray-cost btn-sm no-point"><img src="assets/icons/click.svg">' +
                          option +
                        '</button>'
              }
            },
          },
          {
            data: 'cost_status.id',
            sortable: false,
            searchable: false,
            className:'text-left',
            title: this.translateService.instant('COST.COST_VEHICLE.REVISION'),
            render: (data, type, row) => {

              if(data === 2){
                return `
                    <div class="btn-group" style="display: block;">
                      <button type="button" id="btn-${row.id}"  class="btn btn-sm button-green-cost">
                        <img  src="assets/icons/cost-circle-green.svg">
                      </button>
                      <button type="button" id="btn1-${row.id}" class="btn btn-sm button-green-cost size-btn">Verificado</button>
                    </div>
                  `
              } else if(data ===1 ){

                return `
                    <div class="btn-group" style="display: block;">
                      <button type="button" id="btn-${row.id}"  class="btn btn-sm button-gray-cost checkCost">
                        <img class="point" src="assets/icons/cost-circle-white.svg">
                      </button>
                      <button type="button" id="btn1-${row.id}" class="btn btn-sm button-gray-cost checkCost size-btn">Pendiente</button>
                    </div>
                  `
              } else {

                return `
                  <div class="btn-group" style="display: block;">
                    <button type="button" id="btn-${row.id}"  class="btn btn-sm button-gray-delete-cost">
                      <img class="point" src="assets/icons/cost-circle-white.svg">
                    </button>
                    <button type="button" id="btn1-${row.id}" class="btn btn-sm button-gray-delete-cost size-btn">Rechazado</button>
                  </div>
                `
              }
            },
          },
        ],
    });
    $('.dataTables_filter').html(`
      <div class="d-flex justify-content-md-end justify-content-center">
          <div class="input-group datatables-input-group-width">
              <input 
                  id="search" 
                  type="text" 
                  class="form-control search-general
                  pull-right input-personalize-datatable" 
                  placeholder="Buscar"
                  style="max-width: initial;"
              >
              <span class="input-group-append">
                  <span class="input-group-text input-group-text-general table-append">
                      <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                  </span>
              </span>
          </div>
      </div>
    `);

    $('#search').on('keyup', function () {
        $(table).DataTable().search(this.value).draw();
    });

    $('.dataTables_filter').removeAttr("class");

    this.initEvents(table + ' tbody', this.tableCosteVehicle);

  }

  initEvents(tbody: any, table: any, that = this) {
    $(tbody).unbind();
    window.clearInterval(this.timeInterval);
    this.attached(tbody, table);
    this.checkCost(tbody, table);
    this.select(tbody, table);
  }

  attached(tbody: any, table: any, that = this) {
    $(tbody).on('click', '.attached', function () {
          let data = table.row($(this).parents('tr')).data();

          that.modalTicket(data);
      });
  }

  modalTicket(data: any) {
    const modal = this._modalService.open(ModalTableVehicleTicketComponent, {
      backdropClass: 'modal-backdrop-ticket',
      centered: true,
      windowClass:'modal-cost-vehicle',
      size:'md'
    });
    
    modal.componentInstance.data = data.urlImage;
  }
  
  checkCost(tbody: any, table: any, that = this) {
      $(tbody).on('click', '.checkCost', function () {
          let data = table.row($(this).parents('tr')).data();

          that.openModalCheckCost(data);
      });
  }

  openModalCheckCost(dataTable: any) {
    const modal = this._modalService.open(ModalCheckCostComponent, {
      backdropClass: 'modal-backdrop-ticket',
      centered: true,
      windowClass:'modal-cost',
      size:'md'
    });
  
    modal.componentInstance.title = this.translateService.instant('COST.CHECK_COST');
    modal.componentInstance.Subtitle = this.translateService.instant('COST.ARE_YOU_SURE_YOU_WANT_TO_CHECK_THE_COST');
    modal.componentInstance.message = this.translateService.instant('COST.ONE_IT_PASSES_TO_VERIFIED_STATUS_THE_COSTS_WILL_BE_RECALCULATED_AND_WILL_BE_REFLECTED_IN_THE_REPORTS');

    modal.componentInstance.accept =  this.translateService.instant('COST.YES_CHECK');
  
    modal.result.then(
      (data) => {
        if (data) {

          let send = {
            costs : [dataTable.id]
          };

          this.updateStatusCost(send);
        
        }      
      },
      (reason) => {
        
      },
    ); 
  }

  updateStatusCost(data: any){

    this.backendService.post('cost_update_verified', data).pipe(take(1)).subscribe((data) => {
  
      this.toastService.displayWebsiteRelatedToast(
        this.translateService.instant('GENERAL.UPDATE_SUCCESSFUL'),
        this.translateService.instant('GENERAL.ACCEPT'),
    );
  
    this.selectAll= false;
  
    this.selectAllFunc();
  
    this.tableCosteVehicle.ajax.reload();
  
    }, error => {
  
      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
  
    });
  
  }

  

  openModalVerifiedAll(selected: any) {

    const modal = this._modalService.open(ModalCheckCostComponent, {
      backdropClass: 'modal-backdrop-ticket',
      centered: true,
      windowClass:'modal-cost',
      size:'md'
    });
  
    modal.componentInstance.title = this.translateService.instant('COST.CHECK_COST');
    modal.componentInstance.Subtitle = this.translateService.instant('COST.MESSAGE_CHECK_COST_SELECT');
    modal.componentInstance.message = this.translateService.instant('COST.MESSAGE_SUB_CHECK_COST_SELECT');

    modal.componentInstance.accept =  this.translateService.instant('COST.YES_CHECK');
  
    modal.result.then(
      (data) => {
        if (data) {
          
          let sentAll = {
            costs: selected
          };

          this.updateStatusCost(sentAll);
        }      
      },
      (reason) => {
        
      },
    ); 
  }

  openModalDeleteAll(selected: any) {

    const modal = this._modalService.open(ModalCheckCostComponent, {
      backdropClass: 'modal-backdrop-ticket',
      centered: true,
      windowClass:'modal-cost',
      size:'md'
    });
  
    modal.componentInstance.title = this.translateService.instant('COST.DELETE');
    modal.componentInstance.Subtitle = this.translateService.instant('COST.MESSAGE_DELETE_SELECT');
    modal.componentInstance.message = this.translateService.instant('COST.MESSAGE_SUB_DELETE_SELECT');

    modal.componentInstance.accept =  this.translateService.instant('COST.PERMANENTLY_DELETE');
    modal.componentInstance.cssStyle = 'btn btn-red-general';

    modal.result.then(
      (data) => {
        if (data) {
        
          let sentAll = {

            costs :selected

          };

          this.deleteCost(sentAll);

        }      
      },
      (reason) => {
        
      },
    ); 
  }

  deleteCost(data: any){
    this.backendService.post('cost_update_rejected', data).pipe(take(1)).subscribe((data) => {

      this.toastService.displayWebsiteRelatedToast(
        this.translateService.instant('GENERAL.COST_TO_REMOVE_SUCCESSFULLY'),
        this.translateService.instant('GENERAL.ACCEPT'),
      );
    
      this.selectAll= false;
    
      this.selectAllFunc();
    
      this.tableCosteVehicle.ajax.reload();
  
    }, error => {
  
      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
  
    });
  }


  filterStausRevision(){
    this.showCost = ! this.showCost;

    if (this.showSubHidden) {
      this.showSubHidden = !this.showSubHidden
    }

    this.desabledSelectTable();
  }

  openSubList(){

    this.showSubHidden = !this.showSubHidden;
  
  }
  
  filterSelected(event:any, values?: any){

    let value = values.id ? values.id: '';
  
    let id = event.target.id;
  
    this.setFilter(value, id, true);
  
    this.showCost = !this.showCost;
  
    this.showSubHidden =!this.showSubHidden;

    this.desabledSelectTable();
  
  }




  selectAllFunc() {
    this.tableCosteVehicle.rows()[0].forEach((element) => {

        let data = this.tableCosteVehicle.row(element).data();

        var index = this.selected.findIndex(x => x === data.id);

        if (this.selectAll) {

            var x = this.selected.filter(x => x == data.id);

            if (x.length == 0) {

                this.selected.push(data.id);

                $('#ck-' + data.id).prop('checked', true);

                $('#btn-' + data.id).prop('disabled', true);

                $('#btn1-' + data.id).prop('disabled', true);

                $('#cost-v-thead-1').addClass('hidden');

                $('#cost-v-thead-2').removeClass('hidden');

                //$(this.tableCosteVehicle.row(element).node()).addClass('selected');

                this.costVehicleForm.disable();
            }

        } else {

            $('#ck-' + data.id).prop('checked', false);

            $('#btn-' + data.id).prop('disabled', false);

            $('#btn1-' + data.id).prop('disabled', false);

            $('#cost-v-thead-1').removeClass('hidden');

            $('#cost-v-thead-2').addClass('hidden');

            //$(this.tableCosteVehicle.row(element).node()).removeClass('selected');

            $('#checkboxVehicleCost').prop('checked', false).removeAttr('checked');

            this.selected.splice(index, 1);

            this.selected = [];

            this.costVehicleForm.enable();

        }

        this.changeDetectorRef.detectChanges();
    });
  }

  select(tbody: any, table: any, that = this) {

    $(tbody).on('click', '.backgroundColorRow', function () {

        let data = table.row($(this).parents('tr')).data();
        that.selectAll = true;
        var index = that.selected.findIndex((x:any) => x === data.id);

        if (index === -1) {

            that.selected.push(data.id);

            $('#ck-' + data.id).prop('checked', true);

            $('#btn-' + data.id).prop('disabled', true);

            $('#btn1-' + data.id).prop('disabled', true);

            $('#cost-v-thead-1').addClass('hidden');

            $('#cost-v-thead-2').removeClass('hidden');

            if(that.tableCosteVehicle.rows()[0].length == that.selected.length) {

              $('#checkboxVehicleCost').prop('checked', that.selectAll).addClass('checked');
           
              $('#checkboxVehicleCost1').prop('checked', that.selectAll).addClass('checked');
            }

            that.tableCosteVehicle.rows()[0].forEach((element) => {

              let disabled = that.tableCosteVehicle.row(element).data();
    
              $('#btn-' + disabled.id).prop('disabled', true);
    
              $('#btn1-' + disabled.id).prop('disabled', true);   
               
            });

            that.costVehicleForm.disable();

        } else {

          that.selectAll = false;

            that.selected.splice(index, 1);

            $('#ck-' + data.id).prop('checked', false);

            $('#btn-' + data.id).prop('disabled', false);

            $('#btn1-' + data.id).prop('disabled', false);

            //$(this).parent().parent().removeClass('selected');

            $('#checkboxVehicleCost').prop('checked', that.selectAll).removeAttr('checked');

            $('#checkboxVehicleCost1').prop('checked', that.selectAll).removeAttr('checked');

            that.tableCosteVehicle.rows()[0].forEach((element) => {

              let disabled = that.tableCosteVehicle.row(element).data();

              if (that.selected.length === 0) {
    
                $('#btn-' + disabled.id).prop('disabled', false);
      
                $('#btn1-' + disabled.id).prop('disabled', false);

                $('#cost-v-thead-1').removeClass('hidden');

                $('#cost-v-thead-2').addClass('hidden');

                that.costVehicleForm.enable();

              }
               
            });

        }

        that.tableCosteVehicle.rows()[0].forEach((element) => {

            if (that.selected.find(x => +x.id === +  that.tableCosteVehicle.row(element).data().id) === undefined) {

              that.selectAll = false;

            }
        });

        that.changeDetectorRef.detectChanges();
    });
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
    
      this.loadTotalized(true);
      
      this.stateFilters.add(this.filter);
  
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
  
      this.toDate = date;
  
      this.filter = {
        ...this.filter,
        values: {
          ...this.filter.values,
          dateTo: objectToString(date),
        }
      }
    
      this.loadTotalized(true);
    
      this.stateFilters.add(this.filter);
  
    } else {
  
      this.filter = {
        ...this.filter,
        values: {
            ...this.filter.values,
            dateFrom: objectToString(date),
            dateTo: objectToString(null)
        }
      }
    
      this.toDate = null;
    
      this.fromDate = date;
    
      this.stateFilters.add(this.filter);
      
    }

    this.desabledSelectTable();
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
  
  validateInput(currentValue: NgbDateStruct | null, input: string): NgbDateStruct | null {

    const parsed = this.formatter.parse(input);
  
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? parsed : currentValue;
  
  }



  setFilter(value: any, property: string, sendData?: boolean) {

    this.filter = {
        ...this.filter,
        values: {
            ...this.filter.values,
            [property]: value
        }
    } 

    if (this.selectAll) {

      this.selectAll = false;

      this.selectAllFunc();
     
    } else {
      this.selectAllFunc();
      
      this.selectAll = false;
     
    }

    this.stateFilters.add(this.filter);
   
    if (sendData && !this.selectAll && this.selected.length === 0) {
      
      this.loadTotalized(true);

      this.changeDetectorRef.detectChanges();
    }
  }

  decimal(numb) {

    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numb);
  
  }

  fileChanceEvent(fileInput: any) {
    
    this.imageError = '';

    if (fileInput.target.files && fileInput.target.files[0]) {

        const max_size = 1000000;
        const allowed_types = ['image/png', 'image/jpeg'];
        //const max_height = 300;
        //const max_width = 300;

        if (fileInput.target.files[0].size > max_size) {
            this.imageError = 'Tamaño máximo permitido ' + max_size / 1000 / 1000 + 'Mb';
            
            this.toastService.displayWebsiteRelatedToast(
              this.imageError,
              this.translateService.instant('GENERAL.ACCEPT'),
            );
            this.removeImage();
            return false;
        }

        if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
            this.imageError = 'Formatos permitidos ( JPG | PNG )';
            this.toastService.displayWebsiteRelatedToast(
              this.imageError,
              this.translateService.instant('GENERAL.ACCEPT'),
            );
            this.removeImage();
            return false;
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = (rs) => {

                /* const img_height = rs.currentTarget['height'];
                const img_width = rs.currentTarget['width']; */

                /* if (img_height > max_height || img_width > max_width) {
                    this.imageError = this.translateService.instant('GENERAL.RECOMMENDED_SIZE');
                    this.toastService.displayWebsiteRelatedToast(
                      this.imageError,
                      this.translateService.instant('GENERAL.ACCEPT'),
                    );
                    this.removeImage();
                    return false;
                } */
                    
                const imgBase64Path = e.target.result;
                this.costVehicleForm.get('base64Image').setValue(imgBase64Path);
                this.changeDetectorRef.detectChanges();
            };
        };

        reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  removeImage() {
    this.costVehicleForm.get('base64Image').setValue('');
    this.costVehicleForm.get('base64Image').updateValueAndValidity();
  }
  

  submitCost(){

    this.loadingService.showLoading();

    let dataform = _.cloneDeep(this.costVehicleForm.value);
  
    dataform.creationDate = objectToString(this.costVehicleForm.value.creationDate);

    let sendImport = dataform.quantity * dataform.import;
    
    dataform.import = sendImport.toFixed(2);
  
    this.backendService.post('cost_vehicle_store', dataform).pipe(take(1)).subscribe((data) => {
      
      this.toastService.displayWebsiteRelatedToast(
        this.translateService.instant('GENERAL.REGISTRATION'),
        this.translateService.instant('GENERAL.ACCEPT'),
      );
  
      this.costVehicleForm.reset();
  
      this.costVehicleForm.get('vehicleId').setValue('');
  
      this.costVehicleForm.get('providerTypeId').setValue('');
      
      this.costVehicleForm.get('providerId').disable();
  
      this.costVehicleForm.get('providerId').setValue('');
  
      this.costVehicleForm.get('providerTypeConceptId').setValue('');
  
      this.costVehicleForm.get('providerTypeConceptId').disable();
      
      this.costVehicleForm.get('quantity').setValue('');
  
      this.costVehicleForm.get('import').setValue('');
  
      this.costVehicleForm.get('creationDate').setValue(dateToObject(getToday()));

      this.costVehicleForm.get('base64Image').setValue('');

  
  
  
      this.costVehicleForm.get('vehicleId').updateValueAndValidity();
  
      this.costVehicleForm.get('providerTypeId').updateValueAndValidity();
  
      this.costVehicleForm.get('providerId').updateValueAndValidity();
  
      this.costVehicleForm.get('providerTypeConceptId').updateValueAndValidity();
  
      this.costVehicleForm.get('quantity').updateValueAndValidity();
  
      this.costVehicleForm.get('import').updateValueAndValidity();
  
      this.costVehicleForm.get('creationDate').updateValueAndValidity();

      this.costVehicleForm.get('base64Image').updateValueAndValidity();


      this.loadingService.hideLoading();

      this.changeDetectorRef.detectChanges();
  
      this.loadTotalized(false);
  
      this.tableCosteVehicle.ajax.reload();

    }, error => {

      this.loadingService.hideLoading();

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);

    });

  }

  selectConcept(value: any){

    let price = this.conceptListTable.find(x => x.id === Number(value)).price;
  
    
    if (price) {
      this.costVehicleForm.get('quantity').setValue(1);
      this.costVehicleForm.get('quantity').updateValueAndValidity();
      this.costVehicleForm.get('import').setValue(price);
      this.costVehicleForm.get('import').updateValueAndValidity();
    }
  }


  desabledSelectTable(){

    console.log(this.costVehicleForm.controls.providerTypeId.value);
    if(!this.costVehicleForm.controls.providerTypeId.value){
      this.costVehicleForm.get('providerId').disable();
  
      this.costVehicleForm.get('providerTypeConceptId').disable();
    }
    
  }


  ngOnDestroy() {
    this.tableCosteVehicle.destroy();
    window.clearInterval(this.timeInterval);
  }

}
