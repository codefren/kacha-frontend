import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { AuthLocalService } from '@optimroute/auth-local';
import { BackendService, Zone } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { secondsToDayTimeAsString, DurationPipe, LoadingService } from '@optimroute/shared';
import { StateDeliveryZonesFacade } from '@optimroute/state-delivery-zones';
import { RoutePlanningFacade } from '@optimroute/state-route-planning';

import { take } from 'rxjs/operators';

declare var $;

@Component({
    selector: 'easyroute-modal-delivery-points',
    templateUrl: './modal-delivery-points.component.html',
    styleUrls: ['./modal-delivery-points.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalDeliveryPointsComponent implements OnInit {

    isEvaluted: boolean = false;
    selectAll: boolean = false;
    selected: any = [];
    routePlanningDeliveryZoneId: number;
    table: any;
    zones: Zone[];
    zoneSelected: string = '';
    tabOption: number = 1;
    next: number = 1;
    quantity: number = 0;
    description: string = '';
    constructor(
        public activeModal: NgbActiveModal,
        private authLocal: AuthLocalService,
        private _translate: TranslateService,
        private detectChanges: ChangeDetectorRef,
        private facade: RoutePlanningFacade,
        private loading: LoadingService,
        private backend: BackendService,
        public zoneFacade: StateDeliveryZonesFacade
    ) { }

    ngOnInit() {
        this.tabOption = 1;
        this.quantity = 0;
        this.description = '';
        this.backend.timeoutToken().subscribe(
            (data) => {
                this.zoneFacade.loadAll();
                this.zoneFacade.loaded$.pipe(take(2)).subscribe((loaded) => {
                    if (loaded) {
                        this.zoneFacade.allDeliveryZones$.pipe(take(1)).subscribe((data) => {
                            this.zones = data;
                            this.cargar();
                        });
                    }
                })
            },
            (error) => {
                this.backend.Logout();
            },
        );
    }

    closeDialog(value: any) {
        if (value.length === 0) {
            this.activeModal.close();
        } else {
            this.loading.showLoading();
            if (this.isEvaluted) {
                this.facade.addDeliveryPointEvaluted(this.selected, this.routePlanningDeliveryZoneId);
            } else {
                this.facade.addDeliveryPoint(this.selected, this.routePlanningDeliveryZoneId);
            }
            this.facade.adding$.pipe(take(2)).subscribe((adding) => {
                if (!adding) {
                    this.loading.hideLoading();
                    this.detectChanges.detectChanges();
                    this.activeModal.close();
                }
            })
        }
    }

    submit(selecteds) {
        if (this.tabOption === 1) {
            this.closeDialog(selecteds);
        } else {
            this.loading.showLoading();
            this.selected[0].demand = this.quantity;
            this.selected[0].deliveryType = 'pickup';
            this.selected[0].deliveryNotes = this.description;
            if (this.isEvaluted) {
                this.facade.addPickUpPointEvaluted(this.selected, this.routePlanningDeliveryZoneId);
            } else {
                this.facade.addPickUp(this.selected, this.routePlanningDeliveryZoneId);
            }
            this.facade.adding$.pipe(take(2)).subscribe((adding) => {
                if (!adding) {
                    this.loading.hideLoading();
                    this.detectChanges.detectChanges();
                    this.activeModal.close();
                }
            })

        }
    }

    changeOption(value) {
        this.next = 1;
        this.cargar();
    }

    cargar(zone?: string) {
        if (this.table) {
            this.table.clear();
            this.table.state.clear();
        }
        this.detectChanges.detectChanges();
        let that = this;
        this.selected = [];

        let url = zone ? environment.apiUrl + 'delivery_point_datatables?deliveryZoneId=' + zone : environment.apiUrl + 'delivery_point_datatables';
        url += zone ? `&showActive=true` : `?showActive=true`;

        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = "#clients";

        this.table = $(table).DataTable({
            paging: true,
            destroy: true,
            serverSide: true,
            processing: false,
            stateSave: true,
            cache: false,
            scrollY: '30vh',
            stateSaveParams: function (settings, data) {
                data.search.search = "";
                $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
            },
            initComplete: function (settings, data) {
                settings.oClasses.sScrollBody = "";
                console.log($('#clients').DataTable());
                $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
            },
            drawCallback: (settings, json) => {
                setTimeout(() => {
                    $('#clients').DataTable().columns.adjust();
                }, 1);
            },
            lengthMenu: [50, 100, 400],
            dom: `
                <'row p-0'
                    <'col-lg-7 col-12 d-flex flex-column justify-content-center align-items-center align-items-lg-start select-personalize-datatable'l>
                    <'col-lg-5 col-12 label-search'fr>
                >
                <"top-button-hide"><'point no-scroll-x table-responsive't>
                <'row reset'
                  <'col-lg-5 col-md-12 col-12 d-flex flex-column justify-content-center align-items-cente align-items-lg-start align-items-md-center'i>
                  <'col-lg-7 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-start align-items-md-center'p>
                >
            `,
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

                    $('#clients_processing').html(html);

                    $('#refrescar').click(() => {
                        this.cargar();
                    });
                },
            },
            rowCallback: (row, data) => {
                if ($.inArray(data.id, this.selected.map(x => x.id)) !== -1) {
                    $(row).addClass('selected');
                }
                $(row).addClass('point');
            },
            columns: [
                {
                    data: 'id',
                    title: this._translate.instant('DELIVERY_POINTS.ID'),
                    className: 'widthTd',
                },
                {
                    data: 'name',
                    title: this._translate.instant('DELIVERY_POINTS.NAME_'),
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
                    data: 'address',
                    title: this._translate.instant('DELIVERY_POINTS.ADDRESS'),
                    render: (data, type, row) => {
                        let id = data;
                        if (id.length > 10) {
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
                    data: 'delivery_zone.id',
                    title: this._translate.instant('DELIVERY_ZONES.ZONE'),
                    render: (data, type, row) => {

                        let name = 'No disponible';

                        if (row.delivery_zone) {
                            name = row.delivery_zone.name === null
                                ? row.delivery_zone.id
                                : row.delivery_zone.name;
                        }

                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            name +
                            '">' +
                            name +
                            '</span>'
                        );
                    },
                },
                {
                    data: 'deliveryWindowStart',
                    title: this._translate.instant('DELIVERY_POINTS.START'),
                    render: (data, type, row) => {
                        if (data != null) {
                            return '<span data-toggle="tooltip" data-placement="top" title="' +
                                data
                                ? secondsToDayTimeAsString(data)
                                : '00:00' + '">' + data
                                    ? secondsToDayTimeAsString(data)
                                    : '00:00' + '</span>';
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                'Libre' +
                                '">' +
                                'Libre' +
                                '</span>'
                            );
                        }
                    },
                },
                {
                    data: 'deliveryWindowEnd',
                    title: this._translate.instant('DELIVERY_POINTS.END'),
                    render: (data, type, row) => {
                        if (data != null) {
                            return '<span data-toggle="tooltip" data-placement="top" title="' +
                                data
                                ? secondsToDayTimeAsString(data)
                                : '00:00' + '">' + data
                                    ? secondsToDayTimeAsString(data)
                                    : '00:00' + '</span>';
                        } else {
                            return (
                                '<span data-toggle="tooltip" data-placement="top" title="' +
                                'Libre' +
                                '">' +
                                'Libre' +
                                '</span>'
                            );
                        }
                    },
                },
                {
                    data: 'id',
                    sortable: false,
                    searchable: false,
                    buttons: false,
                    render: (data, type, row) => {

                        return (`
                        <div class="row justify-content-center backgroundColorRow">
                          <div class="round round-little text-center">
                            <input type="checkbox" class="isActive" id="ck-${data.replace('(', '').replace(')', '')}"  />
                            <label></label>
                          </div>
                        </div>
                      `);
                    }
                }
            ],
        });

        let options = '';
        this.zones.forEach((zone) => {
            if (this.zoneSelected && this.zoneSelected === zone.id) {
                options += '<option value="' + zone.id + '" selected>' + zone.name + '</option>'
            } else {
                options += '<option value="' + zone.id + '">' + zone.name + '</option>'
            }

        });
        $('.optimroute-delivery-points').find('.label-search').html(`
    
            <div class="form-group row pl-0 pr-0 justify-content-center"> 
                <div class="col-md-12 col-12 p-0">
                    <div class="d-flex flex-lg-row flex-column justify-content-center align-items-center align-items-lg-start">
                        
                        <!-- select de búsqueda -->
                          <select class="form-control-sm select-search-datatables select-filter
                              mt-1 mb-2 mt-md-0 mb-lg-0 mr-lg-4 pl-0 pr-0" style="height: 35px !important;"
                          >
                              <option value="">Filtrar por zona</option>
                              `+ options + `
                          </select>
        
                        <div class="input-group input-search" style="width: initial !important;">
                            <input id="search-modal" type="text" class="form-control pull-right input-personalize-datatable" placeholder="Buscar clientes">
                            <span class="input-group-append">
                                <span class="input-group-text table-append">
                                    <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `);

        $('.select-search-datatables').on('change', function () {
            that.zoneSelected = this.value;
            that.selected = [];
            that.cargar(this.value);
        });
        $('#search-modal').on('keyup', function () {
            $('#clients').DataTable().search(this.value).draw();
        });

        $('.dataTables_filter').removeAttr("class");




        this.initEvents('#clients tbody', this.table);
    }

    initEvents(tbody: any, table: any, that = this) {
        $(tbody).unbind();
        this.select(tbody, table);
    }

    nextOption() {
        this.next = 2;
    }


    editSelecteds() {
        this.next = 1;
        this.cargar();
    }

    select(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'tr', function () {


            if (that.tabOption === 1) {
                that.selectAll = true;
                let data = table.row($(this)).data();
                that.selectAll = true;
                var index = that.selected.findIndex(x => +x.id === +data.id);

                if (index === -1) {
                    that.selected.push({
                        id: data.id,
                        name: data.name
                    });


                    $('#ck-' + data.id.replace('(', '').replace(')', '')).prop('checked', true);

                    $(this).addClass('selected');
                } else {
                    that.selectAll = false;

                    that.selected.splice(index, 1);

                    $('#ck-' + data.id.replace('(', '').replace(')', '')).prop('checked', false);

                    $(this).removeClass('selected');
                }

                that.table.rows()[0].forEach((element) => {
                    if (that.selected.find(x => +x.id === +that.table.row(element).data().id) === undefined) {
                        that.selectAll = false;
                    }
                });


                console.log(that.selected);

                that.detectChanges.detectChanges();
            } else {

                let data = table.row($(this)).data();
                var index = that.selected.findIndex(x => +x.id === +data.id);

                if (index === -1) {

                    if (that.selected && that.selected.length > 0) {
                        const eliminar = that.selected[0].id;

                        $('#ck-' + eliminar.replace('(', '').replace(')', '')).prop('checked', false);

                        $('#ck-' + eliminar.replace('(', '').replace(')', '')).parent().parent().parent().parent().removeClass('selected');

                        that.selected = [];
                    }

                    that.selected.push({
                        id: data.id,
                        name: data.name
                    });


                    $('#ck-' + data.id.replace('(', '').replace(')', '')).prop('checked', true);

                    $(this).addClass('selected');
                } else {
                    that.selectAll = false;

                    that.selected.splice(index, 1);

                    $('#ck-' + data.id.replace('(', '').replace(')', '')).prop('checked', false);

                    $(this).removeClass('selected');
                }

                that.table.rows()[0].forEach((element) => {
                    if (that.selected.find(x => +x.id === +that.table.row(element).data().id) === undefined) {
                        that.selectAll = false;
                    }
                });


                console.log(that.selected);

                that.detectChanges.detectChanges();

            }

        });
    }

    selectAllFunc() {
        this.table.rows()[0].forEach((element) => {
            let data = this.table.row(element).data();
            var index = this.selected.findIndex(x => x.id === data.id);

            if (this.selectAll) {
                this.selected.push({
                    id: data.id,
                    name: data.name
                });

                $('#ck-' + data.id.replace('(', '').replace(')', '')).prop('checked', true);

                $(this.table.row(element).node()).addClass('selected');
            } else {
                $('#ck-' + data.id.replace('(', '').replace(')', '')).prop('checked', false);

                $(this.table.row(element).node()).removeClass('selected');

                this.selected.splice(index, 1);
            }

            this.detectChanges.detectChanges();
        });
    }

}
