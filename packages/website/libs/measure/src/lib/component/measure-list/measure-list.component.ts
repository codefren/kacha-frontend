import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { environment } from '@optimroute/env/environment';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MeasureFormComponent } from '../measure-form/measure-form.component';
import { MeasureInterface } from '../../../../../backend/src/lib/types/measure.type';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { MeasureService } from '../../measure.service';
import { MeasureModalActiveComponent } from './measure-modal-active/measure-modal-active.component';
import { Router } from '@angular/router';
import { AsignProductsFranchiseComponent } from 'libs/shared/src/lib/components/asign-products-franchise/asign-products-franchise.component';
import { Subject } from 'rxjs';
import { Profile } from '../../../../../backend/src/lib/types/profile.type';
import { ProfileSettingsFacade } from '../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { take, takeUntil } from 'rxjs/operators';

declare var $: any;
declare function init_plugins();


@Component({
    selector: 'lib-measure-list',
    templateUrl: './measure-list.component.html',
    styleUrls: ['./measure-list.component.scss'],
})
export class MeasureListComponent implements OnInit,OnDestroy {
    table: any;
    unsubscribe$ = new Subject<void>();
    profile: Profile;

    constructor(
        private authLocal: AuthLocalService,
        private _translate: TranslateService,
        private dialog: NgbModal,
        private _toastService: ToastService,
        private _measureService: MeasureService,
        private _router: Router,
        public facadeProfile: ProfileSettingsFacade
    ) {}

    ngOnInit() {
        setTimeout(()=>{
            init_plugins();
        }, 1000);  
        this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
            if (loaded) {
    
                this.facadeProfile.profile$
                    .pipe(takeUntil(this.unsubscribe$))
                    .subscribe((data) => {
                        this.profile = data;
                    });
            }
        });
        
        this.cargar();
    }

    cargar() {
        let url = environment.apiUrl + 'measure_datatables';
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#measure';

        this.table = $(table).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            cache: false,
            order: [0, 'asc'],
            lengthMenu: [50, 100],
            language: environment.DataTableEspaniol,
            dom: `
                <'row'
                    <'col-sm-8 col-lg-10 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
                    <'col-sm-4 col-lg-2 col-12 label-search'f>
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
                    data: 'id',
                    title: this._translate.instant('CONFIGURATIONS.MEASURE.ID'),
                },
                {
                    data: 'code',
                    title: this._translate.instant('CONFIGURATIONS.MEASURE.CODE'),
                },
                {
                    data: 'name',
                    title: this._translate.instant('CONFIGURATIONS.MEASURE.FORMAT_TYPE'),
                    render: (data, type, row) => {
                        let name = data;
                        if (name.length > 30) {
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
                    data: 'created_by_user',
                    title: this._translate.instant('CONFIGURATIONS.MEASURE.CREATED_BY'),
                    render: (data, type, row) => {
                        if (data == null || data == 0) {
                            return '<p class="text center" aria-hidden="true"> No disponible</p>';
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
                  data: 'allowFloatQuantity',
                  title: this._translate.instant('CONFIGURATIONS.FORMAT.ALLOW_DECIMAL_AMOUNTS'),
                  searchable: false,
                  render: ( data, type, row ) => {
                    
                    if ( data ) {
                      return (`
                        <div class="justify-content-center row reset">
                          <span>Si</span>
                        </div>
                      `);

                      /* return (`
                        <div class="justify-content-center row reset">
                          <div class="success-chip">
                            <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                          </div>
                        </div>
                      `); */
                    }

                    return (`
                      <div class="justify-content-center row reset">
                          <span> No</span>
                      </div> 
                    `);

                    /* return (`
                      <div class="justify-content-center row reset">
                        <div class="times-chip">
                          <i class="fas fa-times mt-2"></i>
                        </div>  
                      </div> 
                    `); */
                  }
                },
                {
                    data: 'isActive',
                    title: this._translate.instant('CONFIGURATIONS.MEASURE.ACTIVE'),
                    render: (data, type, row) => {

                        console.log(data)
                        //if (data === '1' || data === 1 || data === true) {
                        if (data) {
                            return (
                                '<div class="text-center">' +
                                    '<button class="btn btn-default isActive warning text-center green' +
                                        '" >' +
                                        this._translate.instant('GENERAL.ACTIVATE') +
                                    '</button> ' +
                                '</div>'
                            );
                            /* return (`
                            <div class="row justify-content-center reset">
                              <div class="round-new">
                                <input type="checkbox" class="isActive" id="row_${ row.id }" checked="true"  />
                                <label for="row_${ row.id }"></label>
                              </div>
                            </div>
                          `); */
                        }

                        return (
                            '<div class="text-center">' +
                                '<button class="btn btn-default isActive warning text-center gray' +
                                    '">' +
                                    this._translate.instant('GENERAL.ACTIVATE') +
                                '</button> ' +
                            '</div>'
                        );
                        /* return (`
                        <div class="row justify-content-center reset">
                          <div class="round-new">
                            <input type="checkbox" class="isActive" id="row_${ row.id }"  />
                            <label for="row_${ row.id }"></label>
                          </div>
                        </div>
                    `); */
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
                            <div class="text-center editar reset">
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
        this.editar('#measure tbody', this.table);
        this.isActive('#measure tbody', this.table);
    }

    editar(tbody: any, table: any, that = this) {
        $(tbody).unbind();

        $(tbody).on('click', 'div.editar', function() {
            let data = table.row($(this).parents('tr')).data();

            that._router.navigate(['measure', data.id]);
        });
    }

    isActive(tbody: any, table: any, that = this) {
        $(tbody).on('click', '.isActive', function() {
            let data = table.row($(this).parents('tr')).data();
            that.activateMeasure(data.id, !data.isActive, data);
        });
    }

    activateMeasure(productId: number, element: any, product: any) {

        let data = {
            isActive: element,
            name: product.name
        };

        const modal = this.dialog.open(MeasureModalActiveComponent, {
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            centered: true,
        });

        modal.componentInstance.data = data;

        modal.result.then(
            (result) => {
                if (result) {
                    this.editActiveMeasure(productId, data);
                } else {
                    element = !element;
                }
            },
            (reason) => {
                this._toastService.displayHTTPErrorToast(reason.status, reason.error.error);
            },
        );

    }

    ngOnDestroy() {
        this.unsubscribe$.complete();
        this.unsubscribe$.next();
    }
    

    editActiveMeasure(productId: number, element: any) {
        this._measureService.updateMeasure(productId, element).subscribe(
            (data: any) => {
                this._toastService.displayWebsiteRelatedToast(
                    this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                    this._translate.instant('GENERAL.ACCEPT'),
                );
                this.table.ajax.reload();
            },
            (error) => {
                this._toastService.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
    }

    openModalFranchise(){

        let title = this._translate.instant('FRANCHISE.TO_WHAT_FRANCHISE');
        let subTitle = this._translate.instant('PRODUCTS.SELECT_THE_FRANCHISES_SEND_FORMATS');
        let message = this._translate.instant('CONFIGURATIONS.CATEGORY.MEASURE_SENDED');

        const modal = this.dialog.open( AsignProductsFranchiseComponent, {
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            centered: true,
        });

        console.log(message);

        modal.componentInstance.title = title;
        modal.componentInstance.subTitle = subTitle;
        modal.componentInstance.message = message;

    }

    showSentProductFranshise (){
        if ( this.profile &&
            this.profile.company &&
            this.profile.company.companyParentId != null
            ) {
                return false;
            }
            else{
                return true 
            }
    }

    openPdf(){
        console.log('abrir descargar productos');
    }
    
    openImportProducts(){
        console.log('abrir importar productos');
    }
    
    redirectProducts(){
        this._router.navigate(['products']);
    }
    
    redirectCategories(){
        this._router.navigate(['category']);
    }
    openSetting(){
        this._router.navigateByUrl('/preferences?option=products');
    }

}
