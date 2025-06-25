import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductsInterface } from '../../../../../backend/src/lib/types/products.type';
import { Point } from '../../../../../backend/src/lib/types/point.type';
import { NgbDateStruct, NgbDateParserFormatter, NgbDatepickerI18n, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdersProductsInterface } from '../../../../../backend/src/lib/types/orders-products.type';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Orders } from '../../../../../backend/src/lib/types/orders.type';
import { Language, MomentDateFormatter, CustomDatepickerI18n, dateToObject } from '../../../../../shared/src/lib/util-functions/date-format';
import { ActivatedRoute, Router } from '@angular/router';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { sliceMediaString, ToastService } from '@optimroute/shared';
import { TranslateService } from '@ngx-translate/core';
import { AuthLocalService } from '../../../../../auth-local/src/lib/auth-local.service';
import { ProfileSettingsFacade } from '../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { PreferencesFacade } from '../../../../../state-preferences/src/lib/+state/preferences.facade';
import * as _ from 'lodash';
 
import * as moment from 'moment-timezone';
import { take } from 'rxjs/operators';
import { ConfirmModalComponent } from '../../../../../shared/src/lib/components/confirm-modal/confirm-modal.component';
import { OrdersMessages } from '../../../../../shared/src/lib/messages/orders/orders.message';
import { secondsToAbsoluteTimeAlterne } from 'libs/shared/src/lib/util-functions/time-format';
declare function init_plugins();

@Component({
  selector: 'easyroute-preparation-form',
  templateUrl: './preparation-form.component.html',
  styleUrls: ['./preparation-form.component.scss'],
  providers: [
    Language,
    { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
],
})
export class PreparationFormComponent implements OnInit {

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

  toggleClients: boolean = false;

  toggleProducts: boolean = false;

  orderTimeDetails: any ;


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
    private preferecesFacade: PreferencesFacade) { }

    ngOnInit() {
    setTimeout(()=>{
        init_plugins();
    }, 1000);
      this.preferecesFacade.ordersPreferences$.pipe((take(1))).subscribe((data) => {


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

    
                      this.totalTable();

                      this.changeDetect.detectChanges();

                      this.loadNextStatusOrder();
                    
                      if (this.orders.orderDate !== null) {
                         
                          let _orderDate = moment(this.orders.orderDate).toObject();
                        
                          this.orderDate = {
                              year: _orderDate.years,

                              month: _orderDate.months + 1,

                              day: _orderDate.date,
                          };

                          this.min = this.orderDate;
                      }
                      this.validaciones(this.orders);
                      this.getOrdersDetailTime(params['id']);
                      this.getOrdersProductDeleteLists(params['id']);
                      this.toggleClients= true;
                      this.toggleProducts=true;
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
                      this.orderDate = preferences.orders.assignedNextDay
                          ? moment(new Date().toISOString()).add('day', 1).format('DD/MM/YYYY')
                          : moment(new Date().toISOString()).format('DD/MM/YYYY')
                  });
              this.orders = new Orders();

              this.validaciones(this.orders);
          }
      });
  }

  validaciones(order: Orders) {
      this.orderForm = this.fb.group({
          orderDate: [this.orderDate, [Validators.required]],

          isActive: [order.isActive, [Validators.required]],

         // observations: [order.observations, [Validators.maxLength(2000)]],

          //deliveryPoints: [order.company.id],

          orderProduct: [order.order_product.id],
      });

      if (this.isAdmin()) {
          /* this.profileFacade.profile$.pipe(take(1)).subscribe((data) => {
              if (data) {
                  console.log(data, data.profile.id, this.orders)
                  this.orderForm.addControl(
                      'userSellerId',
                      new FormControl(data.profile.id, [Validators.required]),
                  );
              }
          }); */

          this.orderForm.addControl(
              'userSellerId',
              new FormControl(this.orders.user_seller.id, [Validators.required]),
          );
      }

      let ordersMessages = new OrdersMessages();

      this.ordersMessages = ordersMessages.getOrdersMessages();

  }

  getOrdersDetailTime(id:number){
    this.stateEasyrouteService.getOrdersDetailTime(id).subscribe(
        (data: any) => {

          this.loadingUserList = 'success';
          this.orderTimeDetails = data;
          console.log(this.orderTimeDetails, 'this.orderTimeDetails')
        },
        (error) => {
          
            this._toastService.displayHTTPErrorToast(
                error.status,
                error.error.error,
            );
        },
    );
    
  }
  getOrdersProductDeleteLists(id:number){
    this.stateEasyrouteService.getOrdersProductDeleteList(id).subscribe(
        (data: any) => {
            console.log(data, 'getOrdersProductDeleteLists')
            if (data.length > 0) {
               
                this.loadingUserList = 'success';
              
               data.forEach(element => {
                  this.orderProducts.push(element);
               });
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

  deleteCLientsTable(clientId: number) {
      this.clientsTable = this.clientsTable.filter((x: any) => x.id !== clientId);

      this.clients = this.clientsTable;

      this.clientId = '';

      this.orderProducts = [];

      this.productsTable = [];

      this.changeDetect.detectChanges();
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
          this.quantity = product.quantity;

          this.subTotal += this.quantity * product.price;

          this.tax += (product.price * this.quantity * product.taxPercent) / 100;

          this.equivalence +=
              (product.price * this.quantity * product.equivalencePercent) / 100;

          if (this.equivalenceClient) {
              this.total = this.subTotal + this.tax + this.equivalence;
          } else {
              this.total = this.subTotal + this.tax;
          }

          this.quantityTotal += +this.quantity;

          this.subTotalTable = this.subTotal;

          this.MontTotalTable = this.total;

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

                      this.Router.navigate(['/orders/preparation']);
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

                      this.Router.navigate(['/orders/preparation']);
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

  formaDate(date: any){
      return moment(date).locale('es').tz('Europe/Madrid').format('DD/MM/YYYY');
  }
  sliceString( text: string ) {
    return sliceMediaString( text, 24, '(min-width: 960px)' );
}
sliceStringZone( text: string ) {
    return sliceMediaString( text, 32, '(min-width: 960px)' );
}
formaHour(date: any){
    if (date) {
        return moment(date).locale('es').tz('Europe/Madrid').format('HH:mm');
    } else {
        return '-'
    }
    
}
public timepress( hourseExpress: number ) {
        return  secondsToAbsoluteTimeAlterne(hourseExpress, true); 
  }

}
