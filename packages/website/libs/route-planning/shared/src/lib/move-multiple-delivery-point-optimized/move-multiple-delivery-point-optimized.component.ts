import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { RoutePlanningFacade, PlanningDeliveryZone } from '@optimroute/state-route-planning';
import { LoadingService, secondsToDayTimeAsString } from '@optimroute/shared';
import { DeliveryPoint, Zone } from '@optimroute/backend';
import { environment } from '@optimroute/env/environment';
import { take } from 'rxjs/operators';
declare var $;
@Component({
  selector: 'easyroute-move-multiple-delivery-point-optimized',
  templateUrl: './move-multiple-delivery-point-optimized.component.html',
  styleUrls: ['./move-multiple-delivery-point-optimized.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoveMultipleDeliveryPointOptimizedComponent implements OnInit {

    deliveryPoints: DeliveryPoint[];
    order: number = 1;
    selectAll: boolean = false;
    selected: any = [];
    selectedRouteId: number;
    selectedZoneId: any
    table: any;
    zoneOptim: any;
    zones: {
        [key: number]: PlanningDeliveryZone;
    };
    _selectedRouteId: number;
    _selectedZoneId: any;

    constructor(public activeModal: NgbActiveModal,
        private _translate: TranslateService,
        private detectChanges: ChangeDetectorRef,
        private facade: RoutePlanningFacade,
        private loading: LoadingService
    ) { }
  
    ngOnInit() {
        if (this.deliveryPoints) {
            this.facade.allZones$.pipe(take(1)).subscribe((data) => { 
                if (data) { 
                    this.zones = data;
          
                    this.zoneOptim = this.zonesPickFunction(this.zones);
          
                    this.load();      
                }
            });
        }
    }
  
    zonesPickFunction(zones) {
        const object: any = {};
    
        for (const zoneId in zones) {
            if (
                zones[zoneId] &&
                zones[zoneId].optimization &&
                zones[zoneId].optimization.solution
            ) object[zoneId] = {
                // id: zoneId,
                id: zones[zoneId].id,
                name: zones[zoneId].name,
                amountDeliveryPoints: zones[zoneId].deliveryPoints.length,
                routes:
                    zones[zoneId] &&
                    zones[zoneId].optimization &&
                    zones[zoneId].optimization.solution &&
                    zones[zoneId].optimization.solution.routes
                        ? this.routesPickFunction(
                              zones[zoneId].optimization.solution.routes,
                          )
                        : {},
            }
        }
    
        return object;
    }

    routesPickFunction(routes) {
        const object: any = {};
    
        for (const index in routes) {
            object[routes[index].id] = {
                // id: routeId,
                route: routes[index],
                id: routes[index].id,
                amountDeliveryPoints: routes[index].deliveryPoints.length,
            };
        }
    
        return object;
    }


    zoneChanged() {
        this._selectedRouteId = +Object.keys(
            this.zoneOptim[this._selectedZoneId].routes,
        )[0];
    }

    closeDialog(value: any) { 
        this.activeModal.close(value);
    }

    selectAllFunc() {
        this.table.rows()[0].forEach((element) => {
            let data = this.table.row(element).data();

            if (this.selectAll) {
                this.selected.push(data.id)
                $('#ck-' + data.id).prop('checked', true);
                $(this.table.row(element).node()).addClass('selected');
            } else {
                this.selected = [];
                $('#ck-' + data.id).prop('checked', false);
                $(this.table.row(element).node()).removeClass('selected');
            }

            this.detectChanges.detectChanges();
        });
    }

    close() {
        this.activeModal.close({
            routeIdOrig: +this.selectedRouteId,
            routeIdDest: +this._selectedRouteId,
            routePlanningRouteDeliveryPoints: this.selected,
            zoneOrigId: +this.selectedZoneId,
            zoneDestId: +this._selectedZoneId,
            order: this.order
        });
    }

    load() {
        if (this.table) {
            this.table.clear();
            this.table.state.clear();
        }

        this.detectChanges.detectChanges();
        let table = "#deliveryPointsMoveMultipleOptimized";

        this.table = $(table).DataTable({
            destroy: true,
            processing: false,
            paging: true,
            scrollCollapse: true,
            aaSorting: [],
            data: this.deliveryPoints,
            scrollY: '20vh',
            stateSaveParams: function (settings, data) {
                data.search.search = "";
                $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
              },
            initComplete : function (settings, data) {
                settings.oClasses.sScrollBody="";
                $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
            },
            drawCallback: (settings, json) =>{
                setTimeout(() => {
                    $('#deliveryPointsMoveMultipleOptimized').DataTable().columns.adjust();
                }, 1);
            },
            lengthMenu: [50, 100],
            dom: `
                <'row'
                    <'col-sm-6 col-12 d-flex flex-column justify-content-center align-items-center align-items-md-start select-personalize-datatable'l>
                    <'col-sm-6 col-12 label-search'fr>
                >
                <"top-button-hide"><'point no-scroll-x table-responsive't>
                <'row reset'
                  <'col-lg-5 col-md-12 col-12 d-flex flex-column justify-content-center align-items-cente align-items-lg-start align-items-md-center'i>
                  <'col-lg-7 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-start align-items-md-center'p>
                >
            `,
            language: environment.DataTableEspaniol,
            rowCallback: (row, data) => {
                if ($.inArray(data.id, this.selected) !== -1) {
                    $(row).addClass('selected');
                }
            
                $(row).addClass('point');
            },
            columns: [
                {
                    data: 'order',
                    title: this._translate.instant('DELIVERY_POINTS.ORDER'),
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
                    data: 'deliveryWindow.start',
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
                    data: 'deliveryWindow.end',
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
                    render: (data, type, row) => {
                        if ( this.selected.find(x => x.id === data) ) {
                            return `
                                  <div class="row justify-content-center backgroundColorRow pr-3">
                                    <div class="round round-little text-center">
                                      <input type="checkbox" class="isActive" disabled="true" id="ck-${ data }"/>
                                      <label for="ck-${ data }"></label>
                                    </div>
                                  </div>
                                `;
                        } else {
                            return `
                            <div class="row justify-content-center backgroundColorRow pr-3">
                              <div class="round round-little text-center">
                                <input type="checkbox" class="isActive" disabled="true" id="ck-${ data }" />
                                <label for="ck-${ data }"></label>
                              </div>
                            </div>
                            `;
                        }
                    }
                }
            ],
        });

        $('.dataTables_filter').html(`
            <div class="row p-0 justify-content-sm-end justify-content-center">
                <div class="input-group input-search" style="width: initial !important;">
                    <input id="search" type="text" class="form-control pull-right input-personalize-datatable" placeholder="Buscar">
                    <span class="input-group-append">
                        <span class="input-group-text table-append">
                            <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                        </span>
                    </span>
                </div>
            </div>
        `);

        $('#search').on( 'keyup', function () {
            $(table).DataTable().search( this.value ).draw();
        });
        
        $('.dataTables_filter').removeAttr("class");

/*         setTimeout(() => {
            $(table).DataTable().columns.adjust().draw();  
        },1000);
     */
        this.initEvents(table + ' tbody', this.table);
    }

    initEvents(tbody: any, table: any, that = this) {
        $(tbody).unbind();
    
        this.select(tbody, table);
    }

    select(tbody: any, table: any, that = this) {
        $(tbody).on('click', 'tr', function () {
            let data = table.row($(this)).data();
            
            var index = $.inArray(data.id, that.selected);
            
            if (index === -1) {
                $('#ck-' + data.id).prop('checked', true);
                that.selected.push(data.id);
            } else {
                that.selected.splice(index, 1);
                $('#ck-' + data.id).prop('checked', false);
            }
            
            $(this).toggleClass('selected');
            
            that.selectAll = that.selected.length === that.deliveryPoints.length ? true : false;
            that.detectChanges.detectChanges();            
        });
    }

}
