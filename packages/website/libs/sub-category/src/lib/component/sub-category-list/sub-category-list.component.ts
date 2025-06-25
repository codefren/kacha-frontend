import { Component, OnInit, OnDestroy } from '@angular/core';
declare var $: any;
import * as _ from 'lodash';
import { AuthLocalService } from '@optimroute/auth-local';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService, LoadingService } from '@optimroute/shared';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { environment } from '@optimroute/env/environment';
import { ModalCategoryActivateComponent } from 'libs/shared/src/lib/components/modal-category-activate/modal-category-activate.component';
import { AsignProductsFranchiseComponent } from 'libs/shared/src/lib/components/asign-products-franchise/asign-products-franchise.component';
import { Subject } from 'rxjs';
import { Profile } from '../../../../../backend/src/lib/types/profile.type';
import { ProfileSettingsFacade } from '../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { take, takeUntil } from 'rxjs/operators';



@Component({
  selector: 'easyroute-sub-category-list',
  templateUrl: './sub-category-list.component.html',
  styleUrls: ['./sub-category-list.component.scss']
})
export class SubCategoryListComponent implements OnInit ,OnDestroy{

  unsubscribe$ = new Subject<void>();
  SubCategoriesTable: any;
  me: boolean;
  change: string = 'subcategory';
  profile: Profile;

  constructor(
    private authLocal: AuthLocalService,
    private _modalService: NgbModal,
    private _toastService: ToastService,
    private stateEasyrouteService: StateEasyrouteService,
    private _translate: TranslateService,
    private _router: Router,
    private loading: LoadingService,
    public facadeProfile: ProfileSettingsFacade) { }

  ngOnInit() {
    this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
        if (loaded) {

            this.facadeProfile.profile$
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((data) => {
                    this.profile = data;
                });
        }
    });
    this.Cargar();
  }
      Cargar() {
        let isSalesman = this.isSalesman() && this.me == false;
        let url = environment.apiUrl + 'sub_category_datatables';
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let Subtable = '#sub_category';
    
        this.SubCategoriesTable = $(Subtable).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            cache: false,
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            lengthMenu: [30, 50, 100],
            dom: `
                <'row'
                    <'col-sm-8 col-lg-10 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
                    <'col-sm-4 col-lg-2 col-12 label-search'f>
                >
                <'row p-0 reset'
                    <'offset-sm-6 offset-lg-6 offset-5'>
                    <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>
                >
                <"top-button-hide"><'table-responsive't>
                <'row reset'
                    <'col-lg-5 col-md-5 col-12 pl-4 pr-4 d-flex flex-column justify-content-center align-items-cente'i>
                    <'col-lg-7 col-md-7 col-12 pl-5 pr-5 d-flex flex-column justify-content-center align-items-lg-start align-items-md-start'p>
                >
            `,
            /* headerCallback: ( thead, data, start, end, display ) => {               
              $('.buttons-collection').html('<i class="far fa-edit"></i>'+ ' ' + this._translate.instant('GENERAL.SHOW/HIDE')) 
            }, */
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
                error: (xhr, error, thrown) => {
                    let html = '<div class="container" style="padding: 30px;">';
                    html +=
                        '<span class="text-orange">Ha ocurrido un errror al procesar la informacion.</span> ';
                    html +=
                        '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
                    html += '</div>';
    
                    $('#companies_processing').html(html);
    
                    $('#refrescar').click(() => {
                        this.Cargar();
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
                                return (
                                    '<div class="text-center">' +
                                        '<button class="btn btn-default activeSubCategory warning text-center green' +
                                            '" >' +
                                            this._translate.instant('GENERAL.ACTIVATE') +
                                        '</button> ' +
                                    '</div>'
                                );
                                /* return (`
                                  <div class="row reset justify-content-center">
                                    <div class="round-new ">
                                      <input type="checkbox" class="activeSubCategory" id="subcategory_${ row.id }" checked="true" ${disabled} />
                                      <label for="subcategory_${ row.id }"></label>
                                    </div>
                                  </div>
                                `); */
    
                            } else {
                                return (
                                    '<div class="text-center">' +
                                        '<button class="btn btn-default activeSubCategory warning text-center gray' +
                                            '">' +
                                            this._translate.instant('GENERAL.ACTIVATE') +
                                        '</button> ' +
                                    '</div>'
                                );
                                /* return (`
                                  <div class="row reset justify-content-center">
                                    <div class="round-new ">
                                      <input type="checkbox" class="activeSubCategory" id="subcategory_${ row.id }" ${disabled} />
                                      <label for="subcategory_${ row.id }"></label>
                                    </div>
                                  </div>
                              `); */
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
                        return `<span class="subCategoryEditar point"> <img class="icons-datatable point" src="assets/icons/optimmanage/create-outline.svg"></i></span>`;
                    },
                },
            ],
            order: [1, 'asc'],
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
            $(Subtable)
                .DataTable()
                .search(this.value)
                .draw();
        });

        $('.dataTables_filter').removeAttr('class');
        this.subCategoryEditar('#sub_category tbody', this.SubCategoriesTable);
        this.activeSubCategory('#sub_category tbody', this.SubCategoriesTable);
    }
    
    subCategoryEditar(tbody: any, table: any, that = this) {
        $(tbody).unbind();
    
        $(tbody).on('click', 'span.subCategoryEditar', function() {
            let data = table.row($(this).parents('tr')).data();
            that._router.navigate(['sub-category', data.id]);
        });
    }

    activeSubCategory(tbody: any, table: any, that = this) {
        $(tbody).on('click', '.activeSubCategory', function() {
            let data = table.row($(this).parents('tr')).data();
            that.OnChangeCheckActiveSubCategory(data.id, !data.isActive, data);
        });
    }
    
    OnChangeCheckActiveSubCategory(subcategoryId: number, element: any, subcategory: any) {
        let SubCategory = {
            isActive: element,
            name: subcategory.name,
            message: (element) ? this._translate.instant('CONFIGURATIONS.CATEGORY.ACTIVATE_SUBCATEGORIES') : this._translate.instant('CONFIGURATIONS.CATEGORY.DEACTIVATE_SUBCATEGORIES')
        };
    
        const modal = this._modalService.open(ModalCategoryActivateComponent, {
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

    isSalesman() {
      return this.authLocal.getRoles()
          ? this.authLocal.getRoles().find((role: any) => role === 2) !== undefined
          : false;
  }

  changePage(name: string){
       
    switch (name) {
        case 'category':
            this.change = name;
            this._router.navigate(['/category']);
            break;

            case 'subcategory':
                this.change = name;
                this._router.navigate(['/sub-category']);
            break;

            case 'categoryFilter':
                this.change = name;
                this._router.navigate(['/category-filter']);
                break;
    
        default:
            break;
    }
}

openModalFranchise(){

    let title = this._translate.instant('FRANCHISE.TO_WHAT_FRANCHISE');
    let subTitle= this._translate.instant('PRODUCTS.SELECT_THE_FRANCHISES_SEND_SUBCATEGORY');
    let message= this._translate.instant('CONFIGURATIONS.CATEGORY.SUBCATEGORY_SENDED');

    const modal = this._modalService.open( AsignProductsFranchiseComponent, {
        backdrop: 'static',
        backdropClass: 'customBackdrop',
        centered: true
    });

    modal.componentInstance.title = title;
    modal.componentInstance.subTitle = subTitle;
    modal.componentInstance.message =  message;
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

redirectMeasure(){
    this._router.navigate(['measure']);
}
openSetting(){
    this._router.navigateByUrl('/preferences?option=products');
}


ngOnDestroy() {
    this.unsubscribe$.complete();
    this.unsubscribe$.next();
}


}
