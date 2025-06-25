import { StateFilterStateFacade } from './../../../../../../../filter-state/src/lib/+state/filter-state.facade';
import { FilterState } from './../../../../../../../backend/src/lib/types/filter-state.type';
import { Component, Input, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { environment } from '@optimroute/env/environment';
import * as moment from 'moment-timezone';
declare var $: any;
import * as _ from 'lodash';
import { AuthLocalService } from '../../../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../../../../shared/src/lib/services/toast.service';
import { BackendService } from '../../../../../../../backend/src/lib/backend.service';
import { NgbModal, NgbDateParserFormatter, NgbDatepickerI18n, NgbDate, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { dayTimeAsStringToSeconds } from '../../../../../../../shared/src/lib/util-functions/day-time-to-seconds';
import { Language, MomentDateFormatter, CustomDatepickerI18n, dateToObject, getToday, objectToString, getYearToToday, getStartOf, getEndOf } from '../../../../../../../shared/src/lib/util-functions/date-format';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToDayTimePipe } from '../../../../../../../shared/src/lib/pipes/to-day-time.pipe';
import { secondsToAbsoluteTimeAlterne } from 'libs/shared/src/lib/util-functions/time-format';
import { Profile } from '@optimroute/backend';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LoadingService } from '@optimroute/shared';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';


@Component({
  selector: 'easyroute-management-vehicles-analysis-driver',
  templateUrl: './management-vehicles-analysis-driver.component.html',
  styleUrls: ['./management-vehicles-analysis-driver.component.scss'],
  providers: [
    Language,
    {provide: NgbDateParserFormatter, useClass: MomentDateFormatter},
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
})
export class ManagementVehiclesAnalysisDriverComponent implements OnInit {

  tableVehicleAnalysisDriver: any;
  
  //@Input() vehicleAnalysis: any;
  
  @Input() idVehicle: any;
  
  img: any;
  
  filter: FilterState = {
    name: 'vehicle_analysis_driver',
    values: {
        dateFrom: getYearToToday(),
        dateTo: getToday(),
        userId:''

    },
};
  
  //@Output('filterDate')
  filterDate: EventEmitter<any> = new EventEmitter();
  
  profile: Profile;
  unsubscribe$ = new Subject<void>();

  showUser: boolean = true;

  showCode: boolean = false;

  fromDate: NgbDateStruct | null;

  toDate: NgbDateStruct | null;

  hoveredDate: NgbDate | null = null;

  subtraYearDate: any = dateToObject(getYearToToday());

  @Output('filters')
  filters =  new EventEmitter<any>();

  constructor(
      private authLocal: AuthLocalService,
      private _translate: TranslateService,
      private Router: Router,
      private toastService: ToastService,
      private backendService: BackendService,
      private detectChanges: ChangeDetectorRef,
      public facadeProfile: ProfileSettingsFacade,
      private loadingService: LoadingService,
      private stateEasyrouteService: StateEasyrouteService,
      private calendar: NgbCalendar, 
      public formatter: NgbDateParserFormatter,
      private stateFilters: StateFilterStateFacade
  ) { }
  
  ngOnInit() { 


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
    
        this.filter = filters.find(x => x && x.name === 'vehicle_analysis_driver') ? filters.find(x => x.name === 'vehicle_analysis_driver') : this.filter;
    
        /* si tienes las fechas */
        
        if (this.filter.values.dateFrom && this.filter.values.dateTo) {

          this.fromDate = dateToObject(this.filter.values.dateFrom);
    
          this.toDate = dateToObject(this.filter.values.dateTo);
          
        } else {

            this.fromDate = this.subtraYearDate;

            this.toDate = this.calendar.getToday();
    
           
        }

        this.filters.emit(this.filter.values);

        this.detectChanges.detectChanges();
    
        this.initMoment();
      
        this.cargar();

  }

  ngOnChanges() { }

  initMoment() {
      moment()
          .tz('Europe/Madrid')
          .format();
  }


  /* Cargar tabla Registro de servicios */
  cargar() {

      if (this.tableVehicleAnalysisDriver) {
          this.tableVehicleAnalysisDriver.clear();
          this.tableVehicleAnalysisDriver.state.clear();
      }
  
      let table = '#vehicleAnalysisDriverTable';
      
      let url = environment.apiUrl + 'vehicle_analysis_detail_driver/'+ this.idVehicle;
      
      url += this.filter.values.dateFrom ? '?dateFrom=' +  this.filter.values.dateFrom : '';
      
      url += this.filter.values.dateTo ? '&dateTo=' +  this.filter.values.dateTo : '';
      
      let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
      
      this.tableVehicleAnalysisDriver = $(table).DataTable({
          destroy: true,
          serverSide: true,
          processing: true,
          stateSave: false,
          cache: false,
          stateSaveParams: function (settings, data) {
              data.search.search = "";
          },
          lengthMenu: [50, 100],
          order: [3, 'desc'],
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
                <'col-lg-5 col-md-5 col-xl-5 col-12 pl-3 pr-3 d-flex flex-column justify-content-center align-items-cente'i>
                <'col-lg-7 col-md-7 col-xl-7 col-12 pl-3 pr-3 d-flex flex-column justify-content-center align-items-lg-end align-items-sm-center'
                    <'row reset align-items-center'
                        <'col-sm-6 col-md-6 col-xl-6 col-6 p-xl-0'l>
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
                data: 'driver',
                render: (data, type, row) => {
                    if (data == null || data == 0) {
                        return '<span class="text center" aria-hidden="true"> No disponible</span>';
                    } else {
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' + data+
                            '">' +
                           
                            data +
                            '</span>'
                        );
                    }
                },
              },
              {
                  data: 'quantityAssigned',
                  render: (data, type, row) => {
                      
                      return (
                          '<span data-toggle="tooltip" data-placement="top" title="' +
                          data +
                          '">' +
                          data + '</span>'
                      );
                  },
              },
              {
                data: 'refueling',
                render: (data, type, row) => {
                    
                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        data +
                        '">' +
                        data + '</span>'
                    );
                },
              },
              {
                data: 'dateAssingned',
                render: (data, type, row) => {
                    if(data){
    
                        return moment(data).format('DD/MM/YYYY');
                    } else {
                    return (
                        '<span data-toggle="tooltip" data-placement="top"> No disponible </span>'
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
      this.editar('#vehicleAnalysisDriverTable tbody', this.tableVehicleAnalysisDriver);
      
  }

  dateFormat(data: any) {
      return secondsToAbsoluteTimeAlterne(data, false);
  }

  editar(tbody: any, table: any, that = this) {
  
    $(tbody).unbind();
  
    $(tbody).on('click', '.editar', function() {
  
        let data = table.row($(this).parents('tr')).data();
        
        //that.Router.navigate([`/travel-tracking/${data.routeId}/details/${data.routePlanningRouteDeliveryPointId}/analysis-client`]);
  
    });
  }

  decimal(numb) {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numb);
  }

  //Para fecha
  onDateSelection(date: NgbDate) {

      if (!this.fromDate && !this.toDate) {
      
        this.fromDate = date;

        this.filter = {

            ...this.filter,
      
            values: {
      
                ...this.filter.values,
      
                dateFrom: objectToString(date),
                
            }
        };
        
        this.cargar();
      
      } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      
        this.toDate = date;

        this.filter = {

            ...this.filter,
      
            values: {
      
                ...this.filter.values,
      
                dateTo: objectToString(date),
                
            }
        };

        this.cargar();
      
      } else {
      
        this.filter = {
  
            ...this.filter,
      
            values: {
      
                ...this.filter.values,
      
                dateFrom: objectToString( date ),

                dateTo: objectToString(date),
                
            }
        };

        this.toDate = null;
        
        this.fromDate = date;

        

        this.cargar();
          
      }

      this.stateFilters.add(this.filter);

      this.filters.emit(this.filter.values);
  }

  validateInput(currentValue: NgbDateStruct | null, input: string): NgbDate | NgbDateStruct | null {
    
      const parsed = this.formatter.parse(input);
    
      return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
    
  }
  
  isRange(date: NgbDate) {
    
      return (
    
        date.equals(this.fromDate) ||
    
        (this.toDate && date.equals(this.toDate)) ||
    
        this.isInside(date) ||
    
        this.isHovered(date)
    
      );
  }
  
  isHovered(date: NgbDate) {
    
      return (
    
        this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    
      );
    
  }
  
  isInside(date: NgbDate) {
    
      return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
    
  }


  // Para filtro
  ChangeFilter(event: any) {
  
      let value = event.target.value;
  
      let id = event.target.id;
  
      this.setFilter(value, id, true);
  }
  
  setFilter(value: any, property: string, sendData?: boolean) {
  
      this.filter = {
          ...this.filter,
      
              ...this.filter,
              [property]: value,
      
      };
      
      this.filterDate.emit(this.filter);
      
  }


}
