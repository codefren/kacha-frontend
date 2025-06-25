import { secondsToDayTimeAsString } from '@optimroute/shared';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { DurationPipe } from '../../../../../../shared/src/lib/pipes/duration.pipe';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StateDeliveryZonesFacade } from '../../../../../../state-delivery-zones/src/lib/+state/delivery-zones.facade';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { environment } from '../../../../../../../apps/easyroute/src/environments/environment';
declare var $;
import * as _ from 'lodash';

@Component({
  selector: 'easyroute-modal-add-company-franchise',
  templateUrl: './modal-add-company-franchise.component.html',
  styleUrls: ['./modal-add-company-franchise.component.scss']
})
export class ModalAddCompanyFranchiseComponent implements OnInit {

  table: any;
  selected: any = [];
  selectAll: boolean = false;
  zones: any[];
  zoneSelected: string = '';
  

  constructor(
    public authLocal: AuthLocalService,
    private _translate: TranslateService,
    private backend: BackendService,
    private detectChanges: ChangeDetectorRef,
    private durationPipe: DurationPipe,
    public activateModal: NgbActiveModal,
    public zoneFacade: StateDeliveryZonesFacade,
    private router: Router) { }

  ngOnInit() {
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

  cargar(zone?: string) {
    let that = this;
    let url = zone ? environment.apiUrl + 'company_franchise_zone_linked_datatables?deliveryZoneId=' + zone : environment.apiUrl + 'company_franchise_zone_linked_datatables';
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    this.table = $('#zoneFranchise').DataTable({
        destroy: true,
        serverSide: true,
        processing: false,
        stateSave: true,
        cache: false,
        scrollY: '35vh',
        //paging: true,
        stateSaveParams: function (settings, data) {
            data.search.search = "";
            $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
        },
        initComplete: function (settings, data) {
            settings.oClasses.sScrollBody = "";
            $('.dataTables_empty').html('No hay datos disponibles en esta tabla, ' +
                '<a id="newStore" style="color: #0088cc; cursor:pointer; text-decoration: underline;">Añadir tienda</a>');
            $('.dataTables_scrollBody thead tr').addClass('color-hidden-scroll');
        },
        drawCallback: (settings, json) => {
            setTimeout(() => {
                $('#zoneFranchise').DataTable().columns.adjust();
            }, 1);
        },
        lengthMenu: [50, 100],
        dom: `
            <'row p-0'
                <'col-lg-8 col-12 d-flex flex-column justify-content-center align-items-center align-items-lg-start select-personalize-datatable'l>
                <'col-lg-4 col-12 label-search'fr>
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
                columnText: function (dt, idx, title) {
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
            this.table.rows()
            this.table.rows()[0].forEach((element) => {
                if (this.selected.find(x => +x.id === + this.table.row(element).data().id) === undefined) {
                    this.selectAll = false;
                }

            });
            if (this.selected.find(x => x.id === data.id)) {
                $(row).addClass('selected');
            }
            $(row).addClass('point');
        },
        columns: [
            {
                data: 'name',
                title: this._translate.instant('FRANCHISE.INTERNAL_NAMES'),
                className: 'withdTo',
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
                data: 'nif',
                title: this._translate.instant('FRANCHISE.CIF'),
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
                data: 'streetAddress',
                title: this._translate.instant('FRANCHISE.ADDRESS'),
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
                data: 'id',
                sortable: false,
                searchable: false,
                buttons: false,
                render: (data, type, row) => {
                    
                    return (`
                    <div class="justify-content-center row backgroundColorRow">
                      <div class="round round-little">
                        <input type="checkbox" class="isActive" id="ck-${data.toString().replace('(', '').replace(')', '')}"  />
                        <label></label>
                      </div>
                    </div>
                  `);
                }
            }
        ],
    });
    
    
        $('.easyroute-modal-add-company-franchise').find('.label-search').html(`
    
        <div class="form-group row pl-0 pr-0 justify-content-center"> 
            <div class="col-md-12 col-12 p-0">
                <div class="d-flex flex-lg-row flex-column justify-content-center align-items-center align-items-lg-start">
                    
                    <div class="input-group input-search" style="width: initial !important;">
                        <input id="search-modal" type="text" class="form-control pull-right input-personalize-datatable" placeholder="Buscar tienda">
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
        $('#zoneFranchise').DataTable().search(this.value).draw();
    });

    $('.dataTables_filter').removeAttr("class");
    this.initEvents('#zoneFranchise tbody', this.table);
    this.newStore('#zoneFranchise tbody', this.table);
} 
  newStore(tbody: any, table: any, that = this) {
    $(tbody).on('click', '#newStore', function () {
        that.router.navigateByUrl('franchise/store/new');
        that.activateModal.close();
    });
}
  initEvents(tbody: any, table: any, that = this) {
    $(tbody).unbind();
    this.select(tbody, table);
}
  select(tbody: any, table: any, that = this) {
    $(tbody).on('click', 'tr', function () {

        that.selectAll = true;
        let data = table.row($(this)).data();
        if (data && data != null) {


            that.selectAll = true;
            var index = that.selected.findIndex(x => x.id === data.id);
            if (index === -1) {

                that.selected.push(data);

                // $('#ck-' + data.id).removeClass("fa-check");
                // $('#ck-' + data.id).addClass("fa-times");

                // $('#ck-' + data.id).removeClass("text-success");
                // $('#ck-' + data.id).addClass("text-danger");

                $('#ck-' + data.id.toString().replace('(', '').replace(')', '')).prop('checked', true);
                $(this).addClass('selected');

            } else {

                that.selectAll = false;
                that.selected.splice(index, 1);

                // console.log( $('#ck-' + data.id) );

                // $('#ck-' + data.id).removeClass("fa-times");
                // $('#ck-' + data.id).addClass("fa-check");
                // $('#ck-' + data.id).removeClass("text-danger");
                // $('#ck-' + data.id).addClass("text-success");

                $('#ck-' + data.id.toString().replace('(', '').replace(')', '')).prop('checked', false);
                $(this).removeClass('selected');
            }

            console.log(that.selected);
            that.table.rows()[0].forEach((element) => {
                if (that.selected.find(x => +x.id === +  that.table.row(element).data().id) === undefined) {
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
        var index = this.selected.findIndex(x => x.id === data.id);
        if (this.selectAll) {

            this.selected.push(data);

            $('#ck-' + data.id.toString().replace('(', '').replace(')', '')).prop('checked', true);

            /* $('#ck-' + data.id).removeClass("fa-check");
            $('#ck-' + data.id).addClass("fa-times");

            $('#ck-' + data.id).removeClass("text-success");
            $('#ck-' + data.id).addClass("text-danger"); */

            $(this.table.row(element).node()).addClass('selected');
        } else {

            $('#ck-' + data.id.toString().replace('(', '').replace(')', '')).prop('checked', false);

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

  isSalesman() {
    return this.authLocal.getRoles()
        ? this.authLocal.getRoles().find((role: any) => role === 2) !== undefined
        : false;
}

}
