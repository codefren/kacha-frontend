import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StateCompaniesFacade } from '@optimroute/state-companies';
import { Subject } from 'rxjs';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { environment } from '@optimroute/env/environment';
import { TranslateService } from '@ngx-translate/core';
import { AssociatedCompany, BackendService } from '@optimroute/backend';
import { ActiveDialogComponent } from './active-dialog/active-dialog-component';
import { DemoDialogComponent } from 'libs/users-management/src/lib/companies/companies-table/demo-dialog/demo-dialog.component';
import { objectToString } from '@optimroute/shared';
import { ManagementAssociatedCompaniesFormComponent } from './management-assiociated-companies-form/maganement-associated-companies-form.component';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { ModalFiltersComponent } from './modal-filters/modal-filters.component';

declare var $: any;

@Component({
  selector: 'easyroute-management-associated-companies-table',
  templateUrl: './management-associated-companies-table.component.html',
  styleUrls: ['./management-associated-companies-table.component.scss']
})
export class ManagementAssociatedCompaniesTableComponent implements OnInit {

  table: any;
  me: boolean = false;
  unsubscribe$ = new Subject<void>();

  filter: any = {
    showAll: true,
    showActive: true,
    option: 3,
  };

  refreshTime: number = environment.refresh_datatable_assigned;

  timeInterval: any;

  constructor(
    private authLocalService: AuthLocalService,
    private _translate: TranslateService,
    private companiesFacade: StateCompaniesFacade,
    private stateEasyrouteService: StateEasyrouteService,
    private _toastService: ToastService,
    private dialog: NgbModal,
    private backendService: BackendService,
    private router: Router
  ) { }

  ngOnInit() {

    // this.companiesFacade.loaded$
    //  .pipe(takeUntil(this.unsubscribe$))
    //  .subscribe((data) => {
    //    if (data) {
            this.cargar();
    //    }
    // });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  isSalesman() {
    return this.authLocalService.getRoles()
        ? this.authLocalService.getRoles().find((role) => role === 3 || role === 8) !==
              undefined
        : false;
  }

  cargar() {

    let tok = 'Bearer ' + this.authLocalService.obtenerTokenLocalStorage();

    let url = environment.apiUrl + 'company_associated_datatables';
    
    if ( !this.filter.showAll ) {
      url += `?showActive=${ this.filter.showActive }`;
    }

    let table = '#associated-companies';
    let isSalesman = this.isSalesman() && this.me == false;

    this.table = $(table).DataTable({
      destroy: true,
      serverSide: true,
      processing: true,
      stateSave: true,
      cache: false,
      lengthMenu: [ 50, 100],
      stateSaveParams: function (settings, data) {
        data.search.search = "";
      },
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
      columns: [
        {
            data: 'code',
            title: this._translate.instant('GENERAL.CODE'),
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
          title: this._translate.instant('GENERAL.COMPANY'),
          render: ( data, type, row ) => {
            
            let name: string = data;

            if ( name.length > 30 ) {
              name = name.substr(0, 29) + '...';
            }

            return (
              `<span data-toggle="tooltip" data-placement="top" title="${ data }">
                ${ name }
              </span>`
            );
          }
        },
        {
          data: 'nif',
          title: this._translate.instant('USERS.NATIONALID'),
          visible: false,
        },
        {
          data: 'streetAddress',
          title: this._translate.instant('GENERAL.STREET_ADDRESS'),
          visible: false,
        },
        { 
          data: 'province', 
          title: this._translate.instant('GENERAL.PROVINCE'), 
          visible: false 
        },
        {
          data: 'zipCode',
          title: this._translate.instant('GENERAL.POSTAL_CODE'),
          visible: false,
        },
        {
          data: 'billingEmail',
          title: this._translate.instant('COMPANIES.BILLING_EMAIL'),
        },
        {
          data: 'create_by_user',
          sortable: false,
          searchable: false,
          title: this._translate.instant('COMPANIES.CREATED_BY'),
          render: ( data, type, row ) => {

            if ( data && data != null ) {

              let name: string = data.name + ' ' + data.surname;

              if ( name.length > 30 ) {
                name = name.substr(0, 29) + '...';
              }

              return (
                `<span data-toggle="tooltip" data-placement="top" title="${ data.name } ${ data.surname }">
                  ${ name }
                </span>`
              );

            } else {
              return ( `<span></span>` );
            }
          }
        },
        {
          data: 'isActive',
          title: this._translate.instant('COMPANIES.IS_ACTIVE'),
          render: ( data, type, row ) => {

            let disabled = isSalesman ? 'disabled=true' : '';

            if ( disabled ) {

              if ( data ) {
                return ( `<span>${ this._translate.instant('GENERAL.YES') }</span>` );
              } else {
                return ( `<span>${ this._translate.instant('GENERAL.NO') }</span>` );
              }

            }  else {

              if ( data ) {
                return (
                  '<div class="text-center">' +
                      '<button class="btn btn-default isActive warning text-center green' +
                          '" >' +
                          this._translate.instant('GENERAL.ACTIVATE') +
                      '</button> ' +
                  '</div>'
              );
                /* return (`
                    <div class="row reset justify-content-center">
                      <div class="round-new">
                        <input type="checkbox" class="isActive" id="row_${ row.id }" checked="true" ${disabled} />
                        <label for="row_${ row.id }"></label>
                      </div>
                    </div>
                  `);
             */
              } else {
                return (
                  '<div class="text-center">' +
                      '<button class="btn btn-default isActive warning text-center gray' +
                          '">' +
                          this._translate.instant('GENERAL.ACTIVATE') +
                      '</button> ' +
                  '</div>'
                );
                /* return (`
                      <div class="row reset justify-content-center">
                        <div class="round-new">
                          <input type="checkbox" class="isActive" id="row_${ row.id }" ${disabled} />
                          <label for="row_${ row.id }"></label>
                        </div>
                      </div>
                  `); */
              }
            }
          }
        },
        {
          data: null,
          sortable: false,
          searchable: false,
          title: this._translate.instant('GENERAL.ACTIONS'),
          render: () => {
            let botones = '';

            botones +=
                `<div class="text-center editar">
                  <img class="icons-datatable point" src="assets/icons/optimmanage/create-outline.svg">
                </div>`;
            return botones;
          }
        }
      ]

    });
    $('.dataTables_filter').html(`
        <div class="row p-0 justify-content-sm-end justify-content-center">
          <div class="input-group datatables-input-group-width mr-xl-2">
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
    } );
    
    $('.dataTables_filter').removeAttr("class");

    this.initEvents(table + ' tbody', this.table);
  
  }

  initEvents(tbody: any, table: any, that = this) {
    $(tbody).unbind();
    window.clearInterval(this.timeInterval);
    this.editar(tbody, table);
    this.isActive(tbody, table);
  }

  editar(tbody: any, table: any, that = this) {
    $(tbody).on('click', 'div.editar', function() {
      let data = table.row($(this).parents('tr')).data();
      that.router.navigate([`/management/associated-companies/${ data.id }`])
    });
  }

  getCompany( id: number ) {
    return this.backendService.get(`company_associated/${ id }`).toPromise();
  }

  isActive(tbody: any, table: any, that = this) {
    $(tbody).on('click', '.isActive', function() {
        let data = table.row($(this).parents('tr')).data();
        that.OnChangeCheckActive(data.id,data, !data.isActive);
    });
  }

  isDemo(tbody: any, table: any, that = this) {
      $(tbody).on('click', '#isDemo', function() {
          let data = table.row($(this).parents('tr')).data();
          that.OnChangeCheckDemo(data.id, this);
      });
  }

  OnChangeCheckActive(companyId: number, company:any, elemento: any): void {
    let data = {
      isActive: elemento,
      name: company.name,
      nif:company.nif  
    };

    const dialogRef = this.dialog.open(ActiveDialogComponent, {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      centered: true,
    });
  
    (dialogRef.componentInstance.data = {
        isActive: elemento,
    });
    
    dialogRef.result.then(([add, object]) => {
          if (add) {
              this.editActiveCompany(
                  companyId,
                  data
              );
          } else {
              elemento = !elemento;
          }
      }); 
  
  }

  OnChangeCheckDemo(companyId: number, elemento: any): void {
    const dialogRef = this.dialog.open(DemoDialogComponent, {
        backdrop: 'static',
        backdropClass: 'customBackdrop',
        centered: true,
    });

    (dialogRef.componentInstance.data = {
        companyId: companyId,
    }),
        dialogRef.result.then(([add, object]) => {
            if (add) {
                this.editDemoCompany([
                    companyId,
                    {
                        startDemoDate: objectToString(object.startDemoDate),
                        endDemoDate: objectToString(object.endDemoDate),
                    },
                ]);
            } else {
                elemento.checked = false;
            }
        });
  }

  editDemoCompany(obj: [number, any]) {
    this.companiesFacade.updateDemoCompany(obj[0], obj[1]);
    this.companiesFacade.allUsers$.subscribe((data) => {
        if (data) {
            this.cargar();
        }
    });
  }

  editActiveCompany(companyId: number, element: any) {
    this.stateEasyrouteService.updateCompanyAssociated(companyId, element).subscribe(
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

  filterOpen(){
    const modal = this.dialog.open(ModalFiltersComponent, {
        size: 'xl',
        backdrop: 'static',
        windowClass: 'modal-left'
    });
    
    modal.componentInstance.filter = this.filter;

    modal.result.then(
        (result) => {
            if (result) {
                
              this.filter = result;
              this.cargar();
            }
        },
        (reason) => {},
    );
  }
}
