import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { ToastService } from 'libs/shared/src/lib/services/toast.service';
import { StateEasyrouteService } from 'libs/state-easyroute/src/lib/state-easyroute.service';
import { ModalAddFiltersSettingsComponent } from './modal-add-filters-settings/modal-add-filters-settings.component';
import { environment } from '@optimroute/env/environment';
import { ModalCategoryActivateComponent } from 'libs/shared/src/lib/components/modal-category-activate/modal-category-activate.component';
import { AsignProductsFranchiseComponent } from 'libs/shared/src/lib/components/asign-products-franchise/asign-products-franchise.component';
import { Subject } from 'rxjs';
import { Profile } from 'libs/backend/src/lib/types/profile.type';
import { ProfileSettingsFacade } from 'libs/state-profile-settings/src/lib/+state/profile-settings.facade';
import { take, takeUntil } from 'rxjs/operators';
declare var $: any;
declare function init_plugins();
@Component({
  selector: 'easyroute-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {


  filterTable: any;

  me: boolean;

  unsubscribe$ = new Subject<void>();
  
  profile: Profile;

  constructor(
    private authLocal: AuthLocalService,
    private _translate: TranslateService,
    private _modalService: NgbModal,
    private _toastService: ToastService,
    public facadeProfile: ProfileSettingsFacade,
    private stateEasyrouteService: StateEasyrouteService,
  ) { }

  ngOnInit() {
    setTimeout( init_plugins, 1000);
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

    if (this.filterTable) {
        this.filterTable.clear();
        this.filterTable.state.clear();
    }

    let isSalesman = this.isSalesman() && this.me == false;
    let url = environment.apiUrl + 'filter_datatables';
    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let SubFiltertable = '#filter_table';

    this.filterTable = $(SubFiltertable).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: false,
        cache: false,
        stateSaveParams: function (settings, data) {
            data.search.search = "";
        },
        lengthMenu: [50, 100],
        order: [0, 'asc'],
        dom: `
            <'row'
                <'col-sm-8 col-lg-10 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'>
                <'col-sm-4 col-lg-2 col-12 label-search'>
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
                    this.cargar();
                });
            },
        },
       columns: [
        { data: 'id', title: 'ID', className: 'text-left' },
        {
            data: 'code',
            className: 'text-left',
            title: this._translate.instant('CONFIGURATIONS.CODE'),
            render: (data, type, row) => {
                if (data == null || data == 0) {
                    return '<span class="style-general-table-colummns" aria-hidden="true"> No disponible</span>';
                } else {
                    return (
                        '<span class="style-general-table-colummns" data-toggle="tooltip" data-placement="top" title="' +
                        '">' +
                        data +
                        '</span>'
                    );
                }
            },
        },
        {
            data: 'name',
            className: 'text-left',
            title: this._translate.instant('CONFIGURATIONS.NAME'),
            render: (data, type, row) => {
                let name = data;
                if (name.length > 30) {
                    name = name.substr(0, 29) + '...';
                }
                return (
                    '<span class="style-general-table-colummns" data-toggle="tooltip" data-placement="top" title="' +
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
            className: 'text-left',
            render: (data, type, row) => {
              let name = data;
              if (name.length > 30) {
                  name = name.substr(0, 29) + '...';
              }
              return (
                  '<span class="style-general-table-colummns" data-toggle="tooltip" data-placement="top" title="' +
                  data +
                  '">' +
                  name +
                  '</span>'
              );
          },
        },
        {
          data: 'sub_category.name',
          title: this._translate.instant('GENERAL.SUBCATEGORIES'),
          className: 'text-left',
          render: (data, type, row) => {
            let name = data;
            if (name.length > 30) {
                name = name.substr(0, 29) + '...';
            }
            return (
                '<span class="style-general-table-colummns" data-toggle="tooltip" data-placement="top" title="' +
                data +
                '">' +
                name +
                '</span>'
            );
        },
      },
        {
          data: 'created_by_user',
          className: 'text-left',
          title: this._translate.instant('CONFIGURATIONS.MEASURE.CREATED_BY'),
          render: (data, type, row) => {
              if (data == null || data == 0) {
                  return '<p class="style-general-table-colummns"  aria-hidden="true"> No disponible</p>';
              } else {
                  return (
                      '<span class="style-general-table-colummns" data-toggle="tooltip" data-placement="top" title="' +
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
                'GENERAL.STATE_ORDER',
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
                         
                             '<buttom title="Activar" class="btn btn-primary activeFilter btn-entregado btn-status-datatable">Activado</buttom>'
                        );
                        

                    } else {
                        return (
                         
                            '<buttom title="desactivar"class="btn btn-primary activeFilter btn-pendiente btn-status-datatable">Inactivo</buttom>'
                        );
                      
                    }
                }
            },
        },
        {
            data: null,
            sortable: false,
            searchable: false,
            title: '',
            render: (data, type, row) => {
                return `<span class="filterEditar point"> <img class="icons-datatable point" src="assets/icons/editSettings.svg"></span>`;
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
        $(SubFiltertable)
            .DataTable()
            .search(this.value)
            .draw();
    });
    
    $('.dataTables_filter').removeAttr('class');
    this.filterEditar('#filter_table tbody', this.filterTable);
    this.activeFilter('#filter_table tbody', this.filterTable);
    
}

filterEditar(tbody: any, table: any, that = this) {
  $(tbody).unbind();

  $(tbody).on('click', 'span.filterEditar', function() {
      let data = table.row($(this).parents('tr')).data();
      
      that.openModalEditFilter(data);
  });
}

activeFilter(tbody: any, table: any, that = this) {
  $(tbody).on('click', '.activeFilter', function() {
      let data = table.row($(this).parents('tr')).data();
      that.OnChangeCheckActiveFilter(data.id, !data.isActive, data);
  });
}

OnChangeCheckActiveFilter(subcategoryId: number, element: any, subcategory: any) {
  let SubCategory = {
      isActive: element,
      name: subcategory.name,
      message: (element) ? this._translate.instant('CONFIGURATIONS.CATEGORY.ACTIVATE_FILTERSUBCATEGORIES') : this._translate.instant('CONFIGURATIONS.CATEGORY.DEACTIVATE_FILTERSUBCATEGORIES')
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
              this.editActiveFilter(subcategoryId, SubCategory);
          } else {
              element = !element;
          }
      },
      (reason) => {
          this._toastService.displayHTTPErrorToast(reason.status, reason.error.error);
      },
  );
}

editActiveFilter(subcategoryId: number, element: any) {
  this.stateEasyrouteService.updateFilterSubCategory(subcategoryId, element).subscribe(
      () => {
          this._toastService.displayWebsiteRelatedToast(
              this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
              this._translate.instant('GENERAL.ACCEPT'),
          );
          this.filterTable.ajax.reload();
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


openModalFranchise(){
    
  let title = this._translate.instant('FRANCHISE.TO_WHAT_FRANCHISE');
  let subTitle = this._translate.instant('PRODUCTS.SELECT_THE_FRANCHISES_SEND_FILTERS');
  let message = this._translate.instant('CONFIGURATIONS.CATEGORY.FILTER_SENDED');

  const modal = this._modalService.open( AsignProductsFranchiseComponent, {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      centered: true,
  });

  modal.componentInstance.title = title;
  modal.componentInstance.subTitle = subTitle;
  modal.componentInstance.message = message;

}

openModalCreateFilters(){

    const modal = this._modalService.open( ModalAddFiltersSettingsComponent, {
        backdrop: 'static',
        backdropClass: 'customBackdrop',
        size :'lg',
        centered: true,
    });

    modal.componentInstance.id = 'new';

    modal.componentInstance.title = this._translate.instant('GENERAL.FILTERS');

    modal.result.then(
        (result) => {
          if (result) {
            this.filterTable.ajax.reload();
          
          } else {
           
          }
        },
        (reason) => {
         
        },
      );
 

}

openModalEditFilter(data: any){

    const modal = this._modalService.open( ModalAddFiltersSettingsComponent, {
        backdrop: 'static',
        backdropClass: 'customBackdrop',
        size :'lg',
        centered: true,
    });

    modal.componentInstance.id = data.id;

    modal.componentInstance.title = this._translate.instant('GENERAL.FILTERS');

    modal.result.then(
        (result) => {
          if (result) {
            this.filterTable.ajax.reload();
          
          } else {
           
          }
        },
        (reason) => {
         
        },
      );
 

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

ngOnDestroy() {
    this.unsubscribe$.complete();
    this.unsubscribe$.next();
}


}
