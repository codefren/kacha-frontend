import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OrdersProductsInterface, ClientInterface, Orders } from '@optimroute/backend';
import { ProductsInterface } from '../../../../../backend/src/lib/types/products.type';
import {
    NgbDateStruct,
    NgbModal,
    NgbDateParserFormatter,
    NgbDatepickerI18n,
} from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { OrdersModalSearchClientComponent } from './orders-modal-search-client/orders-modal-search-client.component';
import { OrdersModalSearchProductsComponent } from './orders-modal-search-products/orders-modal-search-products.component';
import { OrdersModalConfirmationComponent } from './orders-modal-confirmation/orders-modal-confirmation.component';
import {
    Language,
    MomentDateFormatter,
    CustomDatepickerI18n,
} from '../../../../../shared/src/lib/util-functions/date-format';
import { OrdersMessages, dateToObject, getToday } from '@optimroute/shared';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { Point } from '../../../../../backend/src/lib/types/point.type';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { take, takeUntil } from 'rxjs/operators';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { Subject } from 'rxjs';

@Component({
    selector: 'easyroute-orders-form',
    templateUrl: './orders-form.component.html',
    styleUrls: ['./orders-form.component.scss'],
    providers: [
        Language,
        { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    ],
})
export class OrdersFormComponent implements OnInit {
    orderForm: FormGroup;

    orders: Orders;

    ordersMessages: any;

    closeResult: string;

    minQuantity: number = 1;

    data: any;

    disable: boolean = false;

    labelQuantity: string = 'quantity';

    labelPrice: string = 'price';

    minPrice: number = 1;

    productsTable: any[] = [];

    clientsTable: any = [];

    commercialUser: any = [];

    commercialUserName: string = '';

    orderProducts: OrdersProductsInterface[] = [];

    quantity: number = 0;

    quantityTotal: number = 0;

    subTotal: number = 0;

    subTotalTable: number = 0;

    tax: number = 0;

    total: number = 0;

    Price: number;

    equivalence: number = 0;

    MontTotalTable: number = 0;

    products: ProductsInterface[] = [];

    clients: Point[] = [];

    clientId: string = '';

    //dateNow: string;

    loadingProfiles: string = 'success';

    loadingUserList: string = 'success';

    loadingCompanyProductUniquelist: string = 'success';

    equivalenceClient: boolean;

    netxStatus: any = [];

    orderDate: any = null;

    date: NgbDateStruct;
    min: NgbDateStruct;

    toggleClients: boolean = true;

    toggleProducts: boolean = true;

    private unsubscribe$ = new Subject<void>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private stateEasyrouteService: StateEasyrouteService,
        private _toastService: ToastService,
        private _translate: TranslateService,
        private fb: FormBuilder,
        private _modalService: NgbModal,
        private Router: Router,
        private changeDetect: ChangeDetectorRef,
        public _authLocalService: AuthLocalService,
        private profileFacade: ProfileSettingsFacade,
        private preferencesFacade: PreferencesFacade,
        private preferecesFacade: PreferencesFacade
    ) { }

    ngOnInit() {
        this.preferecesFacade.ordersPreferences$.pipe(takeUntil(this. unsubscribe$)).subscribe((data) => {
            let date = data.acceptSameDay ? moment().format('YYYY-MM-DD') : moment().add(1, 'day').format('YYYY-MM-DD');
            
            this.date = dateToObject(date);
            this.min = dateToObject(date);

        })

        this.load();
    }

    loadNextStatusOrder() {
        this.stateEasyrouteService.getNetxStatusOrder(this.orders.id).subscribe((resp) => {
            this.netxStatus = resp.data;
        });
    }
    changeStatus(id: any) {
        if (id != '') {
            const modal = this._modalService.open(ConfirmModalComponent, {
                size: 'xs',
                backdropClass: 'customBackdrop',
                centered: true,
                backdrop: 'static',
            });
            modal.componentInstance.message =
                this._translate.instant('ORDERS.CHANGE_STATUS_1') +
                ' <b>' +
                this.orders.status_order.name +
                '</b> ' +
                this._translate.instant('ORDERS.CHANGE_STATUS_2') +
                ' <b>' +
                this.netxStatus.find((x) => x.id === parseInt(id)).name +
                '</b>?';
            modal.result.then((data) => {
                if (data) {
                    this.stateEasyrouteService.changeStatus(this.orders.id, id).subscribe(
                        (resp) => {
                            this.load();
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

    }

    load() {
        this._activatedRoute.params.subscribe((params) => {
            if (params['id'] !== 'new') {
                this.stateEasyrouteService.getOrders(params['id']).subscribe(
                    (resp: any) => {
                        this.orders = resp.data;

                        this.equivalenceClient = resp.data.delivery_point.equivalence;

                        this.disable =
                            this.orders.status_order.id !== 1 &&
                            this.orders.status_order.id !== 2;

                        this.clients = [];

                        this.orderProducts = [];

                        this.clientId = resp.data.company.id;

                        this.clients.push(resp.data.delivery_point);

                        this.orderProducts = resp.data.order_product;

                        console.log(this.orderProducts);

                        this.totalTable();

                        this.changeDetect.detectChanges();

                        this.loadNextStatusOrder();

                        if (this.orders.orderDate !== null) {
                            console.log(this.orders.orderDate)
                            let _orderDate = moment(this.orders.orderDate).toObject();

                            console.log(_orderDate);

                            this.orderDate = {

                                year: _orderDate.years,

                                month: _orderDate.months + 1,

                                day: _orderDate.date,
                            };

                            

                            this.min = this.orderDate;
                        }

                        this.validaciones(this.orders);
                    },
                    (error) => {
                        this._toastService.displayHTTPErrorToast(
                            error.status,
                            error.error.error,
                        );
                    },
                );
            } else {
                this.preferencesFacade.preferences$
                    .pipe(take(1))
                    .subscribe((preferences) => {
                      // console.log(preferences.orders, 'preferences')
                       
                        if (preferences.orders.assignedNextDay) {
                           // console.log('1 if')
                            this.orderDate =moment().add(1, 'day').format('YYYY-MM-DD');

                        } else if (preferences.orders.acceptSameDay) {
                           // console.log('2 if')
                            this.orderDate =moment().format('YYYY-MM-DD');

                        }
                        else if (!preferences.orders.assignedNextDay && !preferences.orders.acceptSameDay){
                            //console.log('2 if')
                            
                            this.orderDate =moment().add(1, 'day').format('YYYY-MM-DD');

                        } else if (!preferences.orders.assignedNextDay && preferences.orders.acceptSameDay) {
                           // console.log('3 if')
                            this.orderDate = moment().format('YYYY-MM-DD');

                        } else if (!preferences.orders.acceptSameDay && preferences.orders.assignedNextDay) {
                            //console.log('4 if')
                            this.orderDate =moment().add(1, 'day').format('YYYY-MM-DD');

                        } 
                        /* this.orderDate = preferences.orders.assignedNextDay
                            ? moment(new Date().toISOString()).add('day', 1).format('YYYY-MM-DD')
                            : moment(new Date().toISOString()).format('YYYY-MM-DD') */
                    });

                    this.min = dateToObject(this.orderDate);
                    let _orderDate = moment(this.orderDate).toObject();
 
                    this.orderDate = {
                        year: _orderDate.years,
            
                        month: _orderDate.months + 1,
            
                        day: _orderDate.date,
                    };


                    this.orders = new Orders();

                    this.validaciones(this.orders);
            }
        });
    }

    validaciones(order: Orders) {

        this.orderForm = this.fb.group({
            orderDate: [this.orderDate, [Validators.required]],
            isActive: [order.isActive, [Validators.required]],
            observations: [order.observations, [Validators.maxLength(2000)]],
            deliveryPoints: [order.company.id],
            orderProduct: [order.order_product.id],
        });

        if (this.isAdmin()) {
            this.orderForm.addControl(
                'userSellerId',
                new FormControl(this.orders.user_seller.id, [Validators.required]),
            );
            
            if (this.orders.id > 0 && this.orders.status_order.id !== 1) {
                this.orderForm.controls['userSellerId'].disable();
                this.orderForm.get('userSellerId').updateValueAndValidity();
            }

        }

        if (this.orders.id > 0 && this.orders.status_order.id !== 1) {
            this.orderForm.controls['observations'].disable();
            this.orderForm.get('observations').updateValueAndValidity();
        }

        let ordersMessages = new OrdersMessages();

        this.ordersMessages = ordersMessages.getOrdersMessages();

        this.getUserCommercial(order);
        this.changeDetect.detectChanges();
    }

    getUserCommercial(order) {
        this.loadingUserList = 'loading';
        
        setTimeout(() => {
            this.stateEasyrouteService.getAgentuser(order.user_seller.id).subscribe(
                (data: any) => {
                    this.loadingUserList = 'success';
                    this.commercialUser = data.data;
                },
                (error) => {

                    this.loadingUserList = 'error';
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
        }, 1000);
    }

    convertFormatt(date: string) {
        if (date) {
            return moment(new Date(date)).format('DD/MM/YYYY');
        }
    }

    convertFormatt2(date: string) {
        if (date) {
            return moment(new Date(date).getTime() + 1 * 24 * 60 * 60 * 1000).format('DD/MM/YYYY');
        }
    }

    searchClient() {
        const modal = this._modalService.open(OrdersModalSearchClientComponent, {
            size: 'xl',
            centered: true,
            backdrop: 'static',
        });

        modal.result.then(
            (data) => {

                if (data) {
                    let clients = {
                        id: data.id,
                        name: data.name,
                        nif: data.nif,
                        province: data.province,
                        email: data.email,
                        address: data.address,
                    };

                    // equivalence client
                    //this.equivalenceClient = data.equivalence === '1' ? true : false;
                    this.equivalenceClient = data.equivalence;


                    this.clientId = clients.id;

                    const dato = this.clientsTable.find((x) => x.id === clients.id);

                    if (!dato) {
                        this.clientsTable = [];

                        this.productsTable = [];

                        this.orderProducts = [];

                        this.clientsTable.push(clients);

                        this.clients = this.clientsTable;

                        this.changeDetect.detectChanges();
                    }
                }
            },
            (reason) => { },
        );
    }

    deleteCLientsTable(clientId: number) {
        this.clientsTable = this.clientsTable.filter((x: any) => x.id !== clientId);

        this.clients = this.clientsTable;

        this.clientId = '';

        this.orderProducts = [];

        this.productsTable = [];

        this.changeDetect.detectChanges();
    }

    searchProducts() {
        const modal = this._modalService.open(OrdersModalSearchProductsComponent, {
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            centered: true,
            size: 'xl',
        });

        modal.result.then(
            (data) => {
                if (data) {
                    data.forEach((dataElement: any) => {
                        console.log('aqui entro el producto');
                        let products = {
                            id: dataElement.id,
                            companyProductId: dataElement.companyProductId,
                            lotCode: dataElement.lotCode,
                            company_product_price: {
                                lotCode: dataElement.lotCode,
                                price: dataElement.price,
                                id: dataElement.id,
                                company_product: {
                                    price: dataElement.price,
                                    category: {
                                        id: dataElement.company_product.categoryId
                                    },
                                    id: dataElement.id,
                                    name: dataElement.company_product.name,
                                    code: dataElement.company_product.code,
                                },
                            },
                            measure: {
                                id: dataElement.measure.id,
                                name: dataElement.measure.name,
                            },
                            measureId: dataElement.measureId,
                            price: dataElement.price,
                            tax: dataElement.taxPercent,
                            taxPercent: dataElement.taxPercent,
                            totalPrice: dataElement.totalPrice,
                            equivalence: dataElement.equivalence,
                            equivalencePercent: dataElement.equivalencePercent,
                            quantity: 1,
                            observation: ''
                        };

                        if (this.clientId !== '') {
                            if (this.orders.id > 0) {
                                this.getCompanyClientProductPrice(products);
                            } else {

                                this.productsTable.push(products);
                                this.orderProducts = this.productsTable;
                                this.getCompanyClientProductPrice(products);
                                //this.totalTable();
                                this.changeDetect.detectChanges();

                            }
                        }
                    });

                }
                this.totalTable();

                this.changeDetect.detectChanges();
            },
            (reason) => { },
        );
    }

    addNewOrderProduct(products: any) {
        let dato = {
            deliveryPointId: this.orders.delivery_point.id,

            orderId: this.orders.id,

            productPriceId: products.company_product_price.id,

            customPrice: this.Price,

            quantity: products.quantity,
        };

        this.stateEasyrouteService.registerProducts(dato).subscribe(
            (data: any) => {
                this.load();

                console.log(this.orderForm, 'formulario')
                console.log(this.orderProducts.length == 0, 'order product');
                console.log(this.clients.length == 0, 'cliente');
            },
            (error) => {
                this._toastService.displayHTTPErrorToast(error.status, error.error.error);
            },
        );
    }

    getCompanyClientProductPrice(orderProducts: any) {
        console.log(this.clients);
        if (this.clientId != '') {
            this.stateEasyrouteService
                .getCompanyCLientProductPrice(
                    this.clientId,
                    orderProducts.companyProductId,
                    orderProducts.measure.id,
                )
                .subscribe(
                    (data: any) => {
                        let datos = data.data;

                        this.Price =
                            data.data.length === 0
                                ? (orderProducts.price = orderProducts.price)
                                : data.data.price;

                        const companyClientProductPrice = this.orderProducts.find(
                            (x) => x.companyProductId === datos.companyProductId,
                        );

                        orderProducts.companyClientProductPrice =
                            data.data.length === 0
                                ? { price: orderProducts.price }
                                : data.data;

                        orderProducts.price =
                            data.data.length === 0
                                ? (orderProducts.price = orderProducts.price)
                                : data.data.price;

                        this.totalTable();

                    },
                    (error) => {
                        orderProducts.companyClientProductPrice =
                            error.error.code === 404
                                ? { price: orderProducts.price }
                                : error.error.code;

                        orderProducts.price =
                            error.error.code === 404
                                ? (orderProducts.price = orderProducts.price)
                                : error.error.code;

                        this._toastService.displayHTTPErrorToast(
                            error.status,
                            error.error.error,
                        );
                    },
                );
            if (this.orders.id > 0) {
                this.addNewOrderProduct(orderProducts);
            }
        }
    }

    totalTable() {

        this.quantity = 0;

        this.quantityTotal = 0;

        this.equivalence = 0;

        this.tax = 0;

        this.subTotal = 0;

        this.subTotalTable = 0;

        this.total = 0;

        this.MontTotalTable = 0;
        
        this.orderProducts.forEach((product) => {
           
            console.log('product', product);
            this.quantity = product.quantity;
          
            this.subTotal += this.quantity * product.price;

            this.tax += (product.price * this.quantity * product.taxPercent) / 100;

            this.equivalence +=
                (product.price * this.quantity * product.equivalencePercent) / 100;

            if (this.equivalenceClient) {
                this.total = +product.total
            } else {
                this.total = +product.total;
            }

            this.quantityTotal += +this.quantity;

            this.subTotalTable = +this.subTotal;

            this.MontTotalTable += +this.total;


            this.changeDetect.detectChanges();
        });
    }

    changeObservation(value, index) {

        if (this.orders.id == 0) {
            this.orderProducts[index].observation = value;
        } else {
            this.disable = true;
            let data = {
                ...this.orderProducts[index],
                orderId: this.orders.id,
                observation: value
            }
            this.stateEasyrouteService.updateOrdersProducts(this.orderProducts[index].id, data).subscribe(
                (data: any) => {
                    this.disable = false;

                    this.load();
                },
                (error) => {
                    this.disable = false;
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
            this.totalTable();
        }

    }

    deleteProducts(index: number) {
        if (this.orders.id == 0) {
            this.productsTable.splice(index, 1);
            this.orderProducts = this.productsTable;
            this.totalTable();
        } else if (this.orders.id > 0) {
            const modal = this._modalService.open(OrdersModalConfirmationComponent, {
                size: 'xs',
                backdropClass: 'customBackdrop',
                centered: true,
                backdrop: 'static',
            });

            modal.result.then(
                (data) => {
                    if (data) {
                        this.stateEasyrouteService.deleteproducts(this.orderProducts[index].id).subscribe(
                            (data: any) => {
                                this.load();
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

    changeEvent(
        id: number,
        event: any,
        ordersProducts: OrdersProductsInterface,
        name: string,
    ) {
        switch (name) {
            case 'quantity':
                ordersProducts.quantity = event;
                this.totalTable();
                this.updateOrdersProducts(
                    id,
                    ordersProducts.quantity,
                    name,
                    ordersProducts,
                    event,
                );
                break;

            case 'price':
                ordersProducts.price = event;
                this.totalTable();
                this.updateOrdersProducts(
                    id,
                    ordersProducts.price,
                    name,
                    ordersProducts,
                    event,
                );
                break;

            default:
                break;
        }
    }

    updateOrdersProducts(
        id: number,
        data: any,
        name: string,
        ordersProducts: any,
        event: any,
    ) {
        switch (name) {
            case 'quantity':
                this.data = {
                    orderId: ordersProducts.orderId,
                    quantity: data,
                    observation: ordersProducts.observation
                };
                break;
            case 'price':
                this.data = {
                    orderId: ordersProducts.orderId,
                    quantity: parseInt(ordersProducts.quantity),
                    observation: ordersProducts.observation,
                    customPrice: Number.parseFloat(event),
                };
                break;
            default:
                break;
        }
        if (this.orders.id > 0) {
            this.disable = true;

            this.stateEasyrouteService.updateOrdersProducts(id, this.data).subscribe(
                (data: any) => {
                    this.disable = false;

                    this.load();
                },
                (error) => {
                    this.disable = false;
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
            this.totalTable();
        }
    }

    createOrder() {

        let dataform = _.cloneDeep(this.orderForm.value);

        let deliverysPoints: any = [];

        let products: any = [];

        this.clients.forEach((element) => {
            deliverysPoints.push(element.id);
        });

        this.orderProducts.forEach((element) => {
            products.push({
                productPriceId: element.id,

                quantity: element.quantity,

                customPrice: element.price,

                observation: element.observation
            });
        });

        dataform.deliveryPoints = deliverysPoints;

        dataform.orderProduct = products;

        dataform.orderDate = moment(`${this.orderForm.value.orderDate.year}-${this.orderForm.value.orderDate.month.toString().padStart(2, '0')}-${this.orderForm.value.orderDate.day.toString().padStart(2, '0')}`).format('YYYY-MM-DD')



        if (
            this.orderProducts.length == 0 ||
            this.clients.length == 0 ||
            this.orderForm.invalid
        ) {
            this._toastService.displayHTTPErrorToast('Aviso;', 'El usuario no es valido');
        } else {
            if (this.orders.id && this.orders.id > 0) {
                this.stateEasyrouteService.updateOrders(this.orders.id, dataform).subscribe(
                    (data: any) => {
                        this._toastService.displayWebsiteRelatedToast(
                            this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                            this._translate.instant('GENERAL.ACCEPT'),
                        );

                        this.Router.navigate(['orders']);
                    },
                    (error) => {
                        this._toastService.displayHTTPErrorToast(
                            error.status,
                            error.error.error,
                        );
                    },
                );
            } else {
                this.stateEasyrouteService.registerOrders(dataform).subscribe(
                    (data: any) => {
                        this._toastService.displayWebsiteRelatedToast(
                            this._translate.instant('GENERAL.REGISTRATION'),
                            this._translate.instant('GENERAL.ACCEPT'),
                        );

                        this.Router.navigate(['orders']);
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
    }

    getPdfOrder(id: number) {
        this.stateEasyrouteService.getPdfOrder(id);
    }

    isAdmin() {
        let value =
            this._authLocalService.getRoles() !== null
                ? this._authLocalService
                    .getRoles()
                    .find(
                        (role) =>
                            role === 1 ||
                            role === 2 ||
                            role === 3 ||
                            role === 8 ||
                            role === 9,
                    ) !== undefined
                : false;
        return value;
    }

    showToggleClients() {
        this.toggleClients = !this.toggleClients;

    }

    showToggleProducts() {
        if (this.clients.length > 0) {
            this.toggleProducts = !this.toggleProducts;
        }
    }
}
