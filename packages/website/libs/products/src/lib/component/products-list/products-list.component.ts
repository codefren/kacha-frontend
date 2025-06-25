import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { Router } from '@angular/router';
import { ProductsModalActiveComponent } from './products-modal-active/products-modal-active.component';
import { environment } from '@optimroute/env/environment';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import * as moment from 'moment';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { take } from 'rxjs/operators';
import { Profile } from '@optimroute/backend';
import { AsignProductsFranchiseComponent } from '../asign-products-franchise/asign-products-franchise.component';
import { ModalFiltersComponent } from './modal-filters/modal-filters.component';
import { StateFilterStateFacade } from '@easyroute/filter-state';
import { FilterState } from '@optimroute/backend'
declare var $: any;

@Component({
    selector: 'easyroute-products-list',
    templateUrl: './products-list.component.html',
    styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
    table: any;

    me: boolean;

    modalOptions: NgbModalOptions;

    profile: Profile;

    companyParentId: number;

    change: string = 'products';

    loading: string = 'success';
    loadingSubcategory: string = 'success';
    
    category: any = [];
    subCategories: any = [];

    filter: FilterState = {
        name: 'products',
        values: {
            categoryId: '',
            subCategoryId: '',
            image: '',
            showActive: true
        }
    };

    constructor(
        private authLocal: AuthLocalService,
        private _translate: TranslateService,
        private _toastService: ToastService,
        private stateEasyrouteService: StateEasyrouteService,
        private _modalService: NgbModal,
        private facadeProfile: ProfileSettingsFacade,
        private Router: Router,
        private detectChange: ChangeDetectorRef,
        private stateFilters: StateFilterStateFacade
    ) {}

    ngOnInit() {

        this.getCategory();

        this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
            if (loaded) {
                this.facadeProfile.profile$.pipe(take(1)).subscribe(async (data)=>{

                    const filters = await this.stateFilters.filters$.pipe(take(1)).toPromise();


                    this.filter = filters.find(x => x.name === 'products') ? filters.find(x => x.name === 'products') : this.filter;


                    this.profile = data;
                    this.companyParentId = this.profile.company.companyParentId;
                    this.detectChange.detectChanges();
                    this.cargar();
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
        let subTitle= this._translate.instant('PRODUCTS.SELECT_THE_FRANCHISES_SEND_PRODUCTS');
        let message= this._translate.instant('PRODUCTS.PRODUCTS_SENDED');

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

        if ( this.table ) {
            this.table.clear(); // limpia la tabla sin destruirla
        }
        
        let columns = [
            {
                data: 'code',
                title: this._translate.instant('PRODUCTS_GENERAL.PRODUCTS_LIST.CODE'),
            },
            {
                data: 'name',
                className:'class-test',
                title: this._translate.instant('PRODUCTS_GENERAL.PRODUCTS_LIST.NAME'),
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
                        console.log('1 if');
                        return '<span title="'+ data +'">' + data.slice(0,60) + '... </span>' 
                    }else if(data === null) {
                        console.log('2 if')
                        return '<span>' + '' + '</span>' ;
                    } else {
                        console.log('else', data);
                        return '<span title="'+ data +'">' +  data + '</span>' ;
                    }
                }
            },
            {
                data: 'category.name',
                title: this._translate.instant(
                    'PRODUCTS_GENERAL.PRODUCTS_LIST.CATEGORY',
                ),
                render: (data, type, row) => {
                    if (data == null || data == 0) {
                        return '<p class="text center" aria-hidden="true"> No disponible</p>';
                    } else {
                        let name = data;

                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            '">' +
                            name +
                            ' ' +
                            '</span>'
                        );
                    }
                },
            },
            {
                data: 'sub_category.name',
                title: this._translate.instant(
                    'PRODUCTS_GENERAL.PRODUCTS_LIST.SUB_CATEGORY',
                ),
                render: (data, type, row) => {
                    if (data == null || data == 0) {
                        return '<p class="text center" aria-hidden="true"> No disponible</p>';
                    } else {
                        let name = data;

                        return (
                            '<span data-toggle="tooltip" data-placement="top" title="' +
                            '">' +
                            name +
                            ' ' +
                            '</span>'
                        );
                    }
                },
            },
            {
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
            },
            {
                data: 'valoration',
                title: this._translate.instant('PRODUCTS.VALORATION'),
                visible: false,
            },
            {
                data: 'startPromotionDate',
                title: this._translate.instant(
                    'PRODUCTS_GENERAL.PRODUCTS_LIST.PROMOTION_START_DATE',
                ),
                visible: false,
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
                visible: false,
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
                data: 'company_product_image_count',
                title: this._translate.instant('PRODUCTS.HAS_IMAGES'),
                searchable: false,
                render: (data, type, row) => {
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
                data: 'promotion',
                title: this._translate.instant('PRODUCTS_GENERAL.PRODUCTS_LIST.PROMOTION_'),
                render: (data, type, row) => {
                    if (data == 1 || data == true) {
                        return (`
                          <div class="justify-content-center row reset">
                            <div class="success-chip-new">
                              <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                            </div>
                          </div>
                        `);
                    } else {
                        return (`
                        <div class="justify-content-center row reset">
                          <div class="times-chip-new">
                            <i class="fas fa-times mt-2"></i>
                          </div>  
                        </div> 
                      `);
                    }
                },
            },
            {
                data: 'showInApp',
                title: this._translate.instant('PRODUCTS.SHOW_APP'),
                render: (data, type, row) => {
                    if (data === '1' || data === 1 || data === true) {
                        return (`
                        <div class="row reset justify-content-center">
                          <div class="success-chip-new">
                            <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                          </div>
                        </div>
                        `);
                    }

                    return (`
                      <div class="row reset justify-content-center">
                        <div class="times-chip-new">
                          <i class="fas fa-times mt-2"></i>
                        </div>  
                      </div>
                    `);
                },
            },
            {
                data: 'highlight',
                title: this._translate.instant('PRODUCTS.HIGH_LIGHT'),
                render: (data, type, row) => {
                    if (data === '1' || data === 1 || data === true) {
                        return (`
                          <div class="row reset justify-content-center">
                            <div class="success-chip-new">
                              <i class="fas fa-check mt-2" title="Activo" aria-hidden="true"></i>
                            </div>
                          </div>
                        `);
                    }

                    return (`
                      <div class="row reset justify-content-center">
                        <div class="times-chip-new">
                          <i class="fas fa-times mt-2"></i>
                        </div>  
                  </div>
                `);
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
                            return `<span class="text-center">${this._translate.instant(
                                'GENERAL.YES',
                            )}</span>`;
                        } else {
                            return `<span class="text-center">${this._translate.instant(
                                'GENERAL.NO',
                            )}</span>`;
                        }
                    } else {
                        if (data) {
                            return (
                                '<div class="text-center">' +
                                    '<button class="btn btn-default isActive warning text-center green' +
                                        '" >' +
                                        this._translate.instant('GENERAL.ACTIVATE') +
                                    '</button> ' +
                                '</div>'
                            );
                        } else {
                            return (
                                '<div class="text-center">' +
                                    '<button class="btn btn-default isActive warning text-center gray' +
                                        '">' +
                                        this._translate.instant('GENERAL.ACTIVATE') +
                                    '</button> ' +
                                '</div>'
                            );
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

        let url =
            environment.apiUrl +
            'company_product_datatables?categoryId=' +
            this.filter.values.categoryId +
            '&subCategoryId=' +
            this.filter.values.subCategoryId +
            '&image=' +
            this.filter.values.image +
            '&showActive=' +
            this.filter.values.showActive;

        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
        let table = '#products';
        this.table = $( table ).DataTable({
            destroy: true,
            serverSide: true,
            processing: true,
            stateSave: true,
            
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            order: [0, 'asc'],
            lengthMenu: [30, 50, 100],
            dom: `
                <'row'
                    <'col-sm-5 col-md-5 col-xl-8 col-12 d-flex flex-column justify-content-start align-items-center align-items-sm-start select-personalize-datatable'l>
                    <'col-sm-4 col-md-5 col-xl-3 col-12 label-search'f>
                    <'col-sm-3 col-md-2 col-xl-1 col-12'
                    <'row p-0 justify-content-md-end justify-content-center'B>
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
            <div class="d-flex justify-content-sm-end justify-content-center mr-xl-2">
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

        this.editar('#products tbody', this.table);
        this.isActive('#products tbody', this.table);
    }

    isSalesman() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role: any) => role === 2) !== undefined
            : false;
    }

    isActive(tbody: any, table: any, that = this) {
        $(tbody).on('click', '.isActive', function() {
            let data = table.row($(this).parents('tr')).data();
            that.OnChangeCheckActive(data.id, !data.isActive, data);
        });
    }

    OnChangeCheckActive(productId: number, element: any, product: any) {

        let data = {
            isActive: element,
            name: product.name,
        };

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
                    element = !element;
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
                this.table.ajax.reload();
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
            console.log(data, 'data editar');
            console.log(that.filter.values.categoryId, 'this.filter.values.subCategoryId')
            if (that.filter.values.categoryId) {
             console.log('if si tiene alguna categoria seleccionada') 
             that.Router.navigate(['products', data.id, 'categoryId', that.filter.values.categoryId]);
            } else {
                console.log('ruta normal')
                that.Router.navigate(['products', data.id]);
            }
        
          
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

    /* filterOpen(){
        const modal = this._modalService.open(ModalFiltersComponent, {
            size: 'xl',
            backdrop: 'static',
            windowClass: 'modal-left'
        });

        modal.componentInstance.filter = this.filter;

        modal.result.then(
            (data) => {
                if (data) {
                    this.filter = data;

                    this.cargar();
                }
            },
            (reason) => {},
        );
    } */

    ChangeFilter(event) {
        let value = event.target.value;
    
        let id = event.target.id;
    
        this.setFilter(value, id, true);
    }
    
    setFilter(value: any, property: string, sendData?: boolean) {
        
        switch (property) {
            case 'categoryId':
                
                this.subCategories = [];
                this.filter = {
                    ...this.filter,
                    values: {
                        ...this.filter.values,
                        subCategoryId: ''
                    }
                }
        
                if ( value > 0 ) {
                  this.getSubcategory(value);
                } 
                break;
        
            default:
                break;
        }

        this.filter = {
            ...this.filter,
            values: {
                ...this.filter.values,
                [property]: value
            }
        } 

        this.stateFilters.add(this.filter);
       
        if (sendData) {
            this.cargar();
    
            this.detectChange.detectChanges();
        }
    }

    getCategory(){

        this.loading = 'loading';
      
        setTimeout( () => {
    
          this.stateEasyrouteService.getCategorys().subscribe(
              (data:any) => {
                this.category = data.data;
                
                if(this.filter.values.categoryId > 0){
                  this.getSubcategory(this.filter.values.categoryId);
                }
    
                this.loading = 'success';
            },(error)=> {
              this.loading = 'error';
      
              this._toastService.displayHTTPErrorToast( 
                error.status, 
                error.error.error 
              );
            }
          );
        }, 500 );
    
    }
     
    getSubcategory(categoryId: string = '', changeEvent = false){
    
        if ( categoryId.length == 0 ) {
          this.subCategories = [];
          return this.detectChange.detectChanges();
        }
        
        this.loadingSubcategory = 'loading';
    
        setTimeout( () => {
          
          this.stateEasyrouteService.getSubcategory(parseInt( categoryId )).subscribe(
            (data:any) => {
    
              this.subCategories = data.data;
      
              this.loadingSubcategory = 'success';
      
            },(error)=> {
              this.loadingSubcategory = 'error';
    
              this._toastService.displayHTTPErrorToast( 
                error.status, 
                error.error.error 
              );
            
              }
          );
    
        }, 1000 );
    
    }

    openPdf(){
        console.log('abrir descargar productos');
    }

    openImportProducts(){
        console.log('abrir importar productos');
    }

    redirectCategory(){
       // this.Router.navigate(['category']);
        this.Router.navigateByUrl('/preferences?option=categories');
    }

    redirectMeasure(){
        //this.Router.navigate(['measure']);
        this.Router.navigateByUrl('/preferences?option=formats');
    }
    openSetting(){
      
        this.Router.navigateByUrl('/preferences?option=productSettings');
    }

}
