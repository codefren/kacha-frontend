import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import {
    TimesPipe,
    secondsToDayTimeAsString,
    DurationPipe,
    ToastService,
} from '@optimroute/shared';
import { ManagementZoneFormComponent } from './management-zone-form/management-zone-form.component';
import { DeliveryZones } from '@optimroute/state-delivery-zones';
import { Zone, BackendService, FilterState } from '@optimroute/backend';
import { StateDeliveryZonesFacade } from '@optimroute/state-delivery-zones';
import * as _ from 'lodash';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { StateFilterStateFacade } from '@easyroute/filter-state';
import { ModalActivateZoneComponent } from './modal-activate-zone/modal-activate-zone.component';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
declare var $;

@Component({
    selector: 'easyroute-management-zone-table',
    templateUrl: './management-zone-table.component.html',
    styleUrls: ['./management-zone-table.component.scss'],
})
export class ManagementZoneTableComponent implements OnInit, OnDestroy {
    table: any;
    unsubscribe$ = new Subject<void>();

    change: string = 'route';

    filterTable: FilterState = {
        name: 'zone',
        values: {
            isActive: 'active'
        }
    };

    constructor(
        private dialog: NgbModal,
        public authLocal: AuthLocalService,
        private _translate: TranslateService,
        private facade: StateDeliveryZonesFacade,
        private backend: BackendService,
        private durationPipe: DurationPipe,
        private toast: ToastService,
        private Router: Router,
        private stateFilters: StateFilterStateFacade,
        private detectChange: ChangeDetectorRef,
        private stateEasyrouteService: StateEasyrouteService,
    ) {}

    async ngOnInit() {

        const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();

        console.log('filters', filters);
        this.filterTable = filters.find(x => x.name === 'zone') ? filters.find(x => x.name === 'zone') : this.filterTable;

        this.detectChange.detectChanges();
        
        this.backend.timeoutToken().subscribe(
            (data) => {
                this.cargar();
                this.facade.updated$
                    .pipe(takeUntil(this.unsubscribe$))
                    .subscribe((data) => {
                        if (data) {
                            this.table.ajax.reload();
                        }
                    });
            },
            (error) => {
                this.backend.Logout();
            },
        );
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'div.editar', function() {
            let data = table.row($(this).parents('tr')).data();
            console.log(data);
            //that.editElement(data.id, data);
            that.Router.navigate([`/management-logistics/delivery-zones/${data.id}`]);
        });
    }

    onChangeOrderValue(tbody: any, table: any, that = this) {
        $(tbody).on('focusout', 'input.order_input', function() {
            let data = table.row($(this).parents('tr')).data();
            console.log(data.order, 'input');
            let zone = {
                order: +$(this).val(),
            };
            if (data.order == +$(this).val()) {
                return;
            }
            that.updateZone([data.id, zone]);
        });
    }

    initEvents(tbody: any, table: any, that = this) {
        $(tbody).unbind();
        this.editar('#delivery-zones tbody', this.table);
        this.onChangeOrderValue('#delivery-zones tbody', this.table);
        this.isActive('#delivery-zones tbody', this.table);
    }

    updateZone(obj: [string, Partial<Zone>]) {
        this.facade.reorderZone(obj[0], obj[1].order);
    }

    editElement(zoneId: number, zone: any) {
        let editingCopy: Zone = _.cloneDeep(zone);
        const dialogRef = this.dialog.open(ManagementZoneFormComponent, {
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });
        dialogRef.componentInstance.data = {
            zone: editingCopy,
        };
        dialogRef.componentInstance.titleTranslate = 'DELIVERY_ZONES.EDIT_ZONE';
        dialogRef.result.then(([add, object]) => {
            if (add) {
                this.table.ajax.reload();
                this.toast.displayWebsiteRelatedToast(
                    this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                    this._translate.instant('GENERAL.ACCEPT'),
                );
            }
        });
    }

    newAddition() {
        let zone: any = {
            zone: {
                id: null,
                name: '',
                color: '#000000',
                settingsDeliveryScheduleStart: '0',
                settingsDeliveryScheduleEnd: '0',
                settingsOptimizationParametersCostDistance: '0',
                settingsOptimizationParametersCostDuration: '0',
                settingsOptimizationParametersCostVehicleWaitTime: '0',
                settingsForcedeparturetime: false,
                settingsIgnorecapacitylimit: true,
                settingsUseallvehicles: false,
            },
        };
        const dialogRef = this.dialog.open(ManagementZoneFormComponent, {
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });
        dialogRef.componentInstance.data = zone;
        dialogRef.componentInstance.titleTranslate = 'DELIVERY_ZONES.ADD_ZONE';
        dialogRef.result.then(([add, object]) => {
            if (add) {
                this.table.ajax.reload();
                this.toast.displayWebsiteRelatedToast(
                    this._translate.instant('GENERAL.REGISTRATION'),
                    this._translate.instant('GENERAL.ACCEPT'),
                );
            }
        });
    }

    cargar() {
        let url = environment.apiUrl + 'delivery_zone_datatables?show=' + this.filterTable.values.isActive;
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#delivery-zones';
        this.table = $(table).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            cache: false,
            order: [[ 0, "desc" ]],
            scrollCollapse: true,
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            
            language: environment.DataTableEspaniol,
            dom: `
                <'row'
                    <'col-sm-8 col-lg-10 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
                    <'col-sm-4 col-lg-2 col-12 label-search'f>
                >
                <'row p-0 reset'
                  <'offset-sm-6 offset-lg-6 offset-5'>
                  <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>
                >
                <"top-button-hide"><'table-responsive-lg't>
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
                        '<span class="text-orange">Ha ocurrido un error al procesar la informacion.</span> ';
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
                    data: 'id',
                    title: this._translate.instant('GENERAL.CODE'),
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
                    data: 'name',
                    title: this._translate.instant('DELIVERY_ZONES.NAME_'),
                    render: (data, type, row) => {
                        let name = data == null ? '' : data;
                        if (name && name.length > 30) {
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
                    data: 'color',
                    title: this._translate.instant('DELIVERY_ZONES.COLOR'),
                    render: (data, type, row) => {
                        return `<div style="background-color:${data};height:50px;width:50px;border-radius: 5px;opacity: 0.8; margin: 0 auto;"></div>`;
                    },
                },
                {
                    data: 'order',
                    visible: false,
                    className: 'dt-body-center',
                    title: this._translate.instant('DELIVERY_ZONES.ORDER'),
                    render: function(data, type, row) {
                        return (
                            '<input type="number" style="width:50px" class="form-control p-0 pl-1 pr-1 text-center order_input" min="1" name="' +
                            row.id +
                            '" value="' +
                            data +
                            '">'
                        );
                    },
                },
                {
                    data: 'settingsIgnorecapacitylimit',
                    title: this._translate.instant('DELIVERY_ZONES.IGNORE_CAPACITY_LIMIT'),
                    render: (data, type, row) => {
                        if (data && data == true) {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                this._translate.instant('GENERAL.YES') +
                                '">' +
                                this._translate.instant('GENERAL.YES') +
                                '</span>'
                            );
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                this._translate.instant('GENERAL.NO') +
                                '">' +
                                this._translate.instant('GENERAL.NO') +
                                '</span>'
                            );
                        }
                    },
                },
                {
                    data: 'isActive',
                    title: this._translate.instant('VEHICLES.ACTIVE'),
                    render: (data, type, row) => {
                        
                        if (data) {
                            return (
                                '<div class="text-center">' +
                                    '<button class="btn btn-default warning text-center green isActive' +
                                        '" >' +
                                        this._translate.instant('VEHICLES.ACTIVATE') +
                                    '</button> ' +
                                '</div>'
                            );
                    
                        } else {
                            return (
                                '<div class="text-center">' +
                                    '<button class="btn btn-default warning text-center gray isActive' +
                                        '">' +
                                        this._translate.instant('VEHICLES.ACTIVATE') +
                                    '</button> ' +
                                '</div>'
                            );
                        
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

                        botones += `
                            <div class="text-center editar">
                                <img class="icons-datatable point" src="assets/icons/optimmanage/create-outline.svg">
                            </div>
                        `;

                        return botones;
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
        this.initEvents('#delivery-zones tbody', this.table);
    }
    changePage(name: string){
     
        switch (name) {
            case 'route':
                this.change = name;
                this.Router.navigate(['/management-logistics/delivery-zones']);
                break;
    
                case 'specification':
                    this.change = name;
                    this.Router.navigate(['/management-logistics/delivery-zones/specification']);
                break;
        
            default:
                break;
        }
    }

    ChangeFilter(event) {
        let value = event.target.value;
    
        let id = event.target.id;

        this.setFilter(value, id, true);


    }

    setFilter(value: any, property: string, sendData?: boolean) {
        
        this.filterTable = {
            ...this.filterTable,
            values: {
                ...this.filterTable.values,
                [property]: value
            }
        } 
        
        this.stateFilters.add(this.filterTable);
        this.cargar();
        this.detectChange.detectChanges();

    }

    isActive(tbody: any, table: any, that = this) {
        $(tbody).on('click', '.isActive', function () {
            let data = table.row($(this).parents('tr')).data();
            that.openModalActive(data.id, !data.isActive, data);
        });
    }

    openModalActive(id: any, element: any, vehicle: any) {

        // se clona el punto para evitar modificar la instancia del this de la tabla
        const clonePoint = _.cloneDeep(vehicle);

        let data = {
            message: clonePoint.isActive ? this._translate.instant('DELIVERY_ZONES.DISABLED_ZONE')
                : this._translate.instant('DELIVERY_ZONES.ACTIVATE_ZONE')
        };


        const modal = this.dialog.open(ModalActivateZoneComponent, {
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            centered: true,
        });

        modal.componentInstance.data = data;

        modal.result.then(
            (resp: boolean) => {
                if (resp) {

                this.editActiveCompany(id, element);

                } else {
                    element = !element;
                }
            },
            (reason) => element = !element
        )
    }             
    editActiveCompany(vehicleId: number, element: any) {
        this.stateEasyrouteService.updateActiveZone(vehicleId, element).subscribe(
            (data: any) => {
                this.toast.displayWebsiteRelatedToast(
                    this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                    this._translate.instant('GENERAL.ACCEPT'),
                );
                this.table.ajax.reload();
            },
            (error) => {
                this.toast.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
    } 

    openSettngs(){
        this.Router.navigateByUrl('/preferences?option=routeSpecification');
    }
}
