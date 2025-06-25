import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ValidatorFn,
    Validators,
    FormControl,
    FormGroupDirective,
    NgForm,
} from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
declare var $;
import { Vehicle, Zone, User, FilterState, BackendService } from '@optimroute/backend';
import { isIntegerValidator, ModalApplyRentingCostComponent, ModalGeneralDownloadComponent, secondsToDayTimeAsString, ToastService } from '@optimroute/shared';
import { ErrorStateMatcher } from '@angular/material';
import { StateUsersFacade } from '@optimroute/state-users';
import { Observable } from 'rxjs';
import { StateUsersService } from 'libs/state-users/src/lib/state-users.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmationVehiclesComponent } from './modal-confirmation-vehicles/modal-confirmation-vehicles.component';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { KeyValue, KeyValuePipe } from '@angular/common';
import { Router } from '@angular/router';
import { RoutePlanningFacade } from '@optimroute/state-route-planning';
import { take } from 'rxjs/operators';
import { StateVehiclesService, VehiclesFacade } from '@optimroute/state-vehicles';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { StateFilterStateFacade } from '@easyroute/filter-state';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { ModalActivateComponent } from './modal-activate/modal-activate.component';
import { StateDeliveryZonesFacade } from '../../../../../state-delivery-zones/src/lib/+state/delivery-zones.facade';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { Profile } from '../../../../../backend/src/lib/types/profile.type';
import { ModalViewPdfGeneralComponent } from '../../../../../shared/src/lib/components/modal-view-pdf-general/modal-view-pdf-general.component';




class Matcher implements ErrorStateMatcher {
    isErrorState(
        control: FormControl | null,
        form: FormGroupDirective | NgForm | null,
    ): boolean {
        const isSubmitted = form && form.submitted;
        return !!(
            control &&
            control.invalid &&
            (control.dirty || control.touched || isSubmitted)
        );
    }
}

@Component({
    selector: 'easyroute-management-vehicles-table',
    templateUrl: './management-vehicles-table.component.html',
    styleUrls: ['./management-vehicles-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementVehiclesTableComponent implements OnInit {
    table: any;

    change: string = 'vehicles';

    @Input()
    vehicles: Vehicle[];

    timeInterval: any;

    @Input()
    zones: Zone[];

    zone: Zone[];

    matcher = new Matcher();

    profile: Profile;

    users: Observable<User[]>;

    vehiclesType: any[];

    @Output() addVehicle = new EventEmitter<Vehicle>();

    @Output() editVehicle = new EventEmitter<[number, Partial<Vehicle>]>();

    @Output() deleteVehicle = new EventEmitter<number>();

    filterNone = {
        name: 'none',
        type: 'none',
        attributeName: 'none',
    };

    columns = [
        {
            name: 'Nombre',
            type: 'text',
            attributeName: 'name',
        },
        {
            name: 'Ruta de reparto',
            type: 'select',
            attributeName: 'deliveryZoneId',
        },
        {
            name: 'Capacidad',
            type: 'number',
            attributeName: 'capacity',
        },
        {
            name: 'Matrícula',
            type: 'text',
            attributeName: 'registration',
        },
        {
            name: 'Peso límite',
            type: 'number',
            attributeName: 'weightLimit',
        },
        {
            name: 'Próxima revisión',
            type: 'date',
            attributeName: 'nextVehicleInspection',
        },
    ];

    filter = this.filterNone;
    filterValue = null;

    filterTable: FilterState = {
        name: 'vehicle',
        values: {
            isActive: 'true',
            deliveryZoneId:'',
            userId:''
        }
    };

    adding: boolean;
    editingElementIndex: number = -1;

    emptyForm: Vehicle = {
        name: '',
        deliveryZoneId: undefined,
        capacity: 0,
        weightLimit: 0,
        registration: '', // matricula
        nextVehicleInspection: undefined,
        userId: null,
        deliveryWindowEnd: 0,
        deliveryWindowStart: 0,
    };

    formGroup: FormGroup;

    selected: any = [];

    showInfoDetail: boolean = true;
    informativeData: any;

    usersVehicles: any[] = [];

    dataIsActive: any = [
        {
            id: 1,
            name: this._translate.instant('GENERAL.IS_ACTIVE'),
            value:'true'
        },
        {
            id: 2,
            name: this._translate.instant('GENERAL.IS_INACTIVE'),
            value: 'false'

        }
    ]

    sortedFilteredElements() {
        const vehicles = this.filteredElements();
        if (vehicles) {
            return vehicles.slice().sort((a: Vehicle, b: Vehicle) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                else if (a.name.toLowerCase() == b.name.toLowerCase()) return 0;
                else return 1;
            });
        } else return null;
    }

    filteredElements() {
        if (
            this.filter.type === 'none' ||
            this.filterValue === null ||
            (this.filterValue.length === 0 && this.filter.type !== 'select')
        ) {
            return this.vehicles;
        } else if (this.filter.type === 'number') {
            return this.vehicles.filter((e) =>
                e[this.filter.attributeName]
                    ? e[this.filter.attributeName] === +this.filterValue
                    : false,
            );
        } else if (this.filter.type === 'text') {
            return this.vehicles.filter((e) => {
                return e[this.filter.attributeName]
                    ? e[this.filter.attributeName]
                          .toLowerCase()
                          .includes(this.filterValue.toLowerCase())
                    : false;
            });
        } else if (this.filter.type === 'select') {
            if (this.filterValue === 0) {
                return this.vehicles;
            } else if (this.filterValue === '')
                return this.vehicles.filter((v) => {
                    return !v.deliveryZoneId;
                });
            else {
                return this.vehicles.filter((v) => v.deliveryZoneId === this.filterValue);
            }
        }
    }

    confirmAddition(): void {
        let deliveryZoneId = this.formGroup.get('deliveryZoneId').value;
        const newElement: Vehicle = {
            name: this.formGroup.get('name').value,
            deliveryZoneId: deliveryZoneId.length === 0 ? null : deliveryZoneId,
            capacity: +this.formGroup.get('capacity').value,
            weightLimit: this.formGroup.get('weightLimit').value
                ? +this.formGroup.get('weightLimit').value
                : null,
            registration: this.formGroup.get('registration').value
                ? this.formGroup.get('registration').value
                : null,
            nextVehicleInspection: this.formGroup.get('nextVehicleInspection').value
                ? this.formGroup.get('nextVehicleInspection').value
                : null,
            userId:
                this.formGroup.get('userId').value == 'null'
                    ? null
                    : this.formGroup.get('userId').value,
            vehicleTypeId:
                this.formGroup.get('vehicleTypeId').value == 0
                    ? null
                    : this.formGroup.get('vehicleTypeId').value,
            deliveryWindowEnd: this.formGroup.get('deliveryWindowEnd').value,
            deliveryWindowStart: this.formGroup.get('deliveryWindowStart').value,
        };
        this.adding = false;
        this.addVehicle.emit(newElement);
    }

    editElement(id: number, i: number): void {
        let editingCopy = _.cloneDeep(this.vehicles.find((v) => v.id === id));
        this.setUpForm(editingCopy, false);
        this.editingElementIndex = i;
    }

    confirmEdition(id: number): void {
        let deliveryZoneId = this.formGroup.get('deliveryZoneId').value;
        const newElement: Vehicle = {
            name: this.formGroup.get('name').value,
            deliveryZoneId: deliveryZoneId !== null ? deliveryZoneId : null,
            capacity: +this.formGroup.get('capacity').value,
            weightLimit: this.formGroup.get('weightLimit').value
                ? +this.formGroup.get('weightLimit').value
                : null,
            registration: this.formGroup.get('registration').value
                ? this.formGroup.get('registration').value
                : null,
            nextVehicleInspection: this.formGroup.get('nextVehicleInspection').value
                ? this.formGroup.get('nextVehicleInspection').value
                : null,
            userId:
                this.formGroup.get('userId').value == 'null'
                    ? null
                    : this.formGroup.get('userId').value,
            vehicleTypeId:
                this.formGroup.get('vehicleTypeId').value == 'null'
                    ? null
                    : this.formGroup.get('vehicleTypeId').value,
            deliveryWindowEnd: this.formGroup.get('deliveryWindowEnd').value,
            deliveryWindowStart: this.formGroup.get('deliveryWindowStart').value,
        };
        let partialVehicle = this.compareVehicles(
            this.vehicles.find((v) => v.id === id),
            newElement,
        );

        if (Object.keys(partialVehicle).length !== 0)
            this.editVehicle.emit([id, partialVehicle]);
        this.editingElementIndex = -1;
    }

    deleteElement(id: number, name:string): void {
        let buttonAccept = 'GENERAL.DELETE';

        const dialogRef = this.dialog.open(ModalConfirmationVehiclesComponent, {
            size: 'md',
            centered: true,
            backdrop: 'static',
        });
        dialogRef.componentInstance.id = id;
        dialogRef.componentInstance.name = name;
        dialogRef.componentInstance.buttonAccept = buttonAccept;

        dialogRef.result.then(([add, object]) => {
            if (add) {
                this.routeFacade.allZones$.pipe(take(1)).subscribe((zones) => {
                    if (zones) {
                        let zonesTrans: any = this.pipeKeyValue.transform(zones);
                        if (
                            zonesTrans.find(
                                (x) =>
                                    x.value.vehicles.find((x) => +x.id === +id) !=
                                    undefined,
                            )
                        ) {
                            let zona = zonesTrans.find(
                                (x) =>
                                    x.value.vehicles.find((x) => +x.id === +id) !=
                                    undefined,
                            ).value;
                            this.routeFacade.stopUsingVehicle(zona.id, id, zona);
                            this.routeFacade.adding$.pipe(take(2)).subscribe((adding) => {
                                if (!adding) {
                                    this.vehicleFacade.deleteVehicle(id);
                                    this.vehicleFacade.deleted$.subscribe((deleted) => {
                                        if (deleted) {
                                            this.vehicleFacade.loadAll();
                                            this.table.ajax.reload();
                                        }
                                    });
                                }
                            });
                        } else {
                            this.vehicleFacade.deleteVehicle(id);
                            this.vehicleFacade.deleted$.subscribe((deleted) => {
                                if (deleted) {
                                    this.vehicleFacade.loadAll();
                                    this.table.ajax.reload();
                                }
                            });
                        }
                    } else {
                        this.vehicleFacade.deleteVehicle(id);
                        this.vehicleFacade.deleted$.subscribe((deleted) => {
                            if (deleted) {
                                this.vehicleFacade.loadAll();
                                this.table.ajax.reload();
                            }
                        });
                    }
                });
            }
        });
    }

    formIsCorrect(): boolean {
        return !(
            this.formGroup.get('name').invalid || this.formGroup.get('capacity').invalid
        );
    }

    setUpForm(v: Vehicle, addingVehicle?: boolean): void {
        this.formGroup = this.fb.group({
            name: [
                v.name,
                [Validators.required, Validators.minLength(2), Validators.maxLength(150)],
            ],
            deliveryZoneId: [
                addingVehicle && this.filter.type === 'select' && this.filterValue !== 0
                    ? this.filterValue
                    : v.deliveryZoneId === undefined
                    ? ''
                    : v.deliveryZoneId,
            ],
            capacity: [
                v.capacity,
                [Validators.required, Validators.min(0), isIntegerValidator],
            ],
            weightLimit: [v.weightLimit],
            registration: [v.registration],
            nextVehicleInspection: [v.nextVehicleInspection],
            userId: [v.userId],
            vehicleTypeId: [v.vehicleTypeId],
        });
    }

    getZoneName(id: string) {
        if (id === null) return '-------------------';
        else return this.zones.find((z) => z.id === id).name;
    }

    compareVehicles(oldVehicle: Vehicle, newVehicle: Vehicle): Partial<Vehicle> {
        let partialVehicle: Partial<Vehicle> = {};
        for (let key in oldVehicle) {
            if (
                oldVehicle[key] !== newVehicle[key] &&
                key !== 'id' &&
                key !== 'createdAt' &&
                key !== 'updatedAt'
            ) {
                partialVehicle[key] = newVehicle[key];
            }
        }
        if (!oldVehicle['weightLimit'] && newVehicle['weightLimit']) {
            partialVehicle['weightLimit'] = newVehicle['weightLimit'];
        } else if (oldVehicle['weightLimit'] && !newVehicle['weightLimit']) {
            partialVehicle['weightLimit'] = null;
        }
        if (!oldVehicle['registration'] && newVehicle['registration']) {
            partialVehicle['registration'] = newVehicle['registration'];
        } else if (oldVehicle['registration'] && !newVehicle['registration']) {
            partialVehicle['registration'] = null;
        }
        // Special case of deliveryZoneId
        if (!oldVehicle['deliveryZoneId'] && newVehicle['deliveryZoneId']) {
            partialVehicle['deliveryZoneId'] = newVehicle['deliveryZoneId'];
        } else if (oldVehicle['deliveryZoneId'] && !newVehicle['deliveryZoneId']) {
            partialVehicle['deliveryZoneId'] = undefined;
        }
        if (!oldVehicle['nextVehicleInspection'] && newVehicle['nextVehicleInspection']) {
            partialVehicle['nextVehicleInspection'] = newVehicle['nextVehicleInspection'];
        } else if (
            oldVehicle['nextVehicleInspection'] &&
            !newVehicle['nextVehicleInspection']
        ) {
            partialVehicle['nextVehicleInspection'] = null;
        }
        return partialVehicle;
    }

    cargar() {

        let that = this;

        this.selected = [];

        let url = environment.apiUrl + 'vehicle_datatables?isActive=' + this.filterTable.values.isActive
        + '&deliveryZoneId=' + this.filterTable.values.deliveryZoneId + '&userId=' +this.filterTable.values.userId;


        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#vehicles';

        this.table = $(table).DataTable({
            destroy: true,
            processing: true,
            lengthMenu: [50, 100],
            order:[],
            stateSave: true,
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },

            dom:`
            <'row'
                <'col-xl-6 col-12 d-flex flex-column justify-content-start align-items-center align-items-md-start p-0'
                    <'col-xl-12 col-md-12 col-12 col-sm-12 pl-2 pr-2 buttonDom'>
                >
                <'col-xl-6 col-12 d-flex flex-column justify-content-center align-items-center align-items-md-end p-0'
                    <'row'
                        <'col-sm-6 col-md-6 col-xl-9 col-7 label-search'f>
                        <'col-sm-6 col-md-6 col-xl-3 col-5 dt-buttons-table'B>
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
            headerCallback: (thead, data, start, end, display) => {
                $('.buttons-collection').html(
                    '<img class="icons-datatable point" src="assets/images/edit_datatable.svg">' +
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
                    let html = '<div class="container" style="padding: 10px;">';
                    html +=
                        '<span class="text-orange">Ha ocurrido un errror al procesar la informacion.</span> ';
                    html +=
                        '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
                    html += '</div>';

                    $('#vehicles_processing').html(html);

                    $('#refrescar').click(() => {
                        this.cargar();
                    });
                },
            },
            rowCallback: (row, data) => {
                if ($.inArray(data.id, this.selected) !== -1) {
                    $(row).addClass('selected');
                }
            },
            columns: [
                {
                    data: 'idERP',
                    visible: false,
                    sortable: false,
                    searchable: false,
                    title: 'IdERP',
                    render: (data, type, row) => {

                        if (data) {
                            return (
                                '<span data-toggle="tooltip" data-placement="top"">' +
                                data +
                                '</span>'
                            );
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top"">' +
                                'No disponible' +
                                '</span>'
                            );
                        }

                    },
                },
                {
                    data: 'name',
                    title: this._translate.instant('VEHICLES.VEHICLE_NAME'),
                },
                {
                    data: 'vehicle_type',
                    title: this._translate.instant('VEHICLES.VEHICLE_TYPE'),
                    render: (data, type, row) => {
                        if (data == null || data == 0) {
                            return '<span class="text center" aria-hidden="true"> No disponible</span>';
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                '">' +
                                data.name +
                                '</span>'
                            );
                        }
                    },
                },
                {
                    data: 'delivery_zone.name',
                    title: this._translate.instant('VEHICLES.DELIVERY_ZONE'),
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
                    data: 'capacity',
                    title: this._translate.instant('VEHICLES.USEFUL_LOAD'),
                },
                {
                    data: 'registration',
                    title: this._translate.instant('VEHICLES.PLATE'),
                    visible: false,
                },
                {
                    data: 'weightLimit',
                    title: this._translate.instant('VEHICLES.WEIGHT_LIMIT'),
                },
                {
                    data: 'nextVehicleInspection',
                    title: this._translate.instant('VEHICLES.CAR_INSPECTION'),
                    visible: false,
                    render: (data, type, row) => {
                        if (data == null || data == 0) {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                '">' +
                                '______' +
                                '</span>'
                            );
                        } else {
                            return moment(data).format('DD/MM/YYYY');
                        }
                    },
                },
                {
                    data: 'user',
                    title: this._translate.instant('VEHICLES.DRIVER_ASSIGNED'),
                    render: (data, type, row) => {
                        if (data == null || data == 0) {
                            return '<span class="text center" aria-hidden="true"> No disponible</span>';
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
                    data: 'deliveryWindowStart',
                    title: this._translate.instant('GENERAL.START_TIME'),
                    render: (data, type, row) => {
                        return '<span data-toggle="tooltip" data-placement="top" title="' +
                            data
                            ? secondsToDayTimeAsString(data)
                            : '00:00' + '">' + data
                            ? secondsToDayTimeAsString(data)
                            : '00:00' + '</span>';
                    },
                },
                {
                    data: 'deliveryWindowEnd',
                    title: this._translate.instant('GENERAL.CLOSING_TIME'),
                    render: (data, type, row) => {
                        return '<span data-toggle="tooltip" data-placement="top" title="' +
                            data
                            ? secondsToDayTimeAsString(data)
                            : '00:00' + '">' + data
                            ? secondsToDayTimeAsString(data)
                            : '00:00' + '</span>';
                    },
                },
                {
                    data: 'isActive',
                    title: this._translate.instant('VEHICLES.ACTIVE'),
                    render: (data, type, row) => {

                        if (data) {
                            return (

                                '<div class="text-center">' +
                                '<button style="border-radius: 3px" class="btn btn-block green-new btn-sm isActive' +
                                    '" >' +
                                    this._translate.instant('GENERAL.IS_ACTIVE') +
                                '</button> ' +
                            '</div>'
                            );

                        } else {
                            return (
                                '<div class="text-center">' +
                                    '<button style="border-radius: 3px"  class="btn btn-block gray-new btn-sm pl-4 pr-4 isActive' +
                                        '">' +
                                        this._translate.instant('GENERAL.IS_INACTIVE') +
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
                    //title: this._translate.instant('GENERAL.ACTIONS'),
                    render: (data, type, row) => {
                        let botones = '<div class="text-center">';

                        botones += `
                            <span class="editar m-1">
                                <img class="icons-datatable point" src="assets/icons/optimmanage/create-outline.svg">
                            </span>
                        `;

                        botones += '</div>';

                        return botones;
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

    let options = '';



    this.zone.forEach((zone: any) => {



        let userName = zone.name;

        if (userName && userName.length > 20) {

            userName = userName.substr(0, 16) + '...';

        }

        if (that.filterTable.values.deliveryZoneId === zone.id) {

            options += '<option title="' + zone.name + '" value="' + zone.id + '" selected>' + userName + '</option>'

        } else {

            options += '<option title="' + zone.name + '" value="' + zone.id + '">' + userName + '</option>'

        }


    });

    let routeLi = '';

    this.usersVehicles.forEach((user: any) => {

        let routeName = user;

        if (Number(that.filterTable.values.userId) === user.id) {


            routeLi += '<option title="' + user.name + ' ' + user.surname + '" value="' + that.filterTable.values.userId + '" selected>' + routeName.name + ' ' + routeName.surname + '</option>'

        } else {


            routeLi += '<option title="' + user.name + ' ' + user.surname + '" value="' + user.id + '">' + routeName.name + ' ' + routeName.surname + '</option>'

        }


    });

    let opctions_isActive = ''

    this.dataIsActive.forEach((active: any) => {


        if ((this.filterTable.values.isActive || !this.filterTable.values.isActive) === active.value) {

            opctions_isActive += '<option value="' + active.value + '" selected="true">' + active.name + '</option>'

        } else {

            opctions_isActive += '<option value="' + active.value + '">' + active.name + '</option>'
        }
    });

    $('.buttonDom').html(`
        <div class="form-row mb-1 mt-2 pl-1">
            <div class="col-12 col-xl-4 col-sm-4 mb-1 point">
                 <select

                  id="routeId"
                   class="form-select size-select form-control form-control-select-datatable select-search-route point">
                    <option value=""> Todas las rutas </option>
                    `+ options + `
                  </select>
               </div>
                <div class="col-12 col-xl-4 col-sm-4 mb-1 point">
                    <select (change)="ChangeFilter($event)"
                        [value]="filter.values.typeDeliveryPointId"
                        id="typeDeliveryPointId"
                        class="form-select size-select form-control form-control-select-datatable  select-search-user point">
                        <option value="">Chofer</option>
                        `+ routeLi + `
                    </select>
                </div>
                <div class="col-12 col-xl col-sm-4 mb-1">
                <select id="statusRouteId"
                    class="form-select form-control  form-control-select-datatable isActive point">
                    <option value="">${this._translate.instant('USERS.ALL')}</option>
                    `+ opctions_isActive + `
                </select>
            </div>
        </div>
    `);


    /* select de ruta */

    $('.select-search-route').on('change', function () {


        that.filterTable = {
            ...that.filterTable,
            values: {
                ...that.filterTable.values,
                deliveryZoneId: this.value
            }
        }

        that.stateFilters.add(that.filterTable);


        that.getResument()
    });


    $('.select-search-user').on('change', function () {

        that.filterTable = {
            ...that.filterTable,
            values: {
                ...that.filterTable.values,
                userId: this.value
            }
        }

        that.stateFilters.add(that.filterTable);

        that.getResument()
    });

    $('.isActive').on('change', function () {

        that.filterTable = {
            ...that.filterTable,
            values: {
                ...that.filterTable.values,
                isActive: this.value
            }
        }


        that.stateFilters.add(that.filterTable);


       that.getResument()


    });
        $('#search').on('keyup', function() {
            $(table)
                .DataTable()
                .search(this.value)
                .draw();
        });

        $('.dataTables_filter').removeAttr('class');

        this.initEvents('#vehicles tbody', this.table);
    }

    initEvents(tbody: any, table: any, that = this) {
        $(tbody).unbind();
        window.clearInterval(this.timeInterval);
        this.editar(tbody, table);
        this.trash(tbody, table);
        this.isActive(tbody, table);
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'span.editar', function() {
            let data = table.row($(this).parents('tr')).data();
            that.router.navigate([`/management-logistics/vehicles/${data.id}`]);
        });
    }

    trash(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'span.trash', function() {
            let data = table.row($(this).parents('tr')).data();

            that.deleteElement(data.id, data.name);
        });
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
            message: clonePoint.isActive ? this._translate.instant('VEHICLES.DISABLED_VEHICLE?')
                : this._translate.instant('VEHICLES.ACTIVATE_VEHICLE?')
        };


        const modal = this.dialog.open(ModalActivateComponent, {
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
        this.stateEasyrouteService.updateActiveVehicle(vehicleId, element).subscribe(
            (data: any) => {
                this._toastService.displayWebsiteRelatedToast(
                    this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                    this._translate.instant('GENERAL.ACCEPT'),
                );
                this.table.ajax.reload();
                this.getResument();
            },
            (error) => {
                this._toastService.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
    }

    changePage(name: string){

        switch (name) {
            case 'vehicles':
                this.change = name;
                this.router.navigate(['/management-logistics/vehicles']);
                break;

                case 'servies-type':
                    this.change = name;
                    this.router.navigate(['/management-logistics/vehicles/servies-type']);
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

        if (sendData) {
            this.cargar();
            //this.getResument();

            this.detectChange.detectChanges();
        }

    }

    getUsers() {

        this.loadingService.showLoading();

        this.stateEasyrouteService.getDriver(0).pipe(take(1)).subscribe(
            (data: any) => {

                this.usersVehicles = data.data;


                this.getZone();

                this.loadingService.hideLoading();

            },
            (error) => {

                this.loadingService.hideLoading();

                this._toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );

    }

    getZone(){
        this.zoneFacade.loadAll();
        this.zoneFacade.loaded$.pipe(take(2)).subscribe((loaded)=>{
            if(loaded){
                this.zoneFacade.allDeliveryZones$.pipe(take(1)).subscribe((data)=>{
                    this.zone = data.filter(x => x.isActive === true);


                });
                this.getResument();
            }
        })
    }

    getResument() {

        this.showInfoDetail = false;


        this.stateEasyrouteService
            .getInformativeVehicule(this.filterTable.values)
            .pipe(take(1))
            .subscribe(
                (data: any) => {

                    this.informativeData = data.vehicle;

                    this.showInfoDetail = true;

                    this.detectChange.detectChanges();

                    this.cargar();



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

    openSetting(){

        //this.router.navigate(['management-logistics/vehicles/settings'])
        this.router.navigateByUrl('/preferences?option=vehicleSpecification');
    }

    vehicleMaintenanceActive() {

        if (this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company &&
            this.profile.company.active_modules && this.profile.company.active_modules.find(x => x.id === 8)) {
            return true;
        } else {
            return false;
        }
    }

    moduleCost(){

        if (this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company &&
            this.profile.company.active_modules && this.profile.company.active_modules.find(x => x.id === 14)) {
            return true;
        } else {
            return false;
        }
    }

    openModalLoadRentingCost() {

        const modal = this.dialog.open(ModalApplyRentingCostComponent, {
          centered: true,
            size: 'xl',
            backdrop: 'static',
            backdropClass: 'modal-backdrop-ticket',
            windowClass: 'modal-travel-retainer-client',
        });

        modal.result.then(
          (data) => {
            if (data) {

            }
          },
          (reason) => {

          },
        );
    }

    importRenting(file: any) {

        let excel: FormData = new FormData();

        excel.append('import_file', file, file.name);

        this.loadingService.showLoading();

        this.vehicleService.loadRentingByExcel(excel).subscribe(
            (resp: any) => {

                this.loadingService.hideLoading();

                this.table.ajax.reload();

                this._toastService.displayWebsiteRelatedToast(
                    'Archivo procesado satisfactoriamente.',
                    this._translate.instant('GENERAL.ACCEPT'),
                );

                $("input[type='file']").val('');

            },
            (error: any) => {
                $("input[type='file']").val('');
                this.loadingService.hideLoading();
                this._toastService.displayHTTPErrorToast(error.error.code, error.error);
            },
        );

    }

    openModalDonwloadVehicle(){
        const modal = this.dialog.open(ModalGeneralDownloadComponent, {

            backdropClass: 'modal-backdrop-ticket',

            centered: true,

            windowClass:'modal-donwload-User',
            size:'md'
          });

          modal.componentInstance.title = this._translate.instant('VEHICLES.DOWNLOAD_VEHICLE');
          modal.componentInstance.message = this._translate.instant('VEHICLES.MESSAGE');

          modal.result.then(
            (data) => {


              if (data) {
                switch (data) {
                    case 'pdf':

                        this.dowloadVehiclePdf();

                        break;

                    case 'excel':

                        this.dowloadVehicleExcel();
                            break

                    default:
                        break;
                }

              }
            },
            (reason) => {

            },
          );
    }

    dowloadVehicleExcel() {

        let url = 'vehicle_download_excel?isActive=' + this.filterTable.values.isActive
        + '&deliveryZoneId=' + this.filterTable.values.deliveryZoneId + '&userId=' +this.filterTable.values.userId;

        return this.backend.getDownloadExcel(url, 'Vehicle').then((data: string)=>{ })
     }

     dowloadVehiclePdf() {

        let url = 'vehicle_download_pdf?isActive=' + this.filterTable.values.isActive
        + '&deliveryZoneId=' + this.filterTable.values.deliveryZoneId + '&userId=' +this.filterTable.values.userId;

        const modal = this.dialog.open( ModalViewPdfGeneralComponent, {

            backdropClass: 'modal-backdrop-ticket',

            centered: true,

            windowClass:'modal-view-pdf',

            size:'lg'

          });

          modal.componentInstance.title = this._translate.instant('VEHICLES.NAME');

          modal.componentInstance.url = url;
    }


    constructor(
        private fb: FormBuilder,
        private dialog: NgbModal,
        public authLocal: AuthLocalService,
        private _translate: TranslateService,
        private usersFacade: StateUsersFacade,
        private vehicleService: StateVehiclesService,
        private _toastService: ToastService,
        private routeFacade: RoutePlanningFacade,

        private router: Router,
        private pipeKeyValue: KeyValuePipe,
        private vehicleFacade: VehiclesFacade,
        private detectChange: ChangeDetectorRef,
        private stateEasyrouteService: StateEasyrouteService,
        private stateFilters: StateFilterStateFacade,
        private facadeProfile: ProfileSettingsFacade,
        public zoneFacade: StateDeliveryZonesFacade,
        private loadingService: LoadingService,
        private backend: BackendService,
    ) {}

    ngOnInit() {

        this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
            if (loaded) {
                this.facadeProfile.profile$.pipe(take(1)).subscribe(async (data)=>{

                    this.profile = data;

                    const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();

                    this.filterTable = filters.find(x => x.name === 'vehicle') ? filters.find(x => x.name === 'vehicle') : this.filterTable;

                    this.detectChange.detectChanges();
                    this.getUsers();

                })
            }
        });

    }

    ngOnDestroy() {
        window.clearInterval(this.timeInterval);
    }

}
