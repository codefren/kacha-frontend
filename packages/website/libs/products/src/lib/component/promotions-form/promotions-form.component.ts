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
import { BackendService, ProductsInterface, ProductsPrices, Profile } from '@optimroute/backend';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import {
    NgbModal,
    NgbDateParserFormatter,
    NgbDatepickerI18n,
    NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
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
import { ProductsModalConfirmComponent } from '../products-form/products-modal-confirm/products-modal-confirm.component';
import { ProductsMessages, ProductModalImgInfoComponent, ModalPromotionImgInfoComponent } from '@optimroute/shared';
import { ProductsModalAddCategoryComponent } from '../products-form/products-modal-add-category/products-modal-add-category.component';
import { ProductsModalMeasureComponent } from '../products-form/products-modal-measure/products-modal-measure.component';
import * as moment from 'moment';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { ProductsImage } from '../../../../../backend/src/lib/types/product-image.type';
declare var $;
declare function init_plugins();

@Component({
    selector: 'easyroute-promotions-form',
    templateUrl: './promotions-form.component.html',
    styleUrls: ['./promotions-form.component.scss'],
    providers: [
        Language,
        { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    ],
})
export class PromotionsFormComponent implements OnInit {
    cardImageBase64: string;
    companyParentId: number;
    subcategory: any = [];
    data: any;
    date: any = new Date();
    dateEnd: any;
    dateNow: NgbDateStruct = dateToObject(getToday());
    dateStart: any;
    disablePrice: boolean = false;
    etiquetaEquivalence: string = 'equivalencePercent';
    etiquetaQantity: string = 'quantity';
    etiquetaPrice: string = 'price';
    etiquetaTaxPercent: string = 'taxPercent';
    imageError: string = '';
    loadingCompanyList: string = 'success';
    loadingCompanyProductUniquelist: string = 'success';
    loadingFilter: string = 'success';
    loadingProfiles: string = 'success';
    loadingSubcategories: string = 'success';
    overFlowImg: boolean = false;
    positionId: number;
    productsPrice: ProductsPrices[] = [];
    productsPriceTable: any = [];
    profile: Profile;
    promotion_messages: any;
    promotion: any;
    promotionForm: FormGroup;
    promotionImages: any = [];
    timeImage: string;
    category: any[] | undefined = undefined;
    productImages: any = [];
    updateImage: 'local' | 'server' = 'local';
    showCode: boolean = true;
    filtersPrice: any = {
        isActive: true
    }
    
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
        private backend: BackendService
    ) {}

    ngOnInit() {

        this.timeImage = this.timeImageFunc();
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
                });
            }
        });
    }

    timeImageFunc(){
        return '?v1=' +   new Date().getTime();
    }

    load() {
        this._activatedRoute.params.subscribe((params) => {
            if (params['promotions_id'] !== 'new') {
                this.stateEasyrouteService
                    .getProduct(params['promotions_id'])
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
                            this.promotion = resp;
                            this.loadProductPrices(this.promotion.id);
                            // precios de productos
                            this.productsPrice = resp.productPrices;
                            this.promotionImages = resp.images;
                            this.productImages = resp.images;
                            console.log(this.productImages, 'this.productImages')
                            this.updateImage = 'server';

                            this.validaciones(this.promotion);

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
                this.promotion = new ProductsInterface();

                this.validaciones(this.promotion);
                this.getCategory();
            }
        });
    }

    activeProductPrice(productPrice) {
        const modal = this._modalService.open(ProductsModalConfirmComponent, {
            // size:'sm',
            centered: true,
            backdrop: 'static',
        });

        if (productPrice.isActive) {
            modal.componentInstance.title = this._translate.instant(
                'GENERAL.CONFIRM_REQUEST',
            );

            modal.componentInstance.message = this._translate.instant('GENERAL.INACTIVE?');
        } else {
            modal.componentInstance.title = this._translate.instant(
                'GENERAL.CONFIRM_REQUEST',
            );

            modal.componentInstance.message = this._translate.instant('GENERAL.ACTIVE?');
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

    validaciones(products: ProductsInterface) {
        this.dateStart =
            products.startPromotionDate.length > 0
                ? dateToObject(products.startPromotionDate)
                : products.startPromotionDate;

        this.dateEnd =
            products.endPromotionDate.length > 0
                ? (this.dateEnd = dateToObject(products.endPromotionDate))
                : products.endPromotionDate;

        this.promotionForm = this.fb.group({
            code: [products.code, [Validators.maxLength(50)]],
            name: [
                products.name,
                [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
            ],
            description: [products.description],
            taxPercent: [products.taxPercent || 0],
            isActive: [products.isActive, [Validators.required]],
            promotion: [products.promotion],
            startPromotionDate: [this.dateStart, this.endPromotionDateConfirmar.bind(this)],
            endPromotionDate: [this.dateEnd, this.startPromotionDateConfirmar.bind(this)],
            productPrices: [''],
            highlight: [products.highlight],
            valoration: [products.valoration],
            showInApp: [products.showInApp || false],
            updatableFromCompanyParent: [products.updatableFromCompanyParent],
            origin: [products.origin],
            useImageRandom:[ products.useImageRandom],
            estimatedWeightPerUnit: [
                products.estimatedWeightPerUnit, 
                [
                    Validators.pattern('^[0-9]{1,3}(.[0-9]{1,3})?$'),
                ]
            ],
            freeField: [ products.freeField, [Validators.maxLength(255)] ],
            showPromotionCountDown:[products.showPromotionCountDown],
            showPromotionHome:[products.showPromotionHome],
            showPromotionTopCategoryList:[products.showPromotionTopCategoryList],
            showPromotionBetweenProducts:[products.showPromotionBetweenProducts],
            showSpecificCategory:[products.showSpecificCategory],
            showPromotionCategoryId:[products.showPromotionCategoryId ? products.showPromotionCategoryId:''],
            showPromotionSubCategoryId:[products.showPromotionSubCategoryId ? products.showPromotionSubCategoryId:'']

        });

        let promotion_messages = new ProductsMessages();
        this.promotion_messages = promotion_messages.getProductsMessages();

        if(products.showPromotionCategoryId){
            this.loadSubCategory(products.showPromotionCategoryId);
        }
        

        this.changeHighlight(products.highlight);
    }

    changeHighlight(value: any) {
        if (value) {
            this.promotionForm.controls['valoration'].setValidators([
                Validators.required,
                Validators.min(0.1),
                Validators.max(99999),
            ]);
        } else {
            this.promotionForm.controls['valoration'].setValidators(null);
            this.promotionForm
                .get('valoration')
                .setValue(this.promotionForm.get('valoration').value || 0);
        }

        this.promotionForm.get('valoration').updateValueAndValidity();
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

    createProduct(): void {
        
        this.promotionForm.value.startPromotionDate = objectToString(
            this.promotionForm.value.startPromotionDate,
        );
        this.promotionForm.value.endPromotionDate = objectToString(
            this.promotionForm.value.endPromotionDate,
        );
    
        let dataform = _.cloneDeep(this.promotionForm.value);

        if (dataform.estimatedWeightPerUnit == null) {
            dataform.estimatedWeightPerUnit = 0;
        }
        
        if (this.promotion.id && this.promotion.id > 0) {
            console.log(dataform, 'dataform en editar')
            this.stateEasyrouteService.editProducty(this.promotion.id, dataform).subscribe(
                (data: any) => {
                    this._toastService.displayWebsiteRelatedToast(
                        this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                        this._translate.instant('GENERAL.ACCEPT'),
                    );

                    this._router.navigate(['products/promotions']);
                },
                (error) => {
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
        } else {
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

            this.promotion.images.forEach((dataImage64) => {
                dataform.images.push(dataImage64);
            });
            console.log(dataform, 'dataform en crear')

            this.stateEasyrouteService.addProduct(dataform).subscribe(
                (data: any) => {
                    this._toastService.displayWebsiteRelatedToast(
                        this._translate.instant('GENERAL.REGISTRATION'),
                        this._translate.instant('GENERAL.ACCEPT'),
                    );

                    this._router.navigate(['products/promotions']);
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

    changeActive() {
        if (this.promotion.isActive == true) {
            this.promotion.isActive = false;

            this.promotionForm.controls['isActive'].setValue(this.promotion.isActive);
        } else if (this.promotion.isActive == false) {
            this.promotion.isActive = true;

            this.promotionForm.controls['isActive'].setValue(this.promotion.isActive);
        }
    }

    loadImage64(e: any) {
        this.imageError = '';

        const allowedTypes = ['image/jpeg', 'image/png'];
        const reader = new FileReader();
        const maxSize = 1000000;

        let file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

        if (file.size > maxSize) {
            this.imageError = 'Tamaño máximo permitido ' + maxSize / 1000 / 1000 + 'Mb';
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            this.imageError = 'Formatos permitidos ( JPG | PNG )';
            return;
        }

        reader.onload = this._handleReaderLoaded.bind(this);

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
        
        if (this.promotion.id > 0) {
            let data = {
                companyProductId: this.promotion.id,
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

            this.promotion.images = this.productImages;

            console.log(this.productImages);

            this.changeDetect.detectChanges();
        }
    }
   /*  _handleReaderLoaded(e: any) {
        let reader = e.target.result;

        this.cardImageBase64 = reader;

        let data = {
            
            companyProductId: this.promotion.id,
            image: reader,
            urlimage: reader,
        };

        if (this.promotion.id > 0 && this.promotion.id !== null) {

            if( this.promotion && this.promotion.images && this.promotion.images.id > 0){
                this.stateEasyrouteService.updateProductImage(data, this.promotion.images.id).subscribe(
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
                let data = {
                    companyProductId: this.promotion.id,
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
            }
            
        } else {
            //cuando es nuevo con el formulario
            this.promotionImages = [];

            this.promotion.images = [];

            this.promotionImages.push(data);

            this.promotion.images = this.promotionImages;

            this.changeDetect.detectChanges();
        }
    } */

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
                        },
                        price: 1,
                        quantity: 1,
                        taxPercent: this.promotionForm.value.taxPercent,
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
                        if (this.promotion.id > 0) {
                            let dato = {
                                companyProductId: this.promotion.id,
                                measureId: Measure.measure.id,
                                price: Measure.price,
                                quantity: 1,
                                taxPercent: Measure.taxPercent,
                                equivalencePercent: 0,
                                main: Measure.main
                            };

                            this.stateEasyrouteService.registerProductPrice(dato).subscribe(
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

            default:
                break;
        }
    }

    deleteProdutPrice(productPriceId: number) {
        if (this.promotion.id > 0) {
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
                break;

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

    refreshFormato() {
        this._activatedRoute.params.subscribe((params) => {
            if (params['promotions_id'] !== 'new') {
                this.stateEasyrouteService
                    .getProduct(params['promotions_id'])
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

    dateToObject() {
        return dateToObject();
    }

    fileChangeEvent($event: any) {
        return this.loadImage64($event);
    }

    showModalImgInfo() {
    
        const modal = this._modalService.open( ProductModalImgInfoComponent, {
            centered: true,
            backdrop: 'static',        
        });

        modal.componentInstance.type = 'promotion';
    }

    activeProductMain(main: boolean, productPrice: any) {
        if (this.promotion.id > 0) {

            
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

    serviceUpdateMain(productoPrice: number, data: any, name: string) {
        switch (name) {
            case 'main':
                this.data ={
                    main: data, 
                }
            default:
                break;
        }

        if (this.promotion.id > 0) {
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

    activeMain(proprice: any, index:number){
       
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
    changePromotion(check: boolean) {
        // cada vez que haya un cambio en el campo promoción
        // se ajusta la validacion de la fechas

        if (check) {
            this.promotionForm.controls['startPromotionDate'].setValidators([
                Validators.required,
            ]);
            this.promotionForm.controls['endPromotionDate'].setValidators([
                Validators.required,
                this.startPromotionDateConfirmar.bind(this),
            ]);

            this.promotionForm.controls['startPromotionDate'].setValidators([
                Validators.required,
                this.endPromotionDateConfirmar.bind(this),
            ]);

            this.promotionForm.get('startPromotionDate').updateValueAndValidity();
            this.promotionForm.get('endPromotionDate').updateValueAndValidity();
        } else {
            this.promotionForm.controls['startPromotionDate'].setValidators([]);
            this.promotionForm.controls['endPromotionDate'].setValidators([]);
            this.promotionForm.get('startPromotionDate').setValue(null);
            this.promotionForm.get('endPromotionDate').setValue(null);
            this.promotionForm.get('startPromotionDate').updateValueAndValidity();
            this.promotionForm.get('endPromotionDate').updateValueAndValidity();
        }

        this.changeDetect.detectChanges();
    }
    openModal(name){
        
        let title: any;

        switch (name) {

            case 'showPromotionCountDown':

                title = this._translate.instant('PROMOTIONS.COUNTDOWN');

                break;

            case 'showPromotionHome':

                title = this._translate.instant('PROMOTIONS.LOCALTION_PROMOTION_HOME');

                break;

            case 'showPromotionTopCategoryList':

                title = this._translate.instant('PROMOTIONS.LOCATION_PROMOTION_CATEGORY_LIST');

                break;

                case 'showPromotionBetweenProducts':

                title = this._translate.instant('PROMOTIONS.PROMOTION_LOCATION_BETWEEN_PRODUCTS');

                break;

            default:

                break;
        }
        
    
        const modal = this._modalService.open( ModalPromotionImgInfoComponent, {
            centered: true,
            backdrop: 'static',   
            size:'md'     
        });

        modal.componentInstance.type = name;
        modal.componentInstance.title = title;
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
    openPromotionConfiguration(){
  
        this._router.navigateByUrl('/preferences?option=promotions');
    }

    selectMainImage(event: any){

        // cuando es editar 
        if (this.promotion.id > 0) {

            let value : any = this.promotion.images.find((x :any) => x.id === event.index);


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
                      this.promotion.images = this.productImages;
    
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

                this.promotion.images = this.productImages;
    
                this.changeDetect.detectChanges();
    

        }
       
    }

    deleteProductImage(productImageId: number, nameImage: string) {
        if (this.promotion.id > 0) {
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

            this.promotion.images = this.productImages;

            console.log(this.productImages);
        }
    }


  searchPromotionCode(){
    
    this.showCode = false;

    $("#tooltip").tooltip('hide');


    setTimeout(() => {
        this.stateEasyrouteService
        .getPromotionTypeAutoCompleteCode()
        .subscribe(
            (data: any) => {
                console.log(data, 'data')
               this.promotionForm
               .get('code')
               .setValue(data.code);
               this.promotionForm.get('code').updateValueAndValidity();

               this.showCode = true;

               this.changeDetect.detectChanges();

               this.setTimeoutFuntion();
            },
            (error) => {
                this.showCode = true;
                this._toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
    }, 500);

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

    this.loadProductPrices(this.promotion.id);
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

setTimeoutFuntion() {
    setTimeout(() => {
        init_plugins();
    }, 500);
  }


  loadSubCategory(categoryId){

    /*  this.loadingCompanyList = 'loading'; */
 
     setTimeout(() => {
       this.backend.get('sub_category?categoryId=' + categoryId).pipe(take(1)).subscribe(
         (data: any) => {
 
           this.subcategory = data.data;
 
           this.changeDetect.detectChanges();
         },
         (error) => {
 
           this._toastService.displayHTTPErrorToast(
             error.status,
             error.error.error,
           );
         },
       );
     }, 500);
 
   }


}
