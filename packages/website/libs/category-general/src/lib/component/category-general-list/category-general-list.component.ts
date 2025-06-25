import { Component, OnInit } from '@angular/core';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { environment } from '@optimroute/env/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { CategoryGeneralModalActiveComponent } from './category-general-modal-active/category-general-modal-active.component';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { CategoryGeneralFormComponent } from '../category-general-form/category-general-form.component';
import { SubCategoryFormComponent } from '../sub-category-form/sub-category-form.component';
import { CategoryInterface } from '../../../../../backend/src/lib/types/category.type';

declare var $: any;
import * as _ from 'lodash';
import { SubCategoryInterface } from '../../../../../backend/src/lib/types/sub-category.type';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';

@Component({
    selector: 'easyroute-category-general-list',
    templateUrl: './category-general-list.component.html',
    styleUrls: ['./category-general-list.component.scss'],
})
export class CategoryGeneralListComponent implements OnInit {
    table: any;
    SubCategoriesTable: any;
    me: boolean;
    category: CategoryInterface;

    constructor(
        private authLocal: AuthLocalService,
        private _modalService: NgbModal,
        private _toastService: ToastService,
        private _translate: TranslateService,
        private stateEasyrouteService: StateEasyrouteService,
        private _router: Router,
        private loading: LoadingService
    ) {}

    ngOnInit() {
        this.cargar();
        this.subCategoriasCargar();
    }

     /* categories */
     cargar() {
        let isSalesman = this.isSalesman() && this.me == false;
        let url = environment.apiUrl + 'category_datatables';
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#category_general';

        this.table = $(table).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            cache: false,
            scrollY: '500px',
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            scrollCollapse: true,
            lengthMenu: [30, 50, 100],
            dom: `
              <'row p-2'<' col-sm-6 col-12 d-flex flex-column justify-content-center select-personalize-datatable'l>
                  <'col-md-5 col-12 label-search'fr>
              >
              <t>
              <'row p-2 mt-2'<'col-sm-3 col-3 d-flex ion-text-left'i><'col-sm-6 col-6 m-2 ion-text-right'p>>
            `,
            buttons: [
                {
                    extend: 'colvis',
                    text: this._translate.instant('GENERAL.SHOW/HIDE'),
                    columnText: function(dt, idx, title) {
                        return title;
                    },
                    columns: ':gt(0)',
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
                { data: 'id', title: 'ID' },
                {
                    data: 'code',
                    title: this._translate.instant('CONFIGURATIONS.CODE'),
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
                    data: 'name',
                    title: this._translate.instant('CONFIGURATIONS.NAME'),
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
                    data: 'isActive',
                    title: this._translate.instant(
                        'PRODUCTS_GENERAL.PRODUCTS_LIST.ISACTIVE',
                    ),
                    render: (data, type, row) => {
                        let disabled = isSalesman ? 'disabled=true' : '';
                        if (disabled) {
                            if (data) {
                                return `<span>${this._translate.instant(
                                    'GENERAL.YES',
                                )}</span>`;
                            } else {
                                return `<span>${this._translate.instant(
                                    'GENERAL.NO',
                                )}</span>`;
                            }
                        } else {
                            if (data) {
                                return (`
                                  <div class="row justify-content-center">
                                    <div class="round">
                                      <input type="checkbox" class="isActive" id="row_${ row.id }" checked="true" ${disabled} />
                                      <label for="row_${ row.id }"></label>
                                    </div>
                                  </div>
                                `);

                            } else {
                                return (`
                                  <div class="row justify-content-center">
                                    <div class="round">
                                      <input type="checkbox" class="isActive" id="row_${ row.id }" ${disabled} />
                                      <label for="row_${ row.id }"></label>
                                    </div>
                                  </div>
                              `);
                            }
                        }
                    },
                },
                {
                    data: null,
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('GENERAL.ACTIONS'),
                    render: (data, type, row) => {
                        return `<span class="editar point"><i class="fas fa-edit eye-icon"></i></span>`;
                    },
                },
            ],
            order: [1, 'asc'],
        });
        $('.dataTables_filter').html(`
        <div class="form-group row">
            <div class="offset-md-4 col-md-8 pb-2 col-12">
                <div class="input-group">
                    <input id="search" type="text" class="form-control pull-right input-personalize-datatable" placeholder="Buscar">
                    <span class="input-group-append">
                        <span class="input-group-text table-append">
                            <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                        </span>
                    </span>
                </div>
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
        this.editar('#category_general tbody', this.table);
        this.isActive('#category_general tbody', this.table);
    }
   
    editar(tbody: any, table: any, that = this) {
        $(tbody).unbind();

        $(tbody).on('click', 'span.editar', function() {
            let data = table.row($(this).parents('tr')).data();

            that.getCategoryCompany(data.id);
        });
    }

    newCategoryGeneral() {
        let category: any = {
            category: {
                id: '',
                categoryId:'',
                name: '',
                code: '',
                isActive: true,
                images: null
            },
        };

        let showsubcategory = false;
        const dialogRef = this._modalService.open(CategoryGeneralFormComponent, {
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
        });
        dialogRef.componentInstance.data = category;
        dialogRef.componentInstance.titleTranslate = 'CONFIGURATIONS.CATEGORY.ADD_CATEGORY';
        dialogRef.componentInstance.showSubcategory = showsubcategory;
        dialogRef.result.then(([add, object]) => {
            if (add) {
                this.table.ajax.reload();
            }
        });
    }

    getCategoryCompany(categoryId: number) {
        this.loading.showLoading();

        this.stateEasyrouteService.getCategory(categoryId).subscribe(
            (data: any) => {
                this.category = data.data;

                this.editCategoryGeneral(this.category);

                this.loading.hideLoading();
            },
            (error) => {
                this.loading.hideLoading();

                this._toastService.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
    }

    editCategoryGeneral(category: any) {
        let editingCopy: CategoryInterface = _.cloneDeep(category);
        let showsubcategory = true;
        const dialogRef = this._modalService.open(CategoryGeneralFormComponent, {
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static'
        });
        dialogRef.componentInstance.data = {
            category: editingCopy,
        };
        dialogRef.componentInstance.showSubcategory = showsubcategory;
        dialogRef.componentInstance.titleTranslate = 'CONFIGURATIONS.CATEGORY.EDIT_CATEGORY';
        dialogRef.result.then(([add, object]) => {
            if (add) {
                this.table.ajax.reload();
                this.SubCategoriesTable.ajax.reload();
            }
        });
    }

    isActive(tbody: any, table: any, that = this) {
        $(tbody).on('click', '.isActive', function() {
            let data = table.row($(this).parents('tr')).data();
            that.OnChangeCheckActive(data.id, this, data);
        });
    }

    OnChangeCheckActive(productId: number, element: any, product: any) {

        let data = {
            isActive: element.checked,
            name: product.name,
            message: (element.checked) ? this._translate.instant('CONFIGURATIONS.CATEGORY.ACTIVATE_CATEGORIES') : this._translate.instant('CONFIGURATIONS.CATEGORY.DEACTIVATE_CATEGORIES')
        };

        const modal = this._modalService.open(CategoryGeneralModalActiveComponent, {
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            centered: true,
        });

        modal.componentInstance.data = data;

        modal.result.then(
            (result) => {
                if (result) {
                    this.editActiveCompany(productId, data);
                } else {
                    element.checked = !element.checked;
                }
            },
            (reason) => {
                this._toastService.displayHTTPErrorToast(reason.status, reason.error.error);
            },
        );
    }

    editActiveCompany(productId: number, element: any) {
        this.stateEasyrouteService.updateCategoryGeneral(productId, element).subscribe(
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

    /* end category */

     /* subCategory */
     subCategoriasCargar() {
        let isSalesman = this.isSalesman() && this.me == false;
        let url = environment.apiUrl + 'sub_category_datatables';
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let Subtable = '#sub_category_general';

        this.SubCategoriesTable = $(Subtable).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            cache: false,
            scrollY: '500px',
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            scrollCollapse: true,
            lengthMenu: [30, 50, 100],
            dom: `
            <'row p-2'<' col-sm-6 col-12 d-flex flex-column justify-content-center'l>
                <'col-md-5 col-12 label-search'fr>
            >
            <t>
            <'row p-2 mt-2'<'col-sm-3 col-3 d-flex ion-text-left'i><'col-sm-6 col-6 m-2 ion-text-right'p>>
            `,
            /*headerCallback: function(thead, data, start, end, display) {
                $(thead)
                    .find('th')
                    .eq(0)
                    .html('<i id="buttoncolvis" class="fas fa-ellipsis-v"></i>');
                $('#buttoncolvis').click(() => {
                    $('.buttons-collection').click();
                });
                $('.buttons-collection').hide();
            }, */
            buttons: [
                {
                    extend: 'colvis',
                    text: this._translate.instant('GENERAL.SHOW/HIDE'),
                    columnText: function(dt, idx, title) {
                        return title;
                    },
                    columns: ':gt(0)',
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
                    let html = '<div class="container" style="padding: 30px;">';
                    html +=
                        '<span class="text-orange">Ha ocurrido un errror al procesar la informacion.</span> ';
                    html +=
                        '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
                    html += '</div>';

                    $('#companies_processing').html(html);

                    $('#refrescar').click(() => {
                        this.subCategoriasCargar();
                    });
                },
            },
            columns: [
               
                { data: 'id', title: 'ID' },
                {
                    data: 'code',
                    title: this._translate.instant('CONFIGURATIONS.CODE'),
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
                    data: 'name',
                    title: this._translate.instant('CONFIGURATIONS.NAME'),
                    render: (data, type, row) => {
                        console.log(data.length > 30, 'name table');
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
                    data: 'category.name',
                    title: this._translate.instant('CONFIGURATIONS.CATEGORY.CATEGORY'),
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
                    data: 'isActive',
                    title: this._translate.instant(
                        'PRODUCTS_GENERAL.PRODUCTS_LIST.ISACTIVE',
                    ),
                    render: (data, type, row) => {
                        let disabled = isSalesman ? 'disabled=true' : '';
                        if (disabled) {
                            if (data) {
                                return `<span>${this._translate.instant(
                                    'GENERAL.YES',
                                )}</span>`;
                            } else {
                                return `<span>${this._translate.instant(
                                    'GENERAL.NO',
                                )}</span>`;
                            }
                        } else {
                            if (data) {
                                return (`
                                  <div class="row justify-content-center">
                                    <div class="round">
                                      <input type="checkbox" class="activeSubCategory" id="subcategory_${ row.id }" checked="true" ${disabled} />
                                      <label for="subcategory_${ row.id }"></label>
                                    </div>
                                  </div>
                                `);

                            } else {
                                return (`
                                  <div class="row justify-content-center">
                                    <div class="round">
                                      <input type="checkbox" class="activeSubCategory" id="subcategory_${ row.id }" ${disabled} />
                                      <label for="subcategory_${ row.id }"></label>
                                    </div>
                                  </div>
                              `);
                            }
                        }
                    },
                },
                {
                    data: null,
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('GENERAL.ACTIONS'),
                    render: (data, type, row) => {
                        return `<span class="subCategoryEditar point"><i class="fas fa-edit eye-icon"></i></span>`;
                    },
                },
            ],
            order: [1, 'asc'],
        });
        $('.dataTables_filter').html(`
            <div class="form-group row">
                <div class="offset-md-4 col-md-8 pb-2 col-12">
                    <div class="input-group">
                        <input id="SubCategorySearch" type="text" class="form-control pull-right input-personalize-datatable" placeholder="Buscar">
                        <span class="input-group-append">
                            <span class="input-group-text table-append">
                                <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        `);
        $('#SubCategorySearch').on('keyup', function() {
            $(Subtable)
                .DataTable()
                .search(this.value)
                .draw();
        });
        $('.dataTables_filter').removeAttr('class');
        this.subCategoryEditar('#sub_category_general tbody', this.SubCategoriesTable);
        this.activeSubCategory('#sub_category_general tbody', this.SubCategoriesTable);
    }

    subCategoryEditar(tbody: any, table: any, that = this) {
        $(tbody).unbind();

        $(tbody).on('click', 'span.subCategoryEditar', function() {
            let data = table.row($(this).parents('tr')).data();
            that.editSubCategoryGeneral(data);
        });
    }

    newSubCategoryGeneral() {
        let subCategory: any = {
            subCategory: {
                id: 0,
                categoryId: null,
                name: '',
                code: '',
                isActive: true,
            },
        };
        const dialogRef = this._modalService.open(SubCategoryFormComponent, {
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
            //size: 'xl',
        });
        dialogRef.componentInstance.data = subCategory;
        dialogRef.componentInstance.titleTranslate = 'CONFIGURATIONS.CATEGORY.ADD_SUB_CATEGORY';
        dialogRef.result.then(([add, object]) => {
            if (add) {
                this.SubCategoriesTable.ajax.reload();
            }
        });
    }

    editSubCategoryGeneral(subCategory: any) {
        let editingCopy: SubCategoryInterface = _.cloneDeep(subCategory);

        let showsubcategory = true;

        const dialogRef = this._modalService.open(SubCategoryFormComponent, {
            backdropClass: 'customBackdrop',
            centered: true,
            backdrop: 'static',
            //size: 'xs',
        });
        dialogRef.componentInstance.data = {
            subCategory: editingCopy,
        };
    
        dialogRef.componentInstance.titleTranslate = 'CONFIGURATIONS.CATEGORY.EDIT_SUB_CATEGORY';
        dialogRef.componentInstance.showSubcategory = showsubcategory;
        dialogRef.result.then(([add, object]) => {
            if (add) {
                this.SubCategoriesTable.ajax.reload();
            }
        });
    }

    activeSubCategory(tbody: any, table: any, that = this) {
        $(tbody).on('click', '.activeSubCategory', function() {
            let data = table.row($(this).parents('tr')).data();
            that.OnChangeCheckActiveSubCategory(data.id, this, data);
        });
    }

    OnChangeCheckActiveSubCategory(subcategoryId: number, element: any, subcategory: any) {
        let SubCategory = {
            isActive: element.checked,
            name: subcategory.name,
            message: (element.checked) ? this._translate.instant('CONFIGURATIONS.CATEGORY.ACTIVATE_SUBCATEGORIES') : this._translate.instant('CONFIGURATIONS.CATEGORY.DEACTIVATE_SUBCATEGORIES')
        };

        const modal = this._modalService.open(CategoryGeneralModalActiveComponent, {
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            centered: true,
        });

        modal.componentInstance.SubCategory = SubCategory;

        modal.result.then(
            (result) => {
                if (result) {
                    this.editActiveSubcategory(subcategoryId, SubCategory);
                } else {
                    element.checked = !element.checked;
                }
            },
            (reason) => {
                this._toastService.displayHTTPErrorToast(reason.status, reason.error.error);
            },
        );
    }

    editActiveSubcategory(subcategoryId: number, element: any) {
        this.stateEasyrouteService.updateSubCategory(subcategoryId, element).subscribe(
            (data: any) => {
                this._toastService.displayWebsiteRelatedToast(
                    this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                    this._translate.instant('GENERAL.ACCEPT'),
                );
                this.SubCategoriesTable.ajax.reload();
            },
            (error) => {
                this._toastService.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
    }
    /* end subCategori */



    isSalesman() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role: any) => role === 2) !== undefined
            : false;
    }
}
