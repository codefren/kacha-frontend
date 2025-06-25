import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy  } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DeliveryPoint, Zone } from '@optimroute/backend';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@optimroute/env/environment';
import { secondsToDayTimeAsString, LoadingService } from '@optimroute/shared';
import { RoutePlanningFacade } from '@optimroute/state-route-planning';
import { take } from 'rxjs/operators';
declare var $;
@Component({
  selector: 'easyroute-move-multiple-delivery-point',
  templateUrl: './move-multiple-delivery-point.component.html',
  styleUrls: ['./move-multiple-delivery-point.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoveMultipleDeliveryPointComponent implements OnInit {

    table: any;
    constructor(public activeModal: NgbActiveModal,
        private _translate: TranslateService,
        private detectChanges: ChangeDetectorRef,
        private facade: RoutePlanningFacade,
        private loading: LoadingService) { 
        
    }

    deliveryPoints: DeliveryPoint[];
    zones: Zone[];
    zoneId: number;
    zoneIdDestiny: number;
    selected: any = [];
    order: number = 1;
    selectAll: boolean = false;
    ngOnInit() {
        console.log(this.zones);
        if (this.deliveryPoints) {
        this.load();      
        }
    }


    closeDialog(value: any) { 
        this.activeModal.close(value);
    }

    load() {
        if (this.table) {
            this.table.clear();
            this.table.state.clear();
        }

        this.detectChanges.detectChanges();
        let table = '#deliveryPointsMoveMultiple';

        this.table = $(table).DataTable({
            destroy: true,
            processing: false,
            paging: true,
            aaSorting: [],
            scrollY: '30vh',
            data: this.deliveryPoints,
            lengthMenu: [50, 100],
            stateSave: true,
            cache: false,
            stateSaveParams: function (settings, data) {
                $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
            },
            initComplete : function (settings, data) {
                
                settings.oClasses.sScrollBody="";
                $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
            },
            drawCallback: (settings, json) =>{
                setTimeout(() => {
                    $('#deliveryPointsMoveMultiple').DataTable().columns.adjust();
                }, 1);
            },
            dom: `
                <'row p-0'
                    <'col-sm-6 col-12 d-flex flex-column justify-content-center align-items-center align-items-md-start select-personalize-datatable'l>
                    <'col-sm-6 col-12 label-search'fr>
                >
                <"top-button-hide"><'point  table-responsive't>
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
            <div class="form-group row justify-content-sm-end justify-content-center">
                <div class="input-group" style="width: initial !important;">
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

        this.initEvents('#deliveryPointsMoveMultiple tbody', this.table);
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

    close() {
        this.activeModal.close({
            routePlanningDeliveryZoneIdOrig: +this.zoneId,
            routePlanningDeliveryZoneIdDest: +this.zoneIdDestiny,
            routePlanningDeliveryPoints: this.selected,
            order: this.order
        
        });
    }

    selectAllFunc() {
        this.selected = [];

        this.table.rows()[0].forEach((element) => {
            let data = this.table.row(element).data();

            if (this.selectAll) {
                this.selected.push(data.id)
                $('#ck-' + data.id).prop('checked', true);
                $(this.table.row(element).node()).addClass('selected');
            } else {
                $('#ck-' + data.id).prop('checked', false);
                $(this.table.row(element).node()).removeClass('selected');
            }

            this.detectChanges.detectChanges();
        });
    }
    
}
