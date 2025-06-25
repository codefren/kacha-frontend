import { ModalClientNewComponent } from './modal-client-new/modal-client-new.component';

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FilterState } from '../../../../../backend/src/lib/types/filter-state.type';
import { Zone } from '../../../../../backend/src/lib/types/delivery-zones.type';
import { Profile } from '../../../../../backend/src/lib/types/profile.type';
import { Subject } from 'rxjs';
import { environment } from '@optimroute/env/environment';
import { NgbDate, NgbDateStruct, NgbModal, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '../../../../../backend/src/lib/backend.service';
import { DurationPipe } from '../../../../../shared/src/lib/pipes/duration.pipe';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { Router } from '@angular/router';
import { StateFilterStateFacade } from '../../../../../filter-state/src/lib/+state/filter-state.facade';
import { ProfileSettingsFacade } from '../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { StateDeliveryZonesFacade } from '../../../../../state-delivery-zones/src/lib/+state/delivery-zones.facade';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
import { objectToString, dateToObject, getStartOf, getEndOf } from '../../../../../shared/src/lib/util-functions/date-format';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { ToDayTimePipe } from '../../../../../shared/src/lib/pipes/to-day-time.pipe';
import { ModalCheckCostComponent } from 'libs/shared/src/lib/components/modal-check-cost/modal-check-cost.component';

declare var $: any;
@Component({
  selector: 'easyroute-management-clients-update-data',
  templateUrl: './management-clients-update-data.component.html',
  styleUrls: ['./management-clients-update-data.component.scss']
})
export class ManagementClientsUpdateDataComponent implements OnInit {

  table: any;
    timeInterval: any;

    refreshTime: number = environment.refresh_datatable_assigned;

    filter: FilterState = {
        name: 'clients_data',
        values: {
          deliveryPointId: '',
          userId:'',
          dateFrom: getStartOf(), //this.getToday(),
          dateTo: getEndOf(), //this.getToday(),
          nameClient:'',
          deliveryPointUpdateTypeId:''
        },
    };

    change: string = 'analysis';

    zones: Zone[];

    profile: Profile;
    unsubscribe$ = new Subject<void>();

    showCode: boolean = false;
    totalizedDate: any;

    showZones: boolean = true;

    hoveredDate: NgbDate | null = null;

    fromDate: NgbDateStruct | null;

    toDate: NgbDateStruct | null;

    usersVehicles: any[] = [];

    typeList : any [] = [];

    showUserVehicle : boolean = false;

    showTypeList : boolean = false;

    constructor(
        public authLocal: AuthLocalService,
        private _translate: TranslateService,
        private backend: BackendService,
        private durationPipe: DurationPipe,
        private toastService: ToastService,
        private _modalService: NgbModal,
        private router: Router,
        private detectChanges: ChangeDetectorRef,
        private stateFilters: StateFilterStateFacade,
        private facadeProfile: ProfileSettingsFacade,
        public zoneFacade: StateDeliveryZonesFacade,
        private calendar: NgbCalendar, 
        public formatter: NgbDateParserFormatter,
        private stateEasyrouteService: StateEasyrouteService,
        private dayTime: ToDayTimePipe
    ) { }

    ngOnInit() {

        this.fromDate = dateToObject(getStartOf()); 

        this.toDate = dateToObject(getEndOf()); 

        this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {

            if (loaded) {
    
                this.facadeProfile.profile$.pipe(take(1)).subscribe(async (data) => {
    
                    this.profile = data;
    
                    const filters = await this.stateFilters.filters$
                        .pipe(take(1))
                        .toPromise();
    
                    this.filter = filters.find((x) => x.name === 'clients_data')
                        ? filters.find((x) => x.name === 'clients_data')
                        : this.filter;
    
                    if (this.filter.values.dateFrom && this.filter.values.dateTo) {
    
                        this.fromDate = dateToObject(this.filter.values.dateFrom);
                
                        this.toDate = dateToObject(this.filter.values.dateTo);
                    } 
    
                    this.detectChanges.detectChanges();
    
                    this.backend.timeoutToken().subscribe(
                        (data) => {

                            this.getZone();
                            this.getUsers();
                            this.getTypeDelivery();
    
                        },
                        (error) => {
                            this.backend.Logout();
                        },
                    );
                });
            }
        });
    }

    ngOnDestroy(): void {
      this.table.destroy();
    }


    getZone(){
        this.zoneFacade.loadAll();
        this.zoneFacade.loaded$.pipe(take(2)).subscribe((loaded)=>{

            this.loadTotalizedDate()

            if(loaded) {
                this.zoneFacade.allDeliveryZones$.pipe(take(1)).subscribe((data)=>{
                    this.zones = data.filter(x => x.isActive === true);
                });
            }
        })
    }

    /* vehiculos */
    getUsers() {

      this.showUserVehicle = false;

      this.stateEasyrouteService.getDriver(0).pipe(take(1)).subscribe(
          (data: any) => {

              this.usersVehicles = data.data;

              this.showUserVehicle = true;

          },
          (error) => {

            this.showUserVehicle = true;

              this.toastService.displayHTTPErrorToast(
                  error.status,
                  error.error.error,
              );
          },
      );

    }

    /* typeList */

    getTypeDelivery() {

        this.showTypeList = false;
  
        this.stateEasyrouteService.getDeliveryPointUpdateType().pipe(take(1)).subscribe(
            (data: any) => {

                this.typeList = data.data;

                console.log(this.typeList, 'this.typeList');
  
                this.showTypeList = true;
            },
            (error) => {
  
              this.showTypeList = true;
  
                this.toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
  
      }

    /* informacion de cuadros */
    loadTotalizedDate() {

        this.showCode = false;
        
        this.backend
            .post('delivery_point_update_totalized', this.filter.values )
            .pipe(
                take(1)).subscribe(
        
                    (resp: any) => {
        
                        this.totalizedDate = null;
        
                        this.totalizedDate = resp;
        
                        this.showCode = true;
                        
                        this.cargar();

                        this.detectChanges.detectChanges();

                    },
                    (error) => {
                        this.showCode = true;
        
                        this.toastService.displayHTTPErrorToast(
                            error.status,
                            error.error.error,
                        );
                    },
                );
    }

    cargar() {
        if (this.table) {
            this.table.clear();
            this.table.state.clear();
        }

        let url =  environment.apiUrl + 'delivery_point_update_datatable?' +

        (this.filter.values.userId != '' ? '&userId=' +
        this.filter.values.userId : '') +

        (this.filter.values.dateFrom != '' ? '&dateFrom=' +
            this.filter.values.dateFrom : '') +

        (this.filter.values.dateTo != '' ? '&dateTo=' +
            this.filter.values.dateTo : '') +

            (this.filter.values.deliveryPointUpdateTypeId != '' ? '&deliveryPointUpdateTypeId=' +
            this.filter.values.deliveryPointUpdateTypeId : '') +

        (this.filter.values.deliveryPointId != '' ? '&deliveryPointId=' +
            this.filter.values.deliveryPointId : '');


      let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
      let table = '#clientsAnalysis';
      this.table = $(table).DataTable({
          destroy: true,
          serverSide: true,
          processing: true,
          stateSave: false,
          cache: false,
          paging: true,
          order: [0, 'desc'],
          stateSaveParams: function(settings, data) {
              data.search.search = '';
          },
          lengthMenu: [50, 100],
          ajax: {
              method: 'GET',
              url: url,
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: tok,
              },
              error: (xhr, error, thrown) => {
                  let html = '<div class="container" style="padding: 10px;">';
                  html +=
                      '<span class="text-orange">Ha ocurrido un errror al procesar la informacion.</span> ';
                  html +=
                      '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
                  html += '</div>';

                  $('#clients_processing').html(html);

                  $('#refrescar').click(() => {
                      this.cargar();
                  });
              },
          },
         
          dom: `
          <'row'
              <'col-xl-6 col-12 d-flex flex-column justify-content-start align-items-center align-items-md-start p-0'
                  <'col-xl-12 col-md-12 col-12 col-sm-12 pl-2'>
              >
              <'col-xl-6 col-12 d-flex flex-column justify-content-center align-items-center align-items-md-end p-0'
                  <'row'
                      <'col-sm-6 col-md-6 col-xl-3 col-5 dt-buttons-table-otro pb-0 pt-0'>
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
          headerCallback: (thead, data, start, end, display) => {
              $('.buttons-collection').html(
                  '<i class="far fa-edit"></i>' +
                      ' ' +
                      this._translate.instant('GENERAL.SHOW/HIDE'),
              );
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
          columns: [
            {
                data: 'updateAt',
                title: this._translate.instant('CLIENTS.DATE'),
                render: (data, type, row) => {
                    let botones = '';
                
                    if (data != null) {
                    return moment(data).format('DD/MM/YYYY');
                
                    } else {
                        return '----';
                    }
                    
                },
            },
            {
                data: 'user_driver',
                sortable: true,
                title: this._translate.instant('CLIENTS.DRIVER'),
                className: 'dt-body-center',
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
                title: this._translate.instant('CLIENTS.CUSTOMER'),
                render: (data, type, row) => {
                    let id = data;
                    if (id.length > 30) {
                        id = id.substr(0, 29) + '...';
                    }
                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        data +
                        '">' +
                        id +
                        '</span>'
                    );
                },
            },
            {
                data: 'delivery_point_update_type.name',
                title: this._translate.instant('CLIENTS.TYPE'),
                render: (data, type, row) => {
                    let id = data;
                    if (id.length > 30) {
                        id = id.substr(0, 29) + '...';
                    }
                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        data +
                        '">' +
                        id +
                        '</span>'
                    );
                },
            },
            /* Horario */
            {
                data: 'deliveryPointCurrentData',
                title: this._translate.instant('CLIENTS.ANCIENT'),
                render: (data, type, row) => {

                    let name = data;

                    if (name.length > 30) {

                        name = name.substr(0, 29) + '...';
                    }

                    if (data == null || data == 0) {
                        return '<span class="text center" aria-hidden="true"></span>';
                    } else {
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            data +
                            '">' +
                            name+
                            '</span>'
                        );
                    }
                },
            },
            {
                data: 'deliveryPointDataUpdate',
                title: this._translate.instant('CLIENTS.UPDATE'),
                render: (data, type, row) => {

                    let name = data;

                    if (name.length > 30) {

                        name = name.substr(0, 29) + '...';
                    }
                    if (data == null || data == 0) {
                        return '<span class="text center" aria-hidden="true"></span>';
                    } else {
                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            data +
                            '">' +
                            name +
                            '</span>'
                        );
                    }
                },
            },
            {
                data: 'deliveryPointUpdateStatusId',
                sortable: false,
                searchable: false,
                title: this._translate.instant('GENERAL.ACTIONS'),
                className: 'dt-body-center',
                render: (data, type, row) => {

                    if(data === 1){
                        return `<div class="row row-update-clients">

                                 <div class="col-xl-6 col-12 p-xl-0">

                                   <buttom class="btn btn-primary btn-block btn-reject decline">Rechazar</buttom>

                                 </div>

                                 <div class="col-xl-6 col-12 p-xl-0">

                                   <buttom class="btn btn-primary btn-block btn-update warning accept mt-xl-0 mt-2">Aceptar</buttom>

                                 </div>

                                </div>
                               `;
                    } else {
                        return `<div class="row row-update-clients">
                                  <div class="col-xl-6 col-12 p-xl-0">
                                    <buttom class="btn btn-primary btn-reject no-point" style="opacity: 0.5;">Rechazar</buttom>
                                  </div>

                                  <div class="col-xl-6 col-12 p-xl-0">
                                    <buttom class="btn btn-primary btn-update no-point mt-xl-0 mt-2" style="opacity: 0.5;">Aceptar</buttom>
                                  </div>
                                 </div> 
                                `;
                    }
                
                },
            },
          ],
      });
      $('.dataTables_filter').html(`
          <div class="row p-0 p-0 justify-content-sm-end justify-content-center">
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
              .search(this.value)
              .draw();
      });

      $('.dataTables_filter').removeAttr('class');

      this.initEvents(table + ' tbody', this.table);
    }

    initEvents(tbody: any, table: any, that = this) {
        $(tbody).unbind();
        window.clearInterval(this.timeInterval);
        this.timeInterval = window.setInterval(() => {
            this.table.ajax.reload();
        }, this.refreshTime);
        this.decline(tbody, table);
        this.accept(tbody, table);
    
    }

    decline(tbody: any, table: any, that = this) {
        $(tbody).on('click', '.decline', function() {
            let data = table.row($(this).parents('tr')).data();
            /* that.router.navigate([`/management/clients/analysis/${data.id}`]); */
            that.openModalDecline(data);
        });
    }

    openModalDecline(dataTable: any){
  
        const modal = this._modalService.open(ModalCheckCostComponent, {
      
          backdropClass: 'modal-backdrop-ticket',
        
          centered: true,
      
          windowClass:'modal-cost',
      
          size:'md'
      
        });
      
        modal.componentInstance.title = this._translate.instant('CLIENTS.REJECT_UPDATE');
      
        modal.componentInstance.Subtitle = this._translate.instant('CLIENTS.ARE_YOU_SURE_YOU_WANT_TO_REJECT_THE_UPDATE_THAT_HAS_BEEN_MADE');
        
        modal.componentInstance.message = this._translate.instant('CLIENTS.TEXT_3');
      
        modal.componentInstance.accept =  this._translate.instant('CLIENTS.DECLINE');

        modal.componentInstance.cssStyle = 'btn btn-red-general';
      
        modal.result.then(
          (data) => {
            if (data) {

                let send = {
                    deliveryPointUpdateStatusId: 3
                };
      
              this.updateStatusDecline(dataTable.id, send);
            
            }
          
          },
          (reason) => {
            
          },
        ); 
      
    }

    updateStatusDecline(id:any, data:any){
  
        this.backend.put('delivery_point_update_data/'+id, data).pipe(take(1)).subscribe((data) => {
      
          this.toastService.displayWebsiteRelatedToast(
            this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
            this._translate.instant('GENERAL.ACCEPT'),
        );
      
        this.loadTotalizedDate();
        //this.table.ajax.reload();
    
        }, error => {
      
          this.toastService.displayHTTPErrorToast(error.status, error.error.error);
      
        });
      
    }

    accept(tbody: any, table: any, that = this) {
        $(tbody).on('click', '.accept', function() {
            let data = table.row($(this).parents('tr')).data();
            /* that.router.navigate([`/management/clients/analysis/${data.id}`]); */

            that.openModalAccept(data);
        });
    }

    openModalAccept(dataTable: any){
  
        const modal = this._modalService.open(ModalCheckCostComponent, {
      
          backdropClass: 'modal-backdrop-ticket',
        
          centered: true,
      
          windowClass:'modal-cost',
      
          size:'md'
      
        });
      
        modal.componentInstance.title = this._translate.instant('CLIENTS.ACCEPT_UPDATE');
      
        modal.componentInstance.Subtitle = this._translate.instant('CLIENTS.ACCEPT_UPDATE_MESSAGE');
        
        modal.componentInstance.message = this._translate.instant('CLIENTS.ACCEPT_UPDATE_TEXT');
      
        modal.componentInstance.accept =  this._translate.instant('CLIENTS.ACCEPT');

        modal.componentInstance.cssStyle = 'btn btn-primary';
      
        modal.result.then(
          (data) => {
            if (data) {
      
              this.updateClient(dataTable.id);
            
            }
          
          },
          (reason) => {
            
          },
        ); 
      
    }

    updateClient(id:any){
  
        this.backend.put('delivery_point_update_client/'+id).pipe(take(1)).subscribe((data) => {
      
          this.toastService.displayWebsiteRelatedToast(
            this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
            this._translate.instant('GENERAL.ACCEPT'),
        );
      
        this.loadTotalizedDate();
        //this.table.ajax.reload();
    
        }, error => {
      
          this.toastService.displayHTTPErrorToast(error.status, error.error.error);
      
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
              [property]: value,
          },
      };

      this.stateFilters.add(this.filter);

      if (sendData) {
          this.loadTotalizedDate();

          //this.detectChanges.detectChanges();
      }
      this.detectChanges.detectChanges();
    }

    getToday(nextDay: boolean = false) {
        if (nextDay) {
            return moment(new Date().toISOString())
                .add(1, 'day')
                .format('YYYY-MM-DD');
        }
    
        return moment(new Date().toISOString()).format('YYYY-MM-DD');
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
          
            this.loadTotalizedDate();
            
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
          
            this.loadTotalizedDate();
          
            this.stateFilters.add(this.filter);
      
        } else {
      
            this.filter = {
                ...this.filter,
                values: {
                    ...this.filter.values,
                    dateFrom: objectToString(date),
                    dateTo:objectToString(date)
                }
            }
      
            this.loadTotalizedDate();
      
            this.toDate = null;
          
            this.fromDate = date;
          
            this.stateFilters.add(this.filter);
      
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

    redirectTo(){
        this.router.navigate(['management/clients']);
    }

    openClient(){
      const modal = this._modalService.open(ModalClientNewComponent, {
        backdropClass: 'modal-backdrop-ticket',
        centered: true,
       // windowClass:'modal-donwload-User',
        size:'xl'
    });

    modal.componentInstance.title = this._translate.instant('DELIVERY_POINTS.DOWNLOAD_CLIENT');
    modal.componentInstance.message = this._translate.instant('DELIVERY_POINTS.DOWNLOAD_CLIENT_MESSAGE');
    modal.componentInstance.etiqueta = 'json';

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

            this.loadTotalizedDate();

            this.detectChanges.detectChanges();

          }    
        },
        (reason) => {
          
        },
    ); 
    }

    clearClient(){

        this.filter = {
            ...this.filter,
            values: {
                ...this.filter.values,
                deliveryPointId: '',
                nameClient: ''
            },
        };
      
        this.stateFilters.add(this.filter);

        this.loadTotalizedDate();

        this.detectChanges.detectChanges();
          
    }

    
}
