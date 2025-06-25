import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { Router } from '@angular/router';
import { environment } from '@optimroute/env/environment';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import * as moment from 'moment';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { take } from 'rxjs/operators';
import { FilterState, Profile } from '@optimroute/backend';
import { AsignProductsFranchiseComponent } from '../asign-products-franchise/asign-products-franchise.component';
import { ModalFiltersComponent } from '../products-list/modal-filters/modal-filters.component';
import { ProductsModalActiveComponent } from '../products-list/products-modal-active/products-modal-active.component';
import { StateFilterStateFacade } from '@easyroute/filter-state';
declare var $: any;

@Component({
    selector: 'easyroute-promotions-list',
    templateUrl: './promotions-list.component.html',
    styleUrls: ['./promotions-list.component.scss'],
})
export class PromotionsListComponent implements OnInit {
    table: any;

    me: boolean;

    modalOptions: NgbModalOptions;

    profile: Profile;

    companyParentId: number;

    change: string = 'promotions';

    filter: FilterState = {
        name: 'promotions',
        values: {
            statePromotionId: '',
        }
    };

    status: any = [];

    loading: string = 'success';

    showInfoDetail: boolean = true;

    informativePromotion: any;

    constructor(
        private authLocal: AuthLocalService,
        private _translate: TranslateService,
        private _toastService: ToastService,
        private stateEasyrouteService: StateEasyrouteService,
        private _modalService: NgbModal,
        private facadeProfile: ProfileSettingsFacade,
        private Router: Router,
        private stateFilters: StateFilterStateFacade,
        private detectChange: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
            if (loaded) {
                this.facadeProfile.profile$.pipe(take(1)).subscribe(async (data)=>{

                    const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();


                    this.filter = filters.find(x => x.name === 'promotions') ? filters.find(x => x.name === 'promotions') : this.filter;

                    this.profile = data;
                    this.companyParentId = this.profile.company.companyParentId;
                    this.detectChange.detectChanges();
                    this.cargar();
                    this.getStatus();
                    this.getResument();
                })
            }
        });
    }

    ngOnDestroy() {
        this.table.destroy();
    }

    returnProfileString(profiles: any): string {
        let profile = [];
        profiles.forEach((element) => {
            profile.push(element.name);
        });
        return profile
            .map((element) => {
                return element;
            })
            .join(', ');
    }

    openModalFranchise(){

        let title = this._translate.instant('FRANCHISE.TO_WHAT_FRANCHISE');
        let subTitle= this._translate.instant('PRODUCTS.SELECT_THE_FRANCHISES_SEND_PROMOTIONS');
        let message= this._translate.instant('PROMOTIONS.PROMOTIONS_SENDED');


        const modal = this._modalService.open( AsignProductsFranchiseComponent, {
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            centered: true,
        });

        modal.componentInstance.title = title;
        modal.componentInstance.subTitle = subTitle;
        modal.componentInstance.message = message;

    }

    franchisesActive(){
        if(this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company &&
            this.profile.company.active_modules && this.profile.company.active_modules.find(x => x.id === 2)){
                return true;
            }else {
                return false;
            }
    }

    cargar() {

        let columns = [
            {
                data: 'name',
                className:'class-test',
                title: this._translate.instant('PRODUCTS_GENERAL.PRODUCTS_LIST.NAME'),
                render: (data, type, row) => {
                    if( data && data.length > 60){
                        return '<span title="'+ data +'">' + data.slice(0,60) + '... </span>' 
                    }else if(data === null) {
                        return '<span>' + 'no disponible' + '</span>' ;
                    } else {
                        return '<span title="'+ data +'">' + data + '</span>' ;
                    }
                }
            },
            {
                data: 'description',
                className:'class-test',
                visible: false,
                title: this._translate.instant(
                    'PRODUCTS_GENERAL.PRODUCTS_LIST.DESCRIPTION',
                ),
                render: (data, type, row) => {
                    if( data && data.length > 60){
                        return '<span title="'+ data +'">' + data.slice(0,60) + '... </span>' 
                    }else if(data === null) {
                        return '<span>' + 'no disponible' + '</span>' ;
                    } else {
                        return '<span title="'+ data +'">' + data + '</span>' ;
                    }
                }
            },
            /* {
                data: 'updatableFromCompanyParent',
                title: this._translate.instant('PRODUCTS.ALLOW_CHANGES_FROM_MAIN'),
                visible: false,
                render: (data, type, row) => {
                    if (data === '1' || data === 1 || data === true) {
                        return (`
                          <div class="row reset justify-content-center">
                            <div class="success-chip">
                              <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                            </div>
                          </div>
                        `);
                    }

                    return (`
                      <div class="row reset justify-content-center">
                        <div class="times-chip">
                          <i class="fas fa-times mt-2"></i>
                        </div>  
                  </div>
                `);
                },
            }, */
            {
                data: 'company_product_image_count',
                title: this._translate.instant('PRODUCTS.IMAGE'),
                searchable: false,
                render: (data, type, row) => {

                    console.log( data );
                    
                    if (data > 0) {
                        return (`
                          <div class="row reset justify-content-center">
                            <div class="success-chip">
                              <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                            </div>
                          </div>
                        `);
                    }

                    return (` 
                      <div class="row reset justify-content-center">
                        <div class="times-chip">
                          <i class="fas fa-times mt-2"></i>
                        </div>  
                      </div>`
                    );
                },
            },
            {
                data: 'startPromotionDate',
                title: this._translate.instant(
                    'PRODUCTS_GENERAL.PRODUCTS_LIST.PROMOTION_START_DATE',
                ),
                visible: true,
                render: (data, type, row) => {
                    if(data)
                    {
                        return moment(data).format('DD/MM/YYYY')
                    }else {
                        return (
                            '<span>'+ this._translate.instant('GENERAL.NOT_AVAILABLE') +'</span>'
                        );
                    }
               
                },
            },
            {
                data: 'endPromotionDate',
                title: this._translate.instant(
                    'PRODUCTS_GENERAL.PRODUCTS_LIST.PROMOTION_END_DATE',
                ),
                visible: true,
                render: (data, type, row) => {
                    if(data)
                    {
                        return moment(data).format('DD/MM/YYYY')
                    }else {
                        return (
                            '<span>'+ this._translate.instant('GENERAL.NOT_AVAILABLE') +'</span>'
                        );
                    }
               
                },
            },
            /* {
                data: 'totalPrice',
                title: this._translate.instant('PRODUCTS.PRICE'),
                render: (data, type, row) => {
                    if(data)
                    {
                        return data + ' €';
                    }else {
                        return (
                            '<span>'+ this._translate.instant('GENERAL.NOT_AVAILABLE') +'</span>'
                        );
                    }
               
                },
            }, */

            
            {
                data: 'statePromotion',
                title: this._translate.instant('PRODUCTS.STATUS'),
                searchable: false,
                orderable: false,
                render: (data, type, row) => {
                  let varClass = '';
      
                  if (data) {
      
                  if (data == 'Caducada') {
                    varClass = 'no-asigned';
                  }
                 
                  if (data === 'Activa') {
                    varClass = 'green';
                  }
                 
                  if (data == 'Programada') {
                    varClass = 'orange';
                  }
                  
      
                  return (
                      '<div class="d-flex justify-content-center backgroundColorRow">' +
                     ' <div class="text-center col-12 p-0 m-0">'+
                          '<button style="font-size: 11px;" class="btn btn-default warning ' +
                              varClass +
                              '">' +
                              data +
                          ' </button> ' +
                          '</div>'+
                      '</div>'
                  );
                  } else {
                    return (`<span style="font-weight: bold;"> no disponible </span>`);
                  }
                  
              },
              },
            {
                data: null,
                sortable: false,
                searchable: false,
                title: this._translate.instant('GENERAL.ACTIONS'),
                render: (data, type, row) => {
                    let botones = '';

                    botones +=
                        `<div class="text-center editar">
                            <img class="icons-datatable point" src="assets/icons/optimmanage/create-outline.svg">
                        </div>`;
                    return botones;
                },
            },
        ]

        if(this.profile.company.companyParentId === null){
            columns = columns.filter(x => x.data !== 'updatableFromCompanyParent');
        }

        let isSalesman = this.isSalesman() && this.me == false;
       // let url = environment.apiUrl + 'company_product_promotion_datatables';
       let url =
            environment.apiUrl +
            'company_product_promotion_datatables?statePromotionId=' +
            this.filter.values.statePromotionId;
        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#promotion';
        this.table = $( table ).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            cache: false,
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            order: [0, 'asc'],
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
            columns: columns
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

        this.editar('#promotion tbody', this.table);
        this.isActive('#promotion tbody', this.table);
    }

    isSalesman() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role: any) => role === 2) !== undefined
            : false;
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
        };

        console.log( data );

        const modal = this._modalService.open(ProductsModalActiveComponent, {
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
        this.stateEasyrouteService.updateActiveCategory(productId, element).subscribe(
            (data: any) => {
                this._toastService.displayWebsiteRelatedToast(
                    this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                    this._translate.instant('GENERAL.ACCEPT'),
                );
            },
            (error) => {
                this._toastService.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
    }

    editar(tbody: any, table: any, that = this) {   

        $(tbody).unbind();

        $(tbody).on('click', 'div.editar', function() {
            let data = table.row($(this).parents('tr')).data();

            that.Router.navigate(['products/promotions', data.id]);
        });
    }

    changePage(name: string){
       
        switch (name) {
            case 'products':
                this.change = name;
                this.Router.navigate(['/products']);
                break;

            case 'rates':
                this.change = name;
                console.log('entro a rates');
                break;

            case 'promotions':
                this.change = name;
                this.Router.navigate(['/products/promotions']);
                break;
        
            default:
                break;
        }
    }

    filterOpen(){
        const modal = this._modalService.open(ModalFiltersComponent, {
            size: 'xl',
            backdrop: 'static',
            windowClass: 'modal-left'
        });

        modal.componentInstance.filter = this.filter;

        modal.result.then(
            (data) => {
                if (data) {
                    console.log(data);
                    this.filter = data;

                    this.cargar();
                }
            },
            (reason) => {},
        );
    }

    getStatus() {

        this.loading = 'loading';

        this.stateEasyrouteService.getStatusPromotion().subscribe(
            (data: any) => {
                
                this.status = data;

                this.loading = 'success';
                
            },
            (error) => {

                this.loading = 'error';
                
                this._toastService.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
    }

    ChangeFilter(event) {


        let value = event.target.value;

        this.filter = {
            ...this.filter,
            values: {
                ...this.filter.values,
                statePromotionId: value
            }
        }

        this.stateFilters.add(this.filter);
        
        this.cargar();

        
        this.getResument();
        
    }

    getResument() {
       
        this.showInfoDetail = false;

        this.stateEasyrouteService
            .getDataPromocionalInformation(this.filter.values.statePromotionId)
            .pipe(take(1))
            .subscribe(
                (data: any) => {
                   
                    this.informativePromotion = data.promotion;
                    
                    this.showInfoDetail = true;
                },
                (error) => {
                    this.showInfoDetail = true;
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
    }
    openPdf(){
        console.log('abrir descargar productos');
    }

    openImportProducts(){
        console.log('abrir importar productos');
    }

    redirectCategory(){
        this.Router.navigate(['category']);
    }

    redirectMeasure(){
        this.Router.navigate(['measure']);
    }
    openSetting(){
        this.Router.navigateByUrl('/preferences?option=promotion');
    }
}
