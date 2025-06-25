import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash';
import {
    FormGroup,
    FormBuilder,
    Validators,
    AbstractControl,
    FormControl,
    FormArray,
} from '@angular/forms';
import { BackendService, ProductsImage, ProductsInterface, ProductsPreferences, ProductsPrices, Profile } from '@optimroute/backend';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductModalImgInfoComponent, ToastService } from '@optimroute/shared'
import { TranslateService } from '@ngx-translate/core';
import {
    NgbModal,
    NgbDateParserFormatter,
    NgbDatepickerI18n,
    NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { ProductsModalMeasureComponent } from './products-modal-measure/products-modal-measure.component';
import { ProductsModalProductPriceConfirmComponent } from './products-modal-product-price-confirm/products-modal-product-price-confirm.component';
import { ProductsModalAddCategoryComponent } from './products-modal-add-category/products-modal-add-category.component';
import { ProductsModalConfirmComponent } from './products-modal-confirm/products-modal-confirm.component';
import { ProductsMessages, LoadingService, sliceMediaString } from '@optimroute/shared';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import {
    Language,
    MomentDateFormatter,
    CustomDatepickerI18n,
    dateToObject,
    getToday,
    objectToString,
} from '../../../../../shared/src/lib/util-functions/date-format';
import { take, map, tap } from 'rxjs/operators';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import * as moment from 'moment';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { Observable } from 'rxjs';
declare var $;
declare function init_plugins();

@Component({
    selector: 'easyroute-products-form',
    templateUrl: './products-form.component.html',
    styleUrls: ['./products-form.component.scss'],
    providers: [
        Language,
        { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    ],
})
export class ProductsFormComponent implements OnInit {
    ProductForm: FormGroup;

    products_messages: any;

    category: any[] | undefined = undefined;

    products: ProductsInterface;

    productsPriceTable: any = [];

    productsPrice: ProductsPrices[] = [];

    productImages: any = [];

    index: any;

    positionId: number;

    data: any;

    disablePrice: boolean = false;

    etiquetaQantity: string = 'quantity';

    etiquetaPrice: string = 'price';

    etiquetaTaxPercent: string = 'taxPercent';

    etiquetaEquivalence: string = 'equivalencePercent';

    // Loadings
    loadingProfiles: string = 'success';

    loadingCompanyList: string = 'success';

    loadingSubcategories: string = 'success';

    loadingFilter: string = 'success';

    loadingCompanyProductUniquelist: string = 'success';

    promotion: boolean = false;

    dateNow: NgbDateStruct = dateToObject(getToday());

    dateStart: any;

    dateEnd: any;

    date: any = new Date();

    subCategories: any[];

    filters: any;
    filterSubcategory: boolean;

    imageError: string = '';

    overFlowImg: boolean = false;
    profile: Profile;
    companyParentId: number;

    updateImage: 'local' | 'server' = 'local';

    // botones calendario (solo lectura)
    promotionReadOnly: boolean = false;

    default = 'product';

    filtersPrice: any = {
        
    }

    discount = [];

    productPreferences$: Observable<ProductsPreferences>;

    companyProductDiscount = [];

    datatablesCategoryId: number = 0;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private stateEasyrouteService: StateEasyrouteService,
        private _toastService: ToastService,
        private _translate: TranslateService,
        private _router: Router,
        private fb: FormBuilder,
        private _modalService: NgbModal,
        private changeDetect: ChangeDetectorRef,
        private facadeProfile: ProfileSettingsFacade,
        private loadingService: LoadingService,
        private backend: BackendService,
        private preferencesFacade: PreferencesFacade
    ) {}

    ngOnInit() {
        // console.log( this.dateNow );

        this.filtersPrice = {
            isActive: true
        };

        setTimeout(() => {
            init_plugins();
        }, 1000);

        this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
            if (loaded) {

                this.facadeProfile.profile$.pipe(take(1)).subscribe((data) => {
                    this.profile = data;
                    this.companyParentId = this.profile.company.companyParentId;
                    this.changeDetect.detectChanges();
                    this.load();
                    this.loadDescount();
                });
            }
        });

        
        this.preferencesFacade.loadProductPreferences();
        this.productPreferences$ = this.preferencesFacade.productPreferences$;
            
        
    }

    loadDescount(){
        this.backend.get('company_discount_type').pipe(take(1)).subscribe(({data})=>{
            this.discount = data;
        })
    }

    load() {
        this._activatedRoute.params.subscribe((params) => {
            console.log(params, 'de ruta editar productos')
            this.datatablesCategoryId =params['id'];
            if (params['products_id'] !== 'new') {
                this.stateEasyrouteService
                    .getProductAndCategory(params['products_id'], params['id'])
                    .pipe(
                        take(1),
                        map(({ data }) => {
                            return {
                                ...data,
                                images: data.images.map((image) => ({
                                    id: image.id,
                                    image: image.urlimage,
                                    companyProductId: image.companyProductId,
                                    main: image.main
                                })),
                                productPrices: data.productPrices.map((price) => ({
                                    ...price,
                                    equivalencePercent:
                                        price.equivalencePercent === null
                                            ? 0
                                            : price.equivalencePercent,
                                })),
                            };
                        }),
                    )
                    .subscribe(
                        (resp: any) => {
                            this.products = resp;
                            console.log(this.products, 'this.products')
                            this.loadProductPrices(resp.id);
                            // precios de productos
                            this.productsPrice = resp.productPrices;
                            this.productImages = resp.images;
                            this.products.subCategory = resp.subCategory;
                            this.products.filters = resp.filters;
                            this.companyProductDiscount = resp.companyProductDiscount;
                            this.updateImage = 'server';

                            this.validaciones(this.products);

                            this.getCategory();

                            this.changeDetect.detectChanges();
                        },
                        (error) => {
                            this._toastService.displayHTTPErrorToast(
                                error.status,
                                error.error.error,
                            );
                        },
                    );
            } else {
                this.products = new ProductsInterface();
                this.updateImage = 'local';

                this.validaciones(this.products);

                this.getCategory();
            }
        });
    }


    loadProductPrices(id: number){
        this.backend.post('company_product/' + id + '/product_prices_filtered', this.filtersPrice ).pipe(take(1))
        .subscribe((data)=>{
            this.productsPrice = data;
            this.changeDetect.detectChanges();
        }, error =>{
            this._toastService.displayHTTPErrorToast(error.status, error.error.error);
        })
    }

    activeProductPrice(productPrice: any) {
        if (this.products.id > 0) {
            const modal = this._modalService.open(ProductsModalConfirmComponent, {
                // size:'sm',
                centered: true,
                backdrop: 'static',
            });
            if (productPrice.isActive) {
                modal.componentInstance.title = this._translate.instant(
                    'GENERAL.CONFIRM_REQUEST',
                );
                modal.componentInstance.message = this._translate.instant(
                    'GENERAL.INACTIVE?',
                );
            } else {
                modal.componentInstance.title = this._translate.instant(
                    'GENERAL.CONFIRM_REQUEST',
                );
                modal.componentInstance.message = this._translate.instant(
                    'GENERAL.ACTIVE?',
                );
            }

            modal.result.then((result) => {
                if (result) {
                    if (productPrice.isActive) {
                        this.serviceUpdatePrice(productPrice.id, false, 'isActive');
                    } else {
                        this.serviceUpdatePrice(productPrice.id, true, 'isActive');
                    }
                } else {
                    $('#isActiveProprice' + productPrice.id).prop(
                        'checked',
                        productPrice.isActive,
                    );
                }
            });
        }
    }
    activeProductMain(main: boolean, productPrice: any) {
        if (this.products.id > 0) {

            
            let value : any = this.productsPrice.find((x :any) => x.main == main);
           
            if (value) {
                const modal = this._modalService.open(ProductsModalConfirmComponent, {
                    // size:'sm',
                    centered: true,
                    backdrop: 'static',
                });
                modal.componentInstance.title = this._translate.instant(
                    'GENERAL.CONFIRM_REQUEST',
                );
                modal.componentInstance.message = this._translate.instant(
                    'GENERAL.ARE_YOU_SURE_TO_ACTIVATE_AS_MAIN_IN_APP?',
                );
                modal.result.then((result) => {
                    if (result) {
                        
                    this.serviceUpdateMain(productPrice.id, true, 'main');
                    
                    } else {
                        $('#mainProprice' + productPrice.id).prop(
                            'checked',
                            productPrice.main,
                        );
                    }
                });
            }
   
        } 
    }
    activeMain(proprice: any, index:number){
        console.log(proprice, 'propaice')
        console.log(index, 'index')
   
            const datos = this.productsPrice.find((x: any) => x.main == true);
            // cuando almenos uno tiene un main true lo cambia a false
            if (datos) {

                console.log( 'if de datos change')
                  this.productsPrice = this.productsPrice.map(( item: ProductsPrices ) => {
            
                    if (  item.main === true ) {
                      item.main = false;
                    }
                    $('#mainProprice' + item.id).prop(
                        'checked',
                        item.main,
                    );
                    
                    return item;
                  });
                

                this.changeDetect.detectChanges();
                
            };
            proprice.main = true;
            this.changePrice( proprice.main, proprice, 'main' )

              $('#mainProprice' + proprice.id).prop(
                'checked',
                proprice.main,
            );

                this.productsPrice = this.productsPrice;
    
                this.changeDetect.detectChanges();
    

        
    }

    serviceUpdateMain(productoPrice: number, data: any, name: string) {
        switch (name) {
            case 'main':
                this.data ={
                    main: data, 
                }
            default:
                break;
        }

        if (this.products.id > 0) {
            this.disablePrice = true;
            this.stateEasyrouteService.updateProductMain(productoPrice, this.data).subscribe(
                (data: any) => {
                
                    this.disablePrice = false;
                    this.load();
                },
                (error) => {
                    this.disablePrice = false;
                    this._toastService.displayHTTPErrorToast(error.status, error.error.error);
                },
            );   
        } else {

        }
       
    }

    validaciones(products: ProductsInterface) {
        if (products.startPromotionDate) {
            this.dateStart = dateToObject(products.startPromotionDate);
        }

        if (products.endPromotionDate) {
            this.dateEnd = dateToObject(products.endPromotionDate);
        }

        // console.log( this.dateEnd );

        this.ProductForm = this.fb.group({
            code: [products.code, [Validators.maxLength(50)]],
            name: [
                products.name,
                [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
            ],
            description: [products.description],
            categoryId: [products.category.id ? products.category.id : ''],
            taxPercent: [products.taxPercent || 0],
            isActive: [products.isActive, [Validators.required]],
            promotion: [products.promotion],
            startPromotionDate: [this.dateStart],
            endPromotionDate: [this.dateEnd],
            productPrices: [''],
            highlight: [products.highlight],
            valoration: [products.valoration],
            showInApp: [products.showInApp || false],
            updatableFromCompanyParent: [products.updatableFromCompanyParent],
            subCategoryId: [
                Object.keys(products.subCategory).length > 0 ? products.subCategory.id : '',
            ],
            filters: this.fb.array([]),
            origin: [products.origin],
            estimatedWeightPerUnit: [
                products.estimatedWeightPerUnit, 
                [
                    Validators.pattern('^[0-9]{1,3}(.[0-9]{1,3})?$'),
                ]
            ],
            freeField: [ products.freeField, [ Validators.maxLength(255) ] ],
            allowDiscount: [products.allowDiscount]
        });

        let products_messages = new ProductsMessages();
        this.products_messages = products_messages.getProductsMessages();

        console.log( this.products_messages );
        
        this.changeHighlight(products.highlight);
        this.changePromotion(products.promotion);
    }

    readonlyPromotion(promotion: boolean) {
        if (promotion) {
            this.ProductForm.get('promotion').disable();
            this.promotionReadOnly = true;
        }
    }

    changePromotion(check) {
        // cada vez que haya un cambio en el campo promoción
        // se ajusta la validacion de la fechas

        if (check) {
            this.ProductForm.controls['startPromotionDate'].setValidators([
                Validators.required,
            ]);
            this.ProductForm.controls['endPromotionDate'].setValidators([
                Validators.required,
                this.startPromotionDateConfirmar.bind(this),
            ]);

            this.ProductForm.controls['startPromotionDate'].setValidators([
                Validators.required,
                this.endPromotionDateConfirmar.bind(this),
            ]);

            this.ProductForm.get('startPromotionDate').updateValueAndValidity();
            this.ProductForm.get('endPromotionDate').updateValueAndValidity();
        } else {
            this.ProductForm.controls['startPromotionDate'].setValidators([]);
            this.ProductForm.controls['endPromotionDate'].setValidators([]);
            this.ProductForm.get('startPromotionDate').setValue(null);
            this.ProductForm.get('endPromotionDate').setValue(null);
            this.ProductForm.get('startPromotionDate').updateValueAndValidity();
            this.ProductForm.get('endPromotionDate').updateValueAndValidity();
        }

        this.changeDetect.detectChanges();
    }

    changeHighlight(value: any) {
        if (value) {
            this.ProductForm.controls['valoration'].setValidators([
                Validators.required,
                Validators.min(0.1),
                Validators.max(99999),
            ]);
        } else {
            this.ProductForm.controls['valoration'].setValidators([]);
            this.ProductForm.get('valoration').setValue(0);
        }

        this.ProductForm.get('valoration').updateValueAndValidity();
        this.changeDetect.detectChanges();
    }

    startPromotionDateConfirmar(group: AbstractControl) {
        let startPromotionDate = objectToString(group.root.value.startPromotionDate);
        let endPromotionDate = objectToString(group.value);

        console.log('startPromotionDate', moment([startPromotionDate]));
        console.log('endPromotionDate', moment([endPromotionDate]));
        console.log(
            moment(startPromotionDate).diff(moment(endPromotionDate), 'days', true),
        );

        if (moment(startPromotionDate).diff(moment(endPromotionDate), 'days', true) > 0) {
            return {
                confirmar: true,
            };
        }

        return null;
    }

    endPromotionDateConfirmar(group: AbstractControl) {
        let endPromotionDate = objectToString(group.root.value.endPromotionDate);
        let startPromotionDate = objectToString(group.value);
        if (moment(startPromotionDate).diff(moment(endPromotionDate), 'days', true) > 0) {
            return {
                confirmar: true,
            };
        }

        return null;
    }

    getCategory() {
        this.loadingCompanyList = 'loading';
        this.loadingService.showLoading();

        setTimeout(() => {
            this.stateEasyrouteService.getCategorys().subscribe(
                (data: any) => {
                    // obtiene las categorías
                    this.loadingService.hideLoading();

                    this.loadingCompanyList = 'success';
                    this.category = data.data;

                    // subcategorias
                    if (this.products.category.id > 0) {
                        let found = data.data.find(
                            (category) => this.products.category.id === category.id,
                        );

                        if (found) {
                            this.getSubcategory(found.id.toString());
                        }
                    }
                },
                (error) => {
                    this.loadingService.hideLoading();
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
        }, 500);
    }

    getSubcategory(categoryId: string = '', changeEvent = false) {
        this.filterSubcategory = true;
        this.filters = [];

        if (categoryId == '') {
            this.subCategories = [];
            return this.changeDetect.detectChanges();
        }

        this.loadingSubcategories = 'loading';

        this.stateEasyrouteService
            .getSubcategory(parseInt(categoryId))
            .pipe(
                map(({ data }) => {
                    if (data.length === 0) {
                        return data;
                    }

                    return data.map((subCategory) => ({
                        id: subCategory.id,
                        categoryId: subCategory.categoryId,
                        isActive: subCategory.isActive,
                        name: subCategory.name,
                    }));
                }),
            )
            .subscribe(
                (resp) => {
                    // vacia el campo si viene el array vacio o si el evento change se activa
                    if (resp.length === 0 || changeEvent) {
                        this.ProductForm.get('subCategoryId').setValue('');
                    }

                    this.subCategories = resp;

                    if (this.products.id > 0 && !changeEvent) {
                        let foundFilter = resp.find(
                            (subCategory) =>
                                this.products.subCategory.id === subCategory.id,
                        );

                        // console.log( foundFilter );

                        if (foundFilter) {
                            this.getFilter(foundFilter.id.toString());
                        }
                    }

                    this.loadingSubcategories = 'success';
                    this.ProductForm.get('subCategoryId').updateValueAndValidity();
                    this.changeDetect.detectChanges();
                },
                (error) => {
                    this.loadingSubcategories = 'error';
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
    }

    getFilter(subcategoryId: string = '', changeEvent = false) {
        if (subcategoryId.length == 0) {
            this.filters = [];
            return this.changeDetect.detectChanges();
        }

        this.loadingFilter = 'loading';

        this.stateEasyrouteService
            .getFilterSubcategory(
                this.ProductForm.get('categoryId').value,
                parseInt(subcategoryId),
            )
            .subscribe(
                (data: any) => {
                    /* cuando se seleciona otro borrar los datos */
                    if (data.data.length === 0) {
                        this.filters = [];

                        this.products.filters = [];

                        // con esto se borrar el arry del formulario
                        (this.ProductForm.controls.filters as FormArray).clear();

                        this.filterSubcategory = false;

                        this.changeDetect.detectChanges();

                        return data;
                    } else {
                        // obtiene las categorías
                        (this.ProductForm.controls.filters as FormArray).clear();

                        this.filters = data.data;

                        this.addFilter();
                    }
                },
                (error) => {
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
    }

    /* funcion de agregar filtros */
    addFilter() {
        this.filters.map((o, i) => {
            let control: FormControl;
            if (this.products.filters.length > 0) {
                control = new FormControl(
                    this.products.filters.find((x) => x.id === o.id) != undefined,
                );
            } else {
                control = new FormControl(false);
            }
            (this.ProductForm.controls.filters as FormArray).push(control);
        });
    }

    createProduct(): void {
        this.ProductForm.value.startPromotionDate = objectToString(
            this.ProductForm.value.startPromotionDate,
        );
        this.ProductForm.value.endPromotionDate = objectToString(
            this.ProductForm.value.endPromotionDate,
        );

        let dataform = _.cloneDeep(this.ProductForm.value);

        dataform = {
            ...dataform,
            companyProductDiscount: this.companyProductDiscount
        }

        if (dataform.subCategoryId.length == 0) {
            dataform.subCategoryId = null;
        }

        if (dataform.estimatedWeightPerUnit == null) {
            dataform.estimatedWeightPerUnit = 0;
        }

        if (this.products.id && this.products.id > 0) {
            let filter = this.getFilterVAlue();

            dataform.filters = filter;

            this.stateEasyrouteService.editProducty(this.products.id, dataform).subscribe(
                (data: any) => {
                    this._toastService.displayWebsiteRelatedToast(
                        this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                        this._translate.instant('GENERAL.ACCEPT'),
                    );

                    this._router.navigate(['products']);
                },
                (error) => {
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
        } else {
            let filter = this.getFilterVAlue();

            let producPrice: any = [];

            this.productsPrice.forEach((element) => {
                producPrice.push({
                    measureId: element.measure.id,
                    price: element.price,
                    taxPercent: element.taxPercent,
                    quantity: element.quantity,
                    equivalencePercent: element.equivalencePercent,
                    main:element.main
                });
            });

            dataform.productPrices = producPrice;
            dataform.images = [];
            dataform.filters = filter;

            this.products.images.forEach((dataImage64) => {
                dataform.images.push(dataImage64);
            });

            dataform.allowDiscount = dataform.allowDiscount ?dataform.allowDiscount : false;

            this.stateEasyrouteService.addProduct(dataform).subscribe(
                (data: any) => {
                    this._toastService.displayWebsiteRelatedToast(
                        this._translate.instant('GENERAL.REGISTRATION'),
                        this._translate.instant('GENERAL.ACCEPT'),
                    );

                    this._router.navigate(['products']);
                },
                (error) => {
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
        }
    }

    getFilterVAlue() {
        let selectedFilterIds: any;

        if (this.filters && this.filters.length > 0) {
            selectedFilterIds = this.ProductForm.value.filters
                .map((v, i) =>
                    v
                        ? {
                              id: this.filters[i].id,
                              name: this.filters[i].name,
                          }
                        : null,
                )
                .filter((v) => v !== null);
        }

        return selectedFilterIds;
    }

    changeActive() {
        if (this.products.isActive == true) {
            this.products.isActive = false;

            this.ProductForm.controls['isActive'].setValue(this.products.isActive);
        } else if (this.products.isActive == false) {
            this.products.isActive = true;

            this.ProductForm.controls['isActive'].setValue(this.products.isActive);
        }
    }

    loadImage64(e: any) {
        this.imageError = '';

        const allowedTypes = ['image/jpeg', 'image/png'];
        const maxSize = 2000000;
        const reader = new FileReader();

        let file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

        if (file.size > maxSize) {
            this.imageError = 'Tamaño máximo permitido ' + maxSize / 1000 / 1000 + 'Mb';
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            this.imageError = 'Formatos permitidos ( JPG | PNG )';
            return;
        }

        reader.onload = this.validateSizeImg.bind(this);
        reader.readAsDataURL(file);
    }

    validateSizeImg($event: any) {
        const reader = $event.target.result;

        // validacion de dimensiones retirar la linea completa return superior y
        // el comentario si desea validar las mismas

        const image = new Image();

        image.src = reader;

        return this._handleReaderLoaded(reader);
    }

    _handleReaderLoaded(reader: string) {
        
        if (this.products.id > 0) {
            let data = {
                companyProductId: this.products.id,
                image: reader,
                overFlow: this.overFlowImg,
            };

            this.stateEasyrouteService.createProductImage(data).subscribe(
                (data: any) => {
                    this._toastService.displayWebsiteRelatedToast(
                        this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                    );
                    this.ngOnInit();
                },
                (error) => {
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
        } else {
            let productImage = {
                id: Date.now(),
                image: reader,
                isActive: true,
                overFlow: this.overFlowImg,
                main: false
            };

            this.productImages.push(productImage);

            this.products.images = this.productImages;

            console.log(this.productImages);

            this.changeDetect.detectChanges();
        }
    }

    selectMainImage(event: any){

        // cuando es editar 
        if (this.products.id > 0) {

            let value : any = this.products.images.find((x :any) => x.id === event.index);


            let sendMaind = {
                main: event.main
            }

            this.stateEasyrouteService.updateProductImageMain(sendMaind, value.id).subscribe(
                (data: any) => {
                    this._toastService.displayWebsiteRelatedToast(
                        this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                    );
                    //this.ngOnInit();
                    this.productImages = this.productImages.map(( item: ProductsImage ) => {
            
                        if (  item.id === data.id ) {
        
                          item.main = data.main;
                        }
                        
                        return item;
                      });
                      this.products.images = this.productImages;
    
                      this.changeDetect.detectChanges();
          
                },
                (error) => {
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
            
        } else {

            const datos = this.productImages.find((x: any) => x.main == true);


            // cuando almenos uno tiene un main true lo cambia a false
            if (datos) {

                  this.productImages = this.productImages.map(( item: ProductsImage ) => {
            
                    if (  item.main === true ) {
                      item.main = false;
                    }
                    
                    return item;
                  });
                

                this.changeDetect.detectChanges();
                
            };
    
            // cambia el valor seleccionado el main a true
            this.productImages = this.productImages.map(( item: ProductsImage ) => {
            
                if (  item.id === event.index ) {

                  item.main = event.main;
                }
                
                return item;
              });

                this.products.images = this.productImages;
    
                this.changeDetect.detectChanges();
    

        }
       
    }

    deleteProductImage(productImageId: number, nameImage: string) {
        if (this.products.id > 0) {
            const modal = this._modalService.open(ProductsModalConfirmComponent, {
                // size:'sm',
                centered: true,
                backdrop: 'static',
            });
            modal.componentInstance.title = this._translate.instant(
                'GENERAL.CONFIRM_REQUEST',
            );
            modal.componentInstance.message = this._translate.instant(
                'GENERAL.DELETE_IMAGE',
            );
            modal.result.then(
                (result) => {
                    if (result) {
                        this.stateEasyrouteService
                            .destroyProductImage(productImageId)
                            .subscribe(
                                (data: any) => {
                                    this.ngOnInit();
                                },
                                (error) => {
                                    this._toastService.displayHTTPErrorToast(
                                        error.status,
                                        error.error.error,
                                    );
                                },
                            );
                    }
                },
                (reason) => {
                    this._toastService.displayHTTPErrorToast(
                        reason.status,
                        reason.error.error,
                    );
                },
            );
        } else {
            this.productImages = this.productImages.filter(
                (x: any) => x.id !== productImageId,
            );

            this.products.images = this.productImages;

            console.log(this.productImages);
        }
    }

    validNumber(value) {
        return value.charCode >= 48 && value.charCode <= 57;
    }

    searchMeasure() {
        const modal = this._modalService.open(ProductsModalMeasureComponent, {
            size: 'xl',
            centered: true,
            backdrop: 'static',
        });

        modal.result.then(
            (data) => {
                if (data) {
                    let Measure = {
                        id: data.id,
                        name: data.name,
                        measure: {
                            id: data.id,
                            name: data.name,
                            activateEquivalentAmount: data.activateEquivalentAmount,
                            equivalentAmount: data.equivalentAmount

                        },
                        price: 1,
                        quantity: 1,
                        taxPercent: this.ProductForm.value.taxPercent,
                        equivalencePercent: 0,
                        main:null
                        
                    };

                    const datos = this.productsPrice.find((x) => x.measure.id == data.id);

                    const sendMain = this.productsPrice.find((x: any) => x.main == true);

                    if (sendMain) {
                
                        this.productsPrice = this.productsPrice.map(( item: ProductsPrices ) => {
              
                          if (  item.main === true ) {
                            item.main = true;

                            Measure.main = false;

                          }
                          
                          return item;
                        });
                      
      
                      this.changeDetect.detectChanges();
                      
                  } else {

                      Measure.main = true;
          
                  };

                    if (!datos) {
                        if (this.products.id > 0) {
                            let dato = {
                                companyProductId: this.products.id,
                                measureId: Measure.measure.id,
                                price: Measure.price,
                                quantity: 1,
                                taxPercent: Measure.taxPercent,
                                equivalencePercent: 0,
                                main: Measure.main
                            };

                            this.stateEasyrouteService.registerProductPrice(dato).subscribe(
                                (data: any) => {
                                  
                                    this.refreshFormato();
                                },
                                (error) => {
                                    this._toastService.displayHTTPErrorToast(
                                        error.status,
                                        error.error.error,
                                    );
                                },
                            );
                        } else {

                            this.productsPriceTable.push(Measure);

                            this.productsPrice = this.productsPriceTable;
                    
                            this.changeDetect.detectChanges();
                        }
                    }
                }
            },
            (reason) => {
                this._toastService.displayWebsiteRelatedToast(
                    this._translate.instant('GENERAL.YOU_HAVE_NOT_MADE_SELECTION'),
                );
            },
        );
    }

    deleteproductPriceTable(productPriceId: number) {
        this.productsPriceTable = this.productsPriceTable.filter(
            (x: any) => x.id !== productPriceId,
        );
        this.productsPrice = this.productsPriceTable;
        this.changeDetect.detectChanges();
    }

    changePrice(event: any, productoPrice: ProductsPrices, name: string) {

        console.log({
            event:event,
            productoPrice:productoPrice,
            name:name
        })
        switch (name) {
            case 'quantity':
                productoPrice.quantity = event;
                break;

            case 'price':
                productoPrice.price = event;
                break;

            case 'taxPercent':
                productoPrice.taxPercent = event;
                break;

            case 'equivalencePercent':
                productoPrice.equivalencePercent = event;
                break;
                case 'main':
                    productoPrice.main = event;
                    break;

            default:
                break;
        }
        console.log(this.productsPrice, 'productsPrice')
    }

    deleteProdutPrice(productPriceId: number) {
        if (this.products.id > 0) {
            const modal = this._modalService.open(ProductsModalConfirmComponent, {
                backdrop: 'static',
                // size:'sm',
                backdropClass: 'customBackdrop',
                centered: true,
            });

            modal.componentInstance.title = this._translate.instant(
                'GENERAL.CONFIRM_REQUEST',
            );
            modal.componentInstance.message = this._translate.instant(
                'GENERAL.DELETE_PRODUCT',
            );

            modal.result.then(
                (data) => {
                    if (data) {
                        this.stateEasyrouteService
                            .destroyProductPrice(productPriceId)
                            .subscribe(
                                (data: any) => {
                                    //this.load();
                                    this.refreshFormato();
                                },
                                (error) => {
                                    this._toastService.displayHTTPErrorToast(
                                        error.status,
                                        error.error.error,
                                    );
                                },
                            );
                    }
                },
                (error) => {
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
        }
    }

    updatePrice(event: any, productoPrice: ProductsPrices, name: string) {
        switch (name) {
            case 'quantity':
                productoPrice.quantity = Number(event); // aqui estaba reventando porque me pide un entero
                this.serviceUpdatePrice(productoPrice.id, productoPrice.quantity, name);
                break;

            case 'price':
                productoPrice.price = event;
                this.serviceUpdatePrice(productoPrice.id, productoPrice.price, name);
                break;

            case 'taxPercent':
                productoPrice.taxPercent = event;
                this.serviceUpdatePrice(productoPrice.id, productoPrice.taxPercent, name);
                break;

            case 'equivalencePercent':
                productoPrice.equivalencePercent = event;
                this.serviceUpdatePrice(
                    productoPrice.id,
                    productoPrice.equivalencePercent,
                    name,
                );
                break;
            default:
                break;
        }
    }


    changePage(page: string) {
        this.default = page;
    }

    serviceUpdatePrice(productoPrice: number, data: any, name: string) {
        switch (name) {
            case 'taxPercent':
                this.data = {
                    taxPercent: data,
                };
                break;
            case 'quantity':
                this.data = {
                    quantity: data,
                };
                break;
            case 'price':
                this.data = {
                    price: data,
                };
                break;
            case 'equivalencePercent':
                this.data = { equivalencePercent: data };
                break;
            case 'isActive':
                this.data = {
                    isActive: data,
                };

            default:
                break;
        }
        this.disablePrice = true;
        this.stateEasyrouteService.updateProductPrice(productoPrice, this.data).subscribe(
            (data: any) => {
                this.disablePrice = false;
                this.load();
            },
            (error) => {
                this.disablePrice = false;
                this._toastService.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
    }

    addNewCategory() {
        const modal = this._modalService.open(ProductsModalAddCategoryComponent, {
            // size:'sm',
            centered: true,
            backdrop: 'static',
        });

        modal.result.then(
            (data) => {
                if (data) {
                    let dataResult = {
                        isActive: true,
                        name: data.name,
                    };
                    this.stateEasyrouteService.registerByCompany(dataResult).subscribe(
                        (data: any) => {
                            this._toastService.displayWebsiteRelatedToast(
                                this._translate.instant('GENERAL.REGISTRATION'),
                            );

                            this.getCategory();
                        },
                        (error) => {
                            this._toastService.displayHTTPErrorToast(
                                error.status,
                                error.error.error,
                            );
                        },
                    );
                }
            },
            (reason) => {
                this._toastService.displayWebsiteRelatedToast(
                    this._translate.instant('GENERAL.YOU_HAVE_NOT_MADE_SELECTION'),
                );
            },
        );
    }

    refreshFormato() {
        this._activatedRoute.params.subscribe((params) => {
            if (params['products_id'] !== 'new') {
                this.stateEasyrouteService
                    .getProductAndCategory(params['products_id'], params['id'])
                    .pipe(
                        take(1),
                        map(({ data }) => {
                            return {
                                ...data,
                                images: data.images.map((image) => ({
                                    id: image.id,
                                    image: image.urlimage,
                                    companyProductId: image.companyProductId,
                                })),
                                productPrices: data.productPrices.map((price) => ({
                                    ...price,
                                    equivalencePercent:
                                        price.equivalencePercent === null
                                            ? 0
                                            : price.equivalencePercent,
                                })),
                            };
                        }),
                    )
                    .subscribe(
                        (resp: any) => {
                            // precios de productos
                            console.log(resp, 'res')
                            
                            // this.productsPrice = resp.productPrices;
                            this.loadProductPrices(resp.id);

                            this.changeDetect.detectChanges();
                        },
                        (error) => {
                            this._toastService.displayHTTPErrorToast(
                                error.status,
                                error.error.error,
                            );
                        },
                    );
            }
        });
    }

    changeFilter(value){
        console.log(value);

        if(value === 'all'){
            this.filtersPrice = {};
        } else if( value === 'active'){
            this.filtersPrice = {
                isActive: true
            };
        } else {
            this.filtersPrice = {
                isActive: false
            }; 
        }

        this.loadProductPrices(this.products.id);
    }

    updateImageLocal(images: any[]) {
        // se mapean las imagenes para enviar al server
        this.productImages = images.map((image) => ({
            id: image.id,
            image: image.image,
            isActive: true,
        }));

        console.log(this.productImages);

        return (this.products.images = this.productImages);
    }

  dateToObject() {
    return dateToObject();
  }

  sliceString( text: string ) {
    return sliceMediaString( text, 24, '(min-width: 960px)' );
  }

  showModalImgInfo() {
    
    const modal = this._modalService.open( ProductModalImgInfoComponent, {
        centered: true,
        backdrop: 'static',        
    });
  }


  addDiscount(value) {
      console.log(value);
      if(this.companyProductDiscount.find(x => x.companyDiscountTypeId === value)){
          this.companyProductDiscount = this.companyProductDiscount.filter(x => x.companyDiscountTypeId !== value);
      } else {
          this.companyProductDiscount.push({
            companyDiscountTypeId: value
          });
      }

      console.log(this.companyProductDiscount);
  }

  haveDiscount(value){
      return this.companyProductDiscount.find(x => x.companyDiscountTypeId === value) ? true : false;
  }

  previous(previousId: number){
    
    if ( !this.datatablesCategoryId) {

        this._router.navigate(['products',previousId]);

    } else{

        this._router.navigate(['products',previousId, 'categoryId', this.datatablesCategoryId]);
    }
   
  }
  nextId(nextId: number){
      
      if ( !this.datatablesCategoryId) {

        this._router.navigate(['products',nextId]);

      } else{

        this._router.navigate(['products',nextId, 'categoryId',this.datatablesCategoryId]);

      }
    

  }

}
