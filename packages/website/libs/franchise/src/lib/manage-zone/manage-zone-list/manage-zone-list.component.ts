
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { environment } from '@optimroute/env/environment';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { secondsToDayTimeAsString } from '../../../../../shared/src/lib/util-functions/day-time-to-seconds';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { Franchise } from '../../../../../backend/src/lib/types/franchise.type';

import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { Router } from '@angular/router';
import { ModalConfirmationComponent } from '../../components/franchise-management/modal-confirmation/modal-confirmation.component';
declare var $: any;


@Component({
  selector: 'easyroute-manage-zone-list',
  templateUrl: './manage-zone-list.component.html',
  styleUrls: ['./manage-zone-list.component.scss']
})
export class ManageZoneListComponent implements OnInit {

  me: boolean;
  table: any;
  disabled: boolean;
  selected: any = [];
  timeInterval: any;
  franchise: Franchise;
  refreshTime: number = environment.refresh_datatable_assigned;
  

  constructor(
    private Router: Router,
    private authLocal: AuthLocalService,
    private modalService: NgbModal,
    private loading: LoadingService,
    private detectChanges: ChangeDetectorRef,
    private toastService: ToastService,
    private stateEasyrouteService: StateEasyrouteService,
    private _translate: TranslateService,
    ) { }

  ngOnInit() {
    this.cargar();
}

cargar() {
    this.selected = [];
    let isSalesman = this.isSalesman() && this.me == false;
    let url = environment.apiUrl + 'zone_datatables';
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#assigned';
    this.table = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: true,
        cache: false,
        order: [0, 'asc'],
        stateSaveParams: function (settings, data) {
            data.search.search = "";
        },
        lengthMenu: [50, 100],
        dom: `
            <'row'<'col-sm-5 col-md-5 col-xl-8 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
                <'col-sm-4 col-md-5 col-xl-3 col-12 label-search'f>
                <'col-sm-3 col-md-2 col-xl-1 col-12'
                    <'row p-0 justify-content-sm-end justify-content-center'B>
                >
            >
            <'row p-0 reset'
            <'offset-sm-6 offset-lg-6 offset-5'>
            <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>>
            <"top-button-hide"><'table-responsive't>
            <'row reset'
                <'col-lg-5 col-md-5 col-12 pl-4 pr-4 d-flex flex-column justify-content-center align-items-cente'i>
                <'col-lg-7 col-md-7 col-12 pl-5 pr-5 d-flex flex-column justify-content-center align-items-lg-start align-items-md-start'p>
            >
        `,
        headerCallback: ( thead, data, start, end, display ) => {
            $('.buttons-collection').html('<i class="far fa-edit"></i>'+ ' ' + this._translate.instant('GENERAL.SHOW/HIDE'))
        },
        /* dom: `
            <'row'
                <'col-sm-5 col-lg-8 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
                <'col-sm-4 col-lg-2 col-12 label-search'fr>
                <'offset-sm-3 offset-lg-2'>
            >
            <"top-button-hide"><'table-responsive't><p>
        `, */
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
            beforeSend: () => {
                this.detectChanges.detectChanges();
                this.disabled = true;
            },
            complete: () => {
                this.detectChanges.detectChanges();
                this.disabled = false;
            },
            error: (xhr, error, thrown) => {
                let html = '<div class="container" style="padding: 10px;">';
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
        rowCallback: (row, data) => {
            if ($.inArray(data.id, this.selected) !== -1) {
                $(row).addClass('selected');
            }
        },
        columns: [
            {
                data: 'name',
                title: this._translate.instant('FRANCHISE.MANAGE_ZONES.ZONE_NAME'),
                render: (data, type, row) => {
                    if (data === null) {
                        return 'No disponible';
                    } else {
                        return data;
                    }
                },
            },
            {
                data: 'store_number',
                title: this._translate.instant(
                    'FRANCHISE.MANAGE_ZONES.STORE_NUMBER',
                ),
                render: (data, type, row) => {
                    if (data === null) {
                        return 'No disponible';
                    } else {
                        return data;
                    }
                },
            },
            {
                data: 'email',
                title: this._translate.instant('USERS.EMAIL'),
                render: (data, type, row) => {
                    if (data === null) {
                        return 'No disponible';
                    } else {
                        return data;
                    }
                },
            },
            
            {
                data: 'phone',
                title: this._translate.instant('GENERAL.PHONE_NUMBER'),
                render: (data, type, row) => {
                    if (data === null) {
                        return 'No disponible';
                    } else {
                        return data;
                    }
                },
            },
            {
                data: 'address',
                title: this._translate.instant('FRANCHISE.MAIN_STORE_ADDRESS'),
                render: (data, type, row) => {
                    if (data === null) {
                        return 'No disponible';
                    } else {
                        return data;
                    }
                },
            },
           
            {
                data: 'scheduleStart',
                title: this._translate.instant('FRANCHISE.HOURS_FROM'),
                render: (data, type, row) => {
                    
                    if ( data ) {
                        return (`<span>${ secondsToDayTimeAsString( data ) }</span>`)
                    } 

                    return (`<span>---------</span>`);
                },
            },
            {
                data: 'scheduleEnd',
                title: this._translate.instant('FRANCHISE.HOURS_UNTIL'),
                render: ( data, type, row ) => {

                    if ( data ) {
                        return (`<span>${ secondsToDayTimeAsString( data ) }</span>`)
                    } 

                    return (`<span>---------</span>`);
                }
            },
           
            {
                data: 'showInApp',
                title: this._translate.instant('FRANCHISE.SHOW_APP'),
                render: ( data, type, row ) => {
                    if ( data ) {
                        return (`
                            <div class="row reset justify-content-center">
                                <div class="success-chip-new">
                                <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                                </div>
                            </div>
                        `);
                    }

                    return (`
                        <div class="justify-content-center row reset">
                            <div class="times-chip-new">
                                <i class="fas fa-times mt-2"></i>
                            </div>  
                        </div> 
                  `);
                }
            },
            
            {
                data: null,
                sortable: false,
                searchable: false,
                title: this._translate.instant('GENERAL.EDIT'),
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
        <div class="d-flex justify-content-md-end justify-content-center mr-xl-2">
            <div class="input-group datatables-input-group-width">
                <input 
                    id="search" 
                    type="text" 
                    class="form-control 
                    pull-right input-personalize-datatable" 
                    placeholder="Buscar"
                    style="max-width: initial;"
                >
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

    this.editar(tbody, table);

    this.isActive(tbody, table);

}

editar(tbody: any, table: any, that = this) {
    $(tbody).on('click', 'div.editar', function() {
        let data = table.row($(this).parents('tr')).data();
        that.Router.navigate(['franchise/zone', data.id]);
    });
}

select(tbody: any, table: any, that = this) {
    $(tbody).on('click', 'tr', function() {
        let data = table.row($(this)).data();

        var index = $.inArray(+data.id, that.selected);

        if (index === -1) {
            that.selected.push(+data.id);
        } else {
            that.selected.splice(index, 1);
        }

        $(this).toggleClass('selected');

        that.detectChanges.detectChanges();
    });
}

isActive(tbody: any, table: any, that = this) {
    $(tbody).on('click', '.isActive', function() {
        let data = table.row($(this).parents('tr')).data();
        that.OnChangeCheckActive(data.id, !data.activeInApp, data);
    });
}

OnChangeCheckActive(franchiseId: number, element: any, franchise: any) {

    let data = {
        activeInApp: element,
        name: franchise.name,
    };

    const modal = this.modalService.open(ModalConfirmationComponent, {
        backdrop: 'static',
        backdropClass: 'customBackdrop',
        centered: true,
        size: 'md',
    });

    modal.componentInstance.data = data;

    modal.result.then(
        (result) => {
            if (result) {
                this.editActiveCompany(franchiseId, data);
            } else {
                element = !element;
            }
        },
        (reason) => {
            this.toastService.displayHTTPErrorToast(reason.status, reason.error.error);
        },
    );
}

editActiveCompany(franchiseId: number, element: any) {
    this.loading.showLoading();

    this.stateEasyrouteService.updateFranchise(franchiseId, element).subscribe(
        (data: any) => {
            this.toastService.displayWebsiteRelatedToast(
                this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                this._translate.instant('GENERAL.ACCEPT'),
            );
            this.table.ajax.reload();
            this.loading.hideLoading();
        },
        (error) => {
            this.loading.hideLoading();

            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
        },
    );
}

isSalesman() {
    return this.authLocal.getRoles()
        ? this.authLocal.getRoles().find((role: any) => role === 2) !== undefined
        : false;
}

}
