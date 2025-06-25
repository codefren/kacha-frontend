import { Component, OnInit, ChangeDetectorRef, Input, OnChanges, OnDestroy } from '@angular/core';
import { environment } from '@optimroute/env/environment';
import { FilterState } from '../../../../../../backend/src/lib/types/filter-state.type';
import { Zone } from '../../../../../../backend/src/lib/types/delivery-zones.type';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { NgbModal, NgbDateParserFormatter, NgbDatepickerI18n, NgbDate, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { LoadingService } from '../../../../../../shared/src/lib/services/loading.service';
import { StateDeliveryZonesFacade } from '../../../../../../state-delivery-zones/src/lib/+state/delivery-zones.facade';
import { StateEasyrouteService } from '../../../../../../state-easyroute/src/lib/state-easyroute.service';
import { StateRoutePlanningService } from '../../../../../../state-route-planning/src/lib/state-route-planning.service';
import { StateFilterStateFacade } from '../../../../../../filter-state/src/lib/+state/filter-state.facade';
import * as moment from 'moment-timezone';
import { take } from 'rxjs/operators';
import { Language, MomentDateFormatter, CustomDatepickerI18n, dateToObject, getToday, objectToString, getYearToToday, getStartOf, getEndOf } from '../../../../../../shared/src/lib/util-functions/date-format';
import { ModalCheckCostComponent } from 'libs/shared/src/lib/components/modal-check-cost/modal-check-cost.component';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
declare var $: any;
import * as _ from 'lodash';
@Component({
  selector: 'easyroute-table-drivers',
  templateUrl: './table-drivers.component.html',
  styleUrls: ['./table-drivers.component.scss'],
  providers: [
    Language,
    {provide: NgbDateParserFormatter, useClass: MomentDateFormatter},
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
})
export class TableDriversComponent implements OnInit, OnChanges, OnDestroy {

  @Input() refreshDrivers: boolean = false;

  tableCost: any;

  //dateMax: any = dateToObject(getToday());

  min: NgbDateStruct = dateToObject(moment().format('YYYY-MM-DD'));

  nextDay: boolean = false;

  today: string;

  refreshTime: number = environment.refresh_datatable_assigned;

  timeInterval: any;

  filter: FilterState = {
      name: 'vehicle_cost',
      values: {
          
          dateFrom: getStartOf(), //this.getToday(),

          dateTo: getEndOf(), //this.getToday(),

          userId: '',

          providerTypeId:'',

          providerId:'',

          providerTypeConceptId:'',

          costStatusId:''
          
      }
  };

  selectAll: boolean = false;

  selected: any = [];

  botones: boolean = false;

  zones: Zone[];

  users: any[] = [];

  totalizedDate: any;

  showCode: boolean = false;

  hoveredDate: NgbDate | null = null;

	fromDate: NgbDateStruct | null;

	toDate: NgbDateStruct | null;

  showCost: boolean = false;

  showSubHidden: boolean = false;

  providerTypeList: any = []; // Listado tipos de proveedores

  providerList: any = []; //Listado de proveedores

  conceptList: any = []; //Listado concepto de proveedores
  
  providerTypeListTable: any = []; // Listado tipos de proveedores para table

  providerListTable: any = []; //Listado de proveedores para table

  conceptListTable: any = []; //Listado concepto de proveedores para table

  showUser: boolean = true;
  
  showProvidersType: boolean = true;

  showProviders: boolean = true;

  showConcept: boolean = true;

  showProvidersTable: boolean = true;

  showConceptTable: boolean = true;

  disabledProviders: boolean = true;

  disabledConcept: boolean = true;

  disabledProvidersTable: boolean = true;

  disabledConceptTable: boolean = true;

  //dateSearchFrom: FormControl = new FormControl(dateToObject(getYearToToday()));

  vehicleCostForm: FormGroup;

  costList: any = [];

  constructor(
    private fb: FormBuilder,
    private authLocal: AuthLocalService,
    private _modalService: NgbModal,
    private _translate: TranslateService,
    private router: Router,
    private toastService: ToastService,
    private backendService: BackendService,
    private loadingService: LoadingService,
    private _toastService: ToastService,
    private detectChange: ChangeDetectorRef,
    public zoneFacade: StateDeliveryZonesFacade,
    private stateEasyrouteService: StateEasyrouteService,
    private stateRoutePlanningService: StateRoutePlanningService,
    private stateFilters: StateFilterStateFacade,
    private calendar: NgbCalendar, 
    public formatter: NgbDateParserFormatter
  ) { }

  ngOnInit() {
  
      this.form();

      this.fromDate = dateToObject(getStartOf()); //this.calendar.getToday();
  
    	this.toDate = dateToObject(getEndOf()); //this.calendar.getToday();
     
      this.getCostStatus();
  
  }

  ngOnChanges()  {

    console.log(this.refreshDrivers, 'changes');
    
    if(this.refreshDrivers) {

      console.log(this.refreshDrivers,'aqui');

      this.getCostStatus();

    }

  }

  getCostStatus() {
  
    this.backendService.get('cost_status').pipe(take(1)).subscribe((data) => {
  
      this.costList = data.data;
  
      this.loadFilters();
  
    }, error => {
  
      
  
      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  async loadFilters() {
  
      const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();
  
      this.filter = filters.find(x => x && x.name === 'vehicle_cost') ? filters.find(x => x.name === 'vehicle_cost') : this.filter;
  
      /* si tienes las fechas */
  
      if (this.filter.values.dateFrom && this.filter.values.dateTo) {

        this.fromDate = dateToObject(this.filter.values.dateFrom);
  
      	this.toDate = dateToObject(this.filter.values.dateTo);
        
      } 
  
      /* si tiene seleccionado un tipo */
  
      if ( this.filter.values.providerTypeId && !this.filter.values.providerId && !this.filter.values.providerTypeConceptId) {
  
        this.getSelectProvider(this.filter.values.providerTypeId);
  
        /* si tiene tipo y provedor */
        
      } else if (this.filter.values.providerTypeId && this.filter.values.providerId && !this.filter.values.providerTypeConceptId){
  
  
        this.getSelectProvider(this.filter.values.providerTypeId);
  
        this.getSelectConcept(this.filter.values.providerId);
  
      } else if (this.filter.values.providerId && this.filter.values.providerTypeId && this.filter.values.providerTypeConceptId ){
  
  
        this.getSelectProvider(this.filter.values.providerTypeId);
  
        this.getSelectConcept(this.filter.values.providerId);
      }
  
      this.getUsers();

  }

  /* para rutas */

  getAssigned() {
  
      this.stateRoutePlanningService
          .getRoutesAssignedSheet(this.filter.values.dateFrom.substring(0, 10))
          .pipe(take(1))
          .subscribe((data) => {
  
              this.zones = data.data;
  
              this.detectChange.detectChanges();
             
  
              if (this.zones.length > 0) {
                
                  this.cargar();
  
              } else {
  
                  this.zones = [];
                  
                  this.cargar();
                  
              }
  
          });
  }

  /* usuarios */

  getUsers() {
  
      this.loadingService.showLoading();
  
      this.showUser = false;
  
      this.stateEasyrouteService.getDriverListCost(0).pipe(take(1)).subscribe(
          (data: any) => {
  
              this.users = data.data;
  
              this.showUser = true;
  
              this.getProvidersTypeList();
  
              this.loadingService.hideLoading();
  
          },
          (error) => {
  
            this.showUser = true;
  
              this.loadingService.hideLoading();
  
              this.toastService.displayHTTPErrorToast(
                  error.status,
                  error.error.error,
              );
          },
      );
  
  }

  getProvidersTypeList() {
  
      this.showProvidersType = false;
  
      this.backendService.get('provider_type_for_user').pipe(take(1)).subscribe((data) => {
  
        this.providerTypeList = data.data;
  
        this.providerTypeListTable = data.data;
  
        this.loadTotalizedDate(true);
  
        this.showProvidersType = true;
  
      }, error => {
  
        this.showProvidersType = true;
  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
      });
  }

  changeSelectProviderTypeTable(value: any, etiqueta: string) {

    if (value > 0) {

      this.getSelectProvider(value, etiqueta);

    } else {
      this.vehicleCostForm.get('providerId').disable();
      this.vehicleCostForm.get('providerId').setValue('');
      this.vehicleCostForm.get('providerId').updateValueAndValidity();

      this.vehicleCostForm.get('providerTypeConceptId').setValue('');
      this.vehicleCostForm.get('providerTypeConceptId').disable();
      this.vehicleCostForm.get('providerTypeConceptId').updateValueAndValidity();
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
  
      providerAssigmentTypeId : 2
  
    }

    this.backendService.post('providers_by_type', sentData).pipe(take(1)).subscribe((data) => {

      if (etiqueta == null) {

        

        this.showProviders = true;
       /*  this.vehicleCostForm.get('providerId').disable();
        this.vehicleCostForm.get('providerId').updateValueAndValidity(); */
        this.providerList = data.data;
        this.disabledProviders = false;

      } else {
        console.log('else getSelectProvider')
        this.vehicleCostForm.get('providerId').enable();
        this.vehicleCostForm.get('providerId').setValue('');
        this.vehicleCostForm.get('providerId').updateValueAndValidity();

        this.vehicleCostForm.get('providerTypeConceptId').setValue('');
        this.vehicleCostForm.get('providerTypeConceptId').disable();
        this.vehicleCostForm.get('providerTypeConceptId').updateValueAndValidity();

        this.showProvidersTable = true;
        this.providerListTable = data.data;
        this.disabledProvidersTable = false;

      }

      this.detectChange.detectChanges();

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

      this.detectChange.detectChanges();
      
    }

    this.disabledCampos();

  }

  changeSelectProviderTable(value: any, etiqueta: string) {

    if (value > 0) {

      this.getSelectConcept(value, etiqueta);

    } else {
      
      this.vehicleCostForm.get('providerTypeConceptId').disable();
      this.vehicleCostForm.get('providerTypeConceptId').setValue('');
      this.vehicleCostForm.get('providerTypeConceptId').updateValueAndValidity();
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
        /* this.vehicleCostForm.get('providerTypeConceptId').disable();
      this.vehicleCostForm.get('providerTypeConceptId').updateValueAndValidity(); */

        this.showConcept = true;
        this.conceptList = data.data;
        this.disabledConcept = false;

      } else {
        this.vehicleCostForm.get('providerTypeConceptId').enable();
      this.vehicleCostForm.get('providerTypeConceptId').updateValueAndValidity();

        this.showConceptTable = true;
        this.conceptListTable = data.data;
        this.disabledConceptTable = false;

      }

      this.detectChange.detectChanges();

    }, error => {

      this.showConcept = true;
      this.showConceptTable = true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

  changeUserId(event: any){
  
    let value = event.target.value;
  
    let id = event.target.id;
    
    this.setFilter(value, id, true);

    this.disabledCampos();
  
  }

  /* informacion de cuadrso de arriba */

  loadTotalizedDate(updateTable: boolean = false) {
  
  
      this.showCode = false;
  
      this.backendService
  
          .post('cost_user_totalized', this.filter.values)
  
          .pipe(
  
              take(1)).subscribe(
  
                  (resp: any) => {
  
                      this.totalizedDate = null;
  
                      this.totalizedDate = resp;
  
                      this.showCode = true;
  
                      this.detectChange.detectChanges();
  
                      if (updateTable) {
                        this.cargar();
                      }
  
                  },
                  (error) => {
                      this.showCode = true;
  
                      this._toastService.displayHTTPErrorToast(
                          error.status,
                          error.error.error,
                      );
                  },
              );
  }
  
  initMoment() {
      moment()
          .tz('Europe/Madrid')
          .format();
      this.today = this.getToday(this.nextDay);
  }

  getToday(nextDay: boolean = false) {
      if (nextDay) {
          return moment(new Date().toISOString())
              .add(1, 'day')
              .format('YYYY-MM-DD');
      }
  
      return moment(new Date().toISOString()).format('YYYY-MM-DD');
  }

  cargar() {
  
      if (this.tableCost) {
          this.tableCost.clear(); // limpia la tabla sin destruirla
      }
  
      let url = environment.apiUrl + 'cost_user_datatables?' +
  
          (this.filter.values.dateFrom != '' ? '&dateFrom=' +
  
          this.filter.values.dateFrom : '') +
  
          (this.filter.values.dateTo != '' ? '&dateTo=' +
          
          this.filter.values.dateTo : '') +
  
          (this.filter.values.userId != '' ? '&userId=' +
  
          this.filter.values.userId : '') +
  
          (this.filter.values.providerTypeId != '' ? '&providerTypeId=' +
  
          this.filter.values.providerTypeId : '') +
  
          (this.filter.values.providerId != '' ? '&providerId=' +
  
          this.filter.values.providerId : '') +
  
          (this.filter.values.providerTypeConceptId != '' ? '&providerTypeConceptId=' +
  
          this.filter.values.providerTypeConceptId : '') +
  
          (this.filter.values.costStatusId != '' ? '&costStatusId=' +
  
          this.filter.values.costStatusId : '');
  
      let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
      let table = '#userCost';

      this.tableCost = $(table).DataTable({
          destroy: true,
          processing: true,
          serverSide: true,
          stateSave: true,
          order: [1, 'desc'],
          columnDefs: [{ targets: 5, type: 'date' }],
          stateSaveParams: function (settings, data) {
              data.search.search = '';
          },
          initComplete: function (settings, data) {
              settings.oClasses.sScrollBody = '';
          },
          cache: false,
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
                  '<img src="assets/icons/edittable.svg" class="far fa-edit">' +
                  ' ' +
                  this._translate.instant('GENERAL.TABLE'),
              );
          },
          buttons: [
              {
                  extend: 'colvis',
                  text: this._translate.instant('GENERAL.TABLE'),
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
                  title: this._translate.instant('COST.DATE'),
  
                  render: (data, type, row) => {
                      return moment(data).format('DD/MM/YYYY');
                  },
              },
              {
                  data: 'user.name',
                  className:'text-left',
                  title: this._translate.instant('COST.USER'),
                  render: (data, type, row) => {
                      if (data != null) {
                          return '<span class="text-center">' + data +' '+ row.user.surname +'</span>';
                      } else {
                          return '<span class="text-center"> No disponible </span>';
                      }
                  },
              },
              {
                  data: 'provider_type.name',
                  className:'text-left',
                  title: this._translate.instant('COST.GUY'),
  
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
                  title: this._translate.instant('COST.SUPPLIER'),
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
                  title: this._translate.instant('COST.CONCEPT'),
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
                  title: this._translate.instant('COST.UNITS'),
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
                  title: this._translate.instant('COST.AMOUNT'),
                  render: (data, type, row) => {
                      let number ='1.374,38€'
                      if (data) {
                          return '<span class="text-center">' + this.decimal(data) + '</span>';
                      } else {
                          return '<span class="text-center"> '+'No disponible'+' </span>';
                      }
                  },
  
              },
              {
                data: 'cost_status.id',
                sortable: false,
                searchable: false,
                className:'text-left',
                title: this._translate.instant('COST.REVISION'),
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
                          <button type="button" id="btn-${row.id}"  class="btn btn-sm button-gray-cost check">
                            <img class="point" src="assets/icons/cost-circle-white.svg">
                          </button>
                          <button type="button" id="btn1-${row.id}" class="btn btn-sm button-gray-cost check size-btn">Pendiente</button>
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
              <div class="input-group datatables-input-group-width mr-xl-3 mr-3">
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
          $(table)
              .DataTable()
              .search(this.value)
              .draw();
      });
  
      $('.dataTables_filter').removeAttr('class');
  
      this.initEvents(table + ' tbody', this.tableCost);
  }

  initEvents(tbody: any, table: any, that = this) {
      $(tbody).unbind();
      window.clearInterval(this.timeInterval);
      this.editar(tbody, table);
      this.select(tbody, table);
      this.detail(tbody, table);
      this.check(tbody, table);
  }

  editar(tbody: any, table: any, that = this) {
      $(tbody).on('click', 'div.editar', function () {
          let data = table.row($(this).parents('tr')).data();
  
          that.router.navigate(['sheet-route/', data.id]);
      });
  }

  detail(tbody: any, table: any, that = this) {
      $(tbody).on('click', 'div.detail', function () {
          let data = table.row($(this).parents('tr')).data();
  
          // that.Router.navigate([`/orders/detail-order/${data.id}`]);
      });
  }
  check(tbody: any, table: any, that = this){
  
    $(tbody).on('click', 'button.check', function () {
  
      let data = table.row($(this).parents('tr')).data();
  
      that.openModalCheckCost(data);
  });
  }

  selectAllGen(event: any) {
      this.selectAll = event.target.checked;
      
      this.selectAllFunc();
  }

  selectAllFunc() {
  
      this.tableCost.rows()[0].forEach((element) => {
  
  
          let data = this.tableCost.row(element).data();
  
          var index = this.selected.findIndex(x => x === data.id);
  
          if (this.selectAll) {
  
         
  
              var x = this.selected.filter(x => x == data.id);
  
              if (x.length == 0) {
  
                  this.selected.push(data.id);
  
                  $('#ck-' + data.id).prop('checked', true);
  
                  $('#btn-' + data.id).prop('disabled', true);
                  
                  $('#btn1-' + data.id).prop('disabled', true);
  
                  $('#thead-1').addClass('hidden');
  
                  $('#thead-2').removeClass('hidden');
  
                  $(this.tableCost.row(element).node()).removeClass('selected');
  
                 this.vehicleCostForm.disable();
              }
  
          } else {
  
      
            
  
              $('#ck-' + data.id).prop('checked', false);
  
              $('#btn-' + data.id).prop('disabled', false);
  
              $('#btn1-' + data.id).prop('disabled', false);
  
              $('#thead-1').removeClass('hidden');
  
              $('#thead-2').addClass('hidden');
  
              $(this.tableCost.row(element).node()).removeClass('selected');
  
              $('#checkboxDriverCost').prop('checked', false).removeAttr('checked');
  
              this.selected.splice(index, 1);
  
              this.selected = [];
  
              this.vehicleCostForm.enable();
  
          }
  
      
  
          this.detectChange.detectChanges();
      });
  }

  select(tbody: any, table: any, that = this) {
  
    
  
      let addBtn = $(".btn");
  
      $(tbody).on('click', '.backgroundColorRow', function () {
  
          that.selectAll = true;
  
          let data = table.row($(this).parents('tr')).data();
  
          that.selectAll = true;
  
          
  
          var index = that.selected.findIndex(x => x === data.id);
  
          if (index === -1) {
  
            console.log('if select table')
  
              that.selected.push(data.id);
  
              $('#ck-' + data.id).prop('checked', true);
  
              $('#btn-' + data.id).prop('disabled', true);
  
              $('#btn1-' + data.id).prop('disabled', true);
  
              $('#thead-1').addClass('hidden');
  
              $('#thead-2').removeClass('hidden');
  
  
             // $(this).parent().parent().addClass('selected');
  
              if(that.tableCost.rows()[0].length == that.selected.length) {
  
                  $('#checkboxDriverCost').prop('checked', that.selectAll).addClass('checked');
               
                  $('#checkboxDriverCost1').prop('checked', that.selectAll).addClass('checked');
                }
  
                that.tableCost.rows()[0].forEach((element) => {
  
                  let disabled = that.tableCost.row(element).data();
          
                  $('#btnTicket-' + disabled.id).prop('disabled', true);
        
                  $('#btn-' + disabled.id).prop('disabled', true);
        
                  $('#btn1-' + disabled.id).prop('disabled', true);
        
                   
                });
  
                that.vehicleCostForm.disable();
  
  
          } else {
            
            
              that.selectAll = false;
  
              that.selected.splice(index, 1);
  
              $('#ck-' + data.id).prop('checked', false);
  
              $('#btn-' + data.id).prop('disabled', false);
  
              $('#btn1-' + data.id).prop('disabled', false);
  
              
  
              $(this).parent().parent().removeClass('selected');
  
              $('#checkboxDriverCost').prop('checked', that.selectAll).removeAttr('checked');
  
              $('#checkboxDriverCost1').prop('checked', that.selectAll).removeAttr('checked');
  
              that.tableCost.rows()[0].forEach((element) => {
  
                let disabled = that.tableCost.row(element).data();
  
                if (that.selected.length === 0) {
  
                  $('#btnTicket-' + disabled.id).prop('disabled', false);
      
                  $('#btn-' + disabled.id).prop('disabled', false);
        
                  $('#btn1-' + disabled.id).prop('disabled', false);
  
                  $('#thead-1').removeClass('hidden');
  
                  $('#thead-2').addClass('hidden');
  
                  that.vehicleCostForm.enable();
  
                }
                 
              });
  
             
  
          }
          
  
          that.tableCost.rows()[0].forEach((element) => {
  
              if (that.selected.find(x => +x.id === +  that.tableCost.row(element).data().id) === undefined) {
  
                  that.selectAll = false;
  
              }
          });
  
          
  
          that.detectChange.detectChanges();
      });
  }

  prueba() {
      console.log('aqui')
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
  
    this.loadTotalizedDate(true);
    
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
  
    this.loadTotalizedDate(true);
  
    this.stateFilters.add(this.filter);
  
    } else {
  
      
  
      this.filter = {
  
        ...this.filter,
  
        values: {
  
            ...this.filter.values,
  
            dateFrom: objectToString(date),
  
            dateTo:objectToString(null)
  
        }
    }
  
   // this.loadTotalizedDate(true);
  
    this.toDate = null;
  
    this.fromDate = date;
  
    this.stateFilters.add(this.filter);
  
    }

    this.disabledCampos();

    
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

  addCost(){
    
    this.showCost =!this.showCost;
  
  }

  openSubList(){
  
    this.showSubHidden = !this.showSubHidden;
  
  }

  filterSelected(event:any, values?: any){
  
    
  
    let value = values.id ? values.id: '';
  
    
  
    let id = event.target.id;
  
    
  
    this.setFilter(value, id, true);
  
  
    this.showCost =!this.showCost;
  
    this.showSubHidden =!this.showSubHidden;

    this.disabledCampos();
  
  }

  openModalCheckCost(dataTable: any){
  
    
  
    const modal = this._modalService.open(ModalCheckCostComponent, {
  
      backdropClass: 'modal-backdrop-ticket',
    
      centered: true,
  
      windowClass:'modal-cost',
  
      size:'md'
  
    });
  
    modal.componentInstance.title = this._translate.instant('COST.CHECK_COST');
  
    modal.componentInstance.Subtitle = this._translate.instant('COST.ARE_YOU_SURE_YOU_WANT_TO_CHECK_THE_COST');
    
    modal.componentInstance.message = this._translate.instant('COST.ONE_IT_PASSES_TO_VERIFIED_STATUS_THE_COSTS_WILL_BE_RECALCULATED_AND_WILL_BE_REFLECTED_IN_THE_REPORTS');
  
  
    modal.componentInstance.accept =  this._translate.instant('COST.YES_CHECK');
  
    modal.result.then(
      (data) => {
        if (data) {
  
          let send = {
  
            costs :[dataTable.id]
  
          };
  
          this.updateStatusCost(send);
        
        }
        else{
          
        }
      
      },
      (reason) => {
        
        
      },
    ); 
  
  }

  updateStatusCost(data: any){
  
    this.backendService.post('cost_update_verified', data).pipe(take(1)).subscribe((data) => {
  
      this._toastService.displayWebsiteRelatedToast(
        this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
        this._translate.instant('GENERAL.ACCEPT'),
    );
  
    this.selectAll= false;
  
    this.selectAllFunc();
  
    this.tableCost.ajax.reload();

    this.disabledCampos();
  
  
    }, error => {
  
      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
  
    });
  
  }

//form
  form(){

    this.vehicleCostForm =  new FormGroup({
      userId: new FormControl ('', [Validators.required]),
      providerTypeId: new FormControl ('', [Validators.required]),
      providerId: new FormControl ({value:'', disabled: true}, [Validators.required]),
      providerTypeConceptId: new FormControl ({value:'', disabled: true}, [Validators.required]),
      quantity: new FormControl ('', [ Validators.required , Validators.pattern("^[0-9]*$")]),
      import: new FormControl ('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      creationDate:  new FormControl(dateToObject(getToday()))

       
     
    });
  }

  openModalVerifiedAll(selected: any){

    const modal = this._modalService.open(ModalCheckCostComponent, {

        backdropClass: 'modal-backdrop-ticket',
      
        centered: true,
    
        windowClass:'modal-cost',
    
        size:'md'
    
      });
    
      modal.componentInstance.title = this._translate.instant('COST.CHECK_COST');
    
      modal.componentInstance.Subtitle = this._translate.instant('COST.ARE_YOU_SURE_YOU_WANT_TO_CHECK_COST_OF_ALL_THE_SELECTED_CONCEPTS');
      
      modal.componentInstance.message = this._translate.instant('COST.ONE_IT_BECOMES_VERIFIED_THE_DATA_OBTAINED_WILL_BE_REFLECTED_IN_POLPOO_REPORTS_AND_ANALYTICS');

      modal.componentInstance.accept =  this._translate.instant('COST.YES_CHECK');
    
      modal.result.then(
        (data) => {

          if (data) {

            let sentAll = {

              costs :selected

            };

            this.updateStatusCost(sentAll);

          }
          else{
            
          }
        
        },
        (reason) => {
          
          
        },
      ); 

  }

  openModalDelete(selected:any){

    const modal = this._modalService.open(ModalCheckCostComponent, {

        backdropClass: 'modal-backdrop-ticket',

        centered: true,

        windowClass:'modal-cost',

        size:'md'

      });
    
      modal.componentInstance.title = this._translate.instant('COST.REMOVE');

      modal.componentInstance.Subtitle = this._translate.instant('COST.ARE_YOU_SURE_WANT_TO_DELETE_IT');

      modal.componentInstance.message = this._translate.instant('COST.THE_CONCEPTS_SELECTED_LATER_WILL_NOT_TAKEN_INTO_ACCOUNT_IN_THE_RECALCULATION');

  
      modal.componentInstance.accept =  this._translate.instant('COST.PERMANENTLY_DELETE');
      
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

      this._toastService.displayWebsiteRelatedToast(
        this._translate.instant('GENERAL.COST_TO_REMOVE_SUCCESSFULLY'),
        this._translate.instant('GENERAL.ACCEPT'),
    );
  
    this.selectAll= false;
  
    this.selectAllFunc();
  
    this.tableCost.ajax.reload();

    this.disabledCampos();
  
  
    }, error => {
  
      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
  
    });
  }

  submitCost(){

    this.loadingService.showLoading();

    let dataform = _.cloneDeep(this.vehicleCostForm.value);

    dataform.creationDate = objectToString(this.vehicleCostForm.value.creationDate);

    let sendImport = dataform.quantity * dataform.import;
    
    dataform.import = sendImport.toFixed(2);

    
    this.backendService.post('cost_user_store', dataform).pipe(take(1)).subscribe((data) => {

      this._toastService.displayWebsiteRelatedToast(
        this._translate.instant('GENERAL.REGISTRATION'),
        this._translate.instant('GENERAL.ACCEPT'),
    );

    this.vehicleCostForm.reset();

    this.vehicleCostForm.get('userId').setValue('');

    this.vehicleCostForm.get('providerTypeId').setValue('');
    
    this.vehicleCostForm.get('providerId').disable();

    this.vehicleCostForm.get('providerId').setValue('');


    this.vehicleCostForm.get('providerTypeConceptId').setValue('');

    this.vehicleCostForm.get('providerTypeConceptId').disable();

    
    this.vehicleCostForm.get('quantity').setValue('');

    this.vehicleCostForm.get('import').setValue('');

    this.vehicleCostForm.get('creationDate').setValue(dateToObject(getToday()));



    this.vehicleCostForm.get('userId').updateValueAndValidity();

    this.vehicleCostForm.get('providerTypeId').updateValueAndValidity();

    this.vehicleCostForm.get('providerId').updateValueAndValidity();

    this.vehicleCostForm.get('providerTypeConceptId').updateValueAndValidity();

    this.vehicleCostForm.get('quantity').updateValueAndValidity();

    this.vehicleCostForm.get('import').updateValueAndValidity();

    this.vehicleCostForm.get('creationDate').updateValueAndValidity();

    this.loadingService.hideLoading();

    this.detectChange.detectChanges();

    this.loadTotalizedDate(false);

    this.tableCost.ajax.reload();

  
    }, error => {

      this.loadingService.hideLoading();

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);

    });



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
      
      this.loadTotalizedDate(true);
      

        this.detectChange.detectChanges();
    }
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

      this.detectChange.detectChanges();
      
    }

    this.disabledCampos();
   
  }

  changeSelectConcept(event: any) {

    let value = event.target.value;

    let id = event.target.id;
    
    this.setFilter(value, id, true);

    this.disabledCampos();
  }

  changeDate( name: string, dataEvent: NgbDate ) {
    console.log('aqui')
   
  }

  decimal(numb) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numb);
  }

  
  selectConcept(value: any){

    let price = this.conceptListTable.find(x => x.id === Number(value)).price;
  
    
    if (price) {
      this.vehicleCostForm.get('quantity').setValue(1);
      this.vehicleCostForm.get('quantity').updateValueAndValidity();
      this.vehicleCostForm.get('import').setValue(price);
      this.vehicleCostForm.get('import').updateValueAndValidity();
    }
  }

  disabledCampos(){

    if ( !this.vehicleCostForm.controls.providerTypeId.value) {

      this.vehicleCostForm.get('providerId').disable();

      this.vehicleCostForm.get('providerTypeConceptId').disable();
      
    }
  }

  ngOnDestroy() {
    this.tableCost.destroy();
    window.clearInterval(this.timeInterval);
  }

}

