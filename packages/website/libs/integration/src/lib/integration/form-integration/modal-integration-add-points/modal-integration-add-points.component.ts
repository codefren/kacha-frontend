import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
declare var $;
import * as _ from 'lodash';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { DurationPipe } from '../../../../../../shared/src/lib/pipes/duration.pipe';
import { secondsToDayTimeAsString } from '../../../../../../shared/src/lib/util-functions/day-time-to-seconds';
import { environment } from '@optimroute/env/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StateDeliveryZonesFacade } from '@optimroute/state-delivery-zones';
import { Zone } from '@optimroute/backend';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'easyroute-modal-integration-add-points',
    templateUrl: './modal-integration-add-points.component.html',
    styleUrls: ['./modal-integration-add-points.component.scss'],
})
export class ModalIntegrationAddPointsComponent implements OnInit {
    table: any;
    selected: any = [];
    selectAll: boolean = false;
    zones: Zone[];
    zoneSelected: string = '';
    constructor(
        public authLocal: AuthLocalService,
        private _translate: TranslateService,
        private backend: BackendService,
        private detectChanges: ChangeDetectorRef,
        private durationPipe: DurationPipe,
        public activateModal: NgbActiveModal,
        public zoneFacade: StateDeliveryZonesFacade,
        private router: Router,
    ) {}

    ngOnInit() {
        this.backend.timeoutToken().subscribe(
            (data) => {
                this.zoneFacade.loadAll();
                this.zoneFacade.loaded$.pipe(take(2)).subscribe((loaded) => {
                    if (loaded) {
                        this.zoneFacade.allDeliveryZones$
                            .pipe(take(1))
                            .subscribe((data) => {
                                this.zones = data.filter((x) => x.isActive === true);
                                this.cargar();
                            });
                    }
                });
            },
            (error) => {
                this.backend.Logout();
            },
        );
    }
    cargar(zone?: string) {
        let that = this;

        let url = zone
            ? environment.apiUrl +
              'delivery_point_datatables?showActive=true&deliveryZoneId=' +
              zone
            : environment.apiUrl + 'delivery_point_datatables?showActive=true';

        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        this.table = $('#clients').DataTable({
            destroy: true,
            serverSide: true,
            processing: false,
            stateSave: true,
            cache: false,
            scrollY: '35vh',
            //paging: true,
            stateSaveParams: function(settings, data) {
                data.search.search = '';
                $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
            },
            initComplete: function(settings, data) {
                settings.oClasses.sScrollBody = '';
                $('.dataTables_empty').html(
                    'No hay datos disponibles en esta tabla, ' +
                        '<a id="newClient" style="color: #0088cc; cursor:pointer; text-decoration: underline;">Crear cliente</a>',
                );
                $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
            },
            drawCallback: (settings, json) => {
                setTimeout(() => {
                    $('#clients')
                        .DataTable()
                        .columns.adjust();
                }, 1);
            },
            lengthMenu: [50, 100],
            dom: `
                <'row p-0'
                    <'col-lg-6 col-12 d-flex flex-column justify-content-center align-items-center align-items-lg-start select-personalize-datatable'l>
                    <'col-lg-6 col-12 label-search'fr>
                >
                <"top-button-hide"><'point table-responsive't>
                <'row reset'
                  <'col-lg-5 col-md-12 col-12 d-flex flex-column justify-content-center align-items-cente align-items-lg-start align-items-md-center'i>
                  <'col-lg-7 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-start align-items-md-center'p>
                >
            `,
            buttons: [
                {
                    extend: 'colvis',
                    text: this._translate.instant('GENERAL.SHOW/HIDE'),
                    columnText: function(dt, idx, title) {
                        return idx + ': ' + title;
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

                    $('#clients_processing').html(html);

                    $('#refrescar').click(() => {
                        this.cargar();
                    });
                },
            },
            rowCallback: (row, data) => {
                this.selectAll = true;
                this.table.rows();
                this.table.rows()[0].forEach((element) => {
                    if (
                        this.selected.find(
                            (x) => +x.id === +this.table.row(element).data().id,
                        ) === undefined
                    ) {
                        this.selectAll = false;
                    }
                });
                if (this.selected.find((x) => x.id === data.id)) {
                    $(row).addClass('selected');
                }
                $(row).addClass('point');
            },
            columns: [
                {
                    data: 'id',
                    title: this._translate.instant('DELIVERY_POINTS.ID'),
                    className: 'withdTo',
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
                    data: 'province',
                    title: this._translate.instant('DELIVERY_ZONES.PROVINCE'),
                },
                {
                    data: 'delivery_zone.id',
                    title: this._translate.instant('DELIVERY_ZONES.ZONE'),
                    render: (data, type, row) => {
                        let name = 'No disponible';

                        if (row.delivery_zone) {
                            name =
                                row.delivery_zone.name === null
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
                        return `
                        <div class="justify-content-center row backgroundColorRow">
                          <div class="round round-little">
                            <input type="checkbox" class="isActive" id="ck-${data
                                .replace('(', '')
                                .replace(')', '')}"  />
                            <label></label>
                          </div>
                        </div>
                      `;
                    },
                },
            ],
        });
        let options = '';
        this.zones.forEach((zone) => {
            if (this.zoneSelected && this.zoneSelected === zone.id) {
                options +=
                    '<option value="' + zone.id + '" selected>' + zone.name + '</option>';
            } else {
                options += '<option value="' + zone.id + '">' + zone.name + '</option>';
            }
        });
        $('.easyroute-modal-integration-add-points')
            .find('.label-search')
            .html(
                `
    
          <div class="form-group row pl-0 pr-0 justify-content-center"> 
              <div class="col-md-12 col-12 p-0">
                  <div class="d-flex flex-lg-row flex-column justify-content-center align-items-center align-items-lg-start">
                      
                      <!-- select de búsqueda -->
                        <select class="form-control-sm select-search-datatables select-filter
                            mt-1 mb-2 mt-md-0 mb-lg-0 mr-lg-4 pl-0 pr-0" style="height: 35px !important;"
                        >
                            <option value="">Filtrar por zona</option>
                            ` +
                    options +
                    `
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
        `,
            );

        $('.select-search-datatables').on('change', function() {
            that.zoneSelected = this.value;
            that.selected = [];
            that.cargar(this.value);
        });
        $('#search-modal').on('keyup', function() {
            $('#clients')
                .DataTable()
                .search(this.value)
                .draw();
        });

        $('.dataTables_filter').removeAttr('class');
        this.initEvents('#clients tbody', this.table);
        this.newClient('#clients tbody', this.table);
    }
    newClient(tbody: any, table: any, that = this) {
        $(tbody).on('click', '#newClient', function() {
            that.router.navigateByUrl('management/clients/new');
            that.activateModal.close();
        });
    }
    initEvents(tbody: any, table: any, that = this) {
        $(tbody).unbind();
        this.select(tbody, table);
    }
    select(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'tr', function() {
            that.selectAll = true;
            let data = table.row($(this)).data();
            if (data && data != null) {
                that.selectAll = true;
                var index = that.selected.findIndex((x) => x.id === data.id);
                if (index === -1) {
                    that.selected.push(data);

                    // $('#ck-' + data.id).removeClass("fa-check");
                    // $('#ck-' + data.id).addClass("fa-times");

                    // $('#ck-' + data.id).removeClass("text-success");
                    // $('#ck-' + data.id).addClass("text-danger");

                    $('#ck-' + data.id.replace('(', '').replace(')', '')).prop(
                        'checked',
                        true,
                    );
                    $(this).addClass('selected');
                } else {
                    that.selectAll = false;
                    that.selected.splice(index, 1);

                    // console.log( $('#ck-' + data.id) );

                    // $('#ck-' + data.id).removeClass("fa-times");
                    // $('#ck-' + data.id).addClass("fa-check");
                    // $('#ck-' + data.id).removeClass("text-danger");
                    // $('#ck-' + data.id).addClass("text-success");

                    $('#ck-' + data.id.replace('(', '').replace(')', '')).prop(
                        'checked',
                        false,
                    );
                    $(this).removeClass('selected');
                }

                console.log(that.selected);
                that.table.rows()[0].forEach((element) => {
                    if (
                        that.selected.find(
                            (x) => +x.id === +that.table.row(element).data().id,
                        ) === undefined
                    ) {
                        that.selectAll = false;
                    }
                });

                that.detectChanges.detectChanges();
            }
        });
    }
    closeModal() {
        this.activateModal.close(this.selected);
    }

    selectAllFunc() {
        this.table.rows()[0].forEach((element) => {
            let data = this.table.row(element).data();
            var index = this.selected.findIndex((x) => x.id === data.id);
            if (this.selectAll) {
                this.selected.push(data);

                $('#ck-' + data.id.replace('(', '').replace(')', '')).prop('checked', true);

                /* $('#ck-' + data.id).removeClass("fa-check");
                $('#ck-' + data.id).addClass("fa-times");

                $('#ck-' + data.id).removeClass("text-success");
                $('#ck-' + data.id).addClass("text-danger"); */

                $(this.table.row(element).node()).addClass('selected');
            } else {
                $('#ck-' + data.id.replace('(', '').replace(')', '')).prop(
                    'checked',
                    false,
                );

                /* $('#ck-' + data.id).removeClass("fa-times");
                $('#ck-' + data.id).addClass("fa-check");
                $('#ck-' + data.id).removeClass("text-danger");
                $('#ck-' + data.id).addClass("text-success"); */

                $(this.table.row(element).node()).removeClass('selected');
                this.selected.splice(index, 1);
            }

            console.log(this.selected);

            this.detectChanges.detectChanges();
        });
    }

    modalDismiss() {
        this.activateModal.close([]);
    }
}
