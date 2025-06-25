import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Language, MomentDateFormatter, CustomDatepickerI18n, dateNbToDDMMYYY, dateNbToYYYYMMDD } from '../../../../../shared/src/lib/util-functions/date-format';
import { NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Orders } from '../../../../../backend/src/lib/types/orders.type';
import { OrdersProductsInterface } from '../../../../../backend/src/lib/types/orders-products.type';
import { ProductsInterface } from '../../../../../backend/src/lib/types/products.type';
import { ClientInterface } from '../../../../../backend/src/lib/types/clients.type';
import { ActivatedRoute, Router } from '@angular/router';
import { StateEasyrouteService } from '../../../../../state-easyroute/src/lib/state-easyroute.service';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { MyOrdersModalSearchClientComponent } from './my-orders-modal-search-client/my-orders-modal-search-client.component';
import { MyOrdersModalSearchProductsComponent } from './my-orders-modal-search-products/my-orders-modal-search-products.component';
import { MyOrdersModalConfirmationComponent } from './my-orders-modal-confirmation/my-orders-modal-confirmation.component';
import { OrdersMessages } from '../../../../../shared/src/lib/messages/orders/orders.message';
import { Point } from '../../../../../backend/src/lib/types/point.type';

@Component({
  selector: 'easyroute-my-orders-form',
  templateUrl: './my-orders-form.component.html',
  styleUrls: ['./my-orders-form.component.scss'],
  providers: [Language,
    {provide: NgbDateParserFormatter, useClass: MomentDateFormatter},
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
})
export class MyOrdersFormComponent implements OnInit {

  orderForm : FormGroup;

  orders : Orders;

  ordersMessages: any;

  closeResult: string;

  minQuantity: number = 1;

  data:any;

  disable: boolean = false;

  labelQuantity: string = "quantity";

  labelPrice: string = "price";  

  minPrice: number = 1;

  productsTable : any[] = [];

  clientsTable : any = [];

  orderProducts: OrdersProductsInterface [] = []; 

  quantity : number = 0;

  quantityTotal : number = 0;

  subTotal : number = 0 ;

  subTotalTable : number = 0;

  tax : number = 0 ;

  total: number = 0;

  Price : number;

  MontTotalTable : number = 0;

  products : ProductsInterface [] = [];

  clients : Point [] = [];

  clientId: string = '' ;

  dateNow: NgbDateStruct;

  orderDate: any = null
 
  loadingProfiles: string = 'success';

  loadingUserList: string = 'loading';

  loadingCompanyProductUniquelist: string = 'success';

  constructor(
    private _activatedRoute: ActivatedRoute,
    private stateEasyrouteService: StateEasyrouteService,
    private _toastService: ToastService,
    private _translate : TranslateService,
    private fb: FormBuilder,
    private _modalService:NgbModal,
    private Router: Router,
    private changeDetect: ChangeDetectorRef) { }

    ngOnInit() {
      let _now = moment((new Date)).toObject();
      this.dateNow = {
        year: _now.years,
        month: _now.months + 1,
        day: _now.date
      }
      
      this.load();  
    }
  
    load(){
  
      this._activatedRoute.params.subscribe( params => {
  
        if ( params['my_orders_id'] !== 'new' ) {
  
          this.stateEasyrouteService.getOrders( params['my_orders_id'] ).subscribe( (resp: any) => {
    
            this.orders = resp.data;
  
            console.log(this.orders, 'todos los datos');
  
            this.clients = [];
  
            this.orderProducts =[];
  
            this.clientId =resp.data.company.id;
  
            this.clients.push(resp.data.delivery_point); 
  
            this.orderProducts = resp.data.order_product;
          
            this.totalTable();
  
            this.changeDetect.detectChanges();
  
            if(this.orders.orderDate !== null){
  
              let _orderDate = moment(this.orders.orderDate).toObject();
  
              this.orderDate = {
  
                year: _orderDate.years,
  
                month: _orderDate.months + 1,
  
                day: _orderDate.date
              }
            }
            
            this.validaciones( this.orders);
          }, (error)=>{
  
            this._toastService.displayHTTPErrorToast( error.status, error.error.error );
        
          });
  
        }else{
  
          this.orders = new Orders ();
          
          this.validaciones( this.orders);
        
        }
  
      });
    }
    
    validaciones( order : Orders ) {
  
      this.orderForm = this.fb.group({
  
        orderDate:[this.orderDate, [Validators.required]],
  
        isActive: [order.isActive, [Validators.required]],
  
        //interval: [order.interval],
        
        //userSellerId: [order.user_seller.id,[Validators.required]],
        
        observations: [order.observations, [Validators.maxLength(2000)]],
  
        deliveryPoints: [order.company.id],
  
        orderProduct: [order.order_product.id],
  
      });
      
      let ordersMessages = new OrdersMessages();
    
      this.ordersMessages = ordersMessages.getOrdersMessages();
    
    }
  
  
    searchClient() {
      const modal = this._modalService.open(MyOrdersModalSearchClientComponent, {
        size:'xl',
        centered: true,
        backdrop:'static',
      });
    
      modal.result.then((data) => {
  
          if (data) {
  
            let clients = {
              id: data.id,
              name: data.name,
              nif :data.nif,
              province: data.province,
              email: data.email,
            }
  
            this.clientId = clients.id;
  
            const dato = this.clientsTable.find(x => x.id === clients.id);
  
            if (!dato) {
  
              this.clientsTable =[];
  
              this.productsTable =[];
  
              this.orderProducts =[];
  
              this.clientsTable.push(clients);
  
              this.clients = this.clientsTable;
  
              this.changeDetect.detectChanges();
  
            };
          }    
        }, (reason) => {
    
      });
    
    }
  
    deleteCLientsTable(clientId: number){
    
      this.clientsTable = this.clientsTable.filter( (x: any) => x.id !== clientId );
  
      this.clients = this.clientsTable; 
  
      this.clientId= '';
  
      this.orderProducts =[];
  
      this.productsTable=[];
    }
  
    searchProducts() {
  
      const modal = this._modalService.open(MyOrdersModalSearchProductsComponent, {
        backdrop:'static',
      
        backdropClass:'customBackdrop',  
  
        centered: true,
  
        size:'xl'
  
      });
    
      modal.result.then((data) => {
          if (data) {
            let products = {
  
              id: data.id,
              companyProductId:data.companyProductId,
              company_product_price:{
                price:data.price,
                id:data.id,
                company_product: {
                  price :data.price,
                  category: {
                      companyId:data.company_product.category.companyId,
                      id:data.company_product.category.id,
                      name: data.company_product.category.name,
                  },
                  id: data.id,
                  name: data.company_product.name,
                  code: data.company_product.code,
    
              }
            },
            measure: {
              id:data.measure.id,
              name : data.measure.name
            },
            measureId:data.measureId,
            price :data.price,
            tax: data.taxPercent,
            taxPercent:data.taxPercent,
            totalPrice:data.totalPrice,
            quantity: 1
            }
  
            const datos = this.orderProducts.find(x => x.company_product_price.id == data.id);
  
            if (!datos && this.clientId !== '') {
              if (this.orders.id >0) {
                this.getCompanyClientProductPrice(products);
             } else {
              this.productsTable.push(products);
              this.orderProducts = this.productsTable;
              this.getCompanyClientProductPrice(products);
              this.totalTable();
              this.changeDetect.detectChanges();
            }
          } 
        } 
  
          this.totalTable();

          this.changeDetect.detectChanges();
  
        }, (reason) => {
  
      });
    
    }
  
    addNewOrderProduct(products : any){
      
      let dato = {
   
        deliveryPointId:this.orders.delivery_point.id,
  
        orderId : this.orders.id,
  
        productPriceId : products.company_product_price.id,
  
        customPrice: this.Price,
  
        quantity : products.quantity
      }
  
      this.stateEasyrouteService.registerProducts(dato).subscribe( (data: any) => {
  
        this.load();
  
        this.totalTable();
    
      }, (error)=>{
        this._toastService.displayHTTPErrorToast( error.status, error.error.error );
      }); 
    }
  
    getCompanyClientProductPrice(orderProducts: any){
  
      if (this.clientId !== '') {
  
        this.stateEasyrouteService.getCompanyCLientProductPrice(this.clientId, orderProducts.companyProductId , orderProducts.measure.id).subscribe( (data: any) => {
  
          let datos = data.data;
  
          this.Price = data.data.length === 0 ? orderProducts.price = orderProducts.price  : data.data.price;
  
          const companyClientProductPrice = this.orderProducts.find(x=>x.companyProductId === datos.companyProductId);
  
          orderProducts.companyClientProductPrice = data.data.length === 0 ? { price: orderProducts.price}  : data.data ;
  
          orderProducts.price = data.data.length === 0 ? orderProducts.price = orderProducts.price  : data.data.price;

          this.changeDetect.detectChanges();
  
      }, (error)=>{
  
        orderProducts.companyClientProductPrice = error.error.code === 404 ? { price: orderProducts.price}  : error.error.code ;
  
        orderProducts.price = error.error.code === 404? orderProducts.price = orderProducts.price  : error.error.code;
      
        this._toastService.displayHTTPErrorToast( error.status, error.error.error );
    
      });
      if (this.orders.id >0) {
        this.addNewOrderProduct(orderProducts);      
      }
    };
  
  
    }
  
    totalTable() {
  
      this.quantity = 0;  
    
      this.quantityTotal  = 0;
  
      this.tax = 0;
    
      this.subTotal = 0 ;
  
      this.subTotalTable = 0;
  
      this.total = 0;
  
      this.MontTotalTable = 0;
    
      this.orderProducts.forEach((product) =>{
    
        this.quantity = product.quantity,
  
        this.subTotal += this.quantity * product.price,
  
        this.tax += (( (product.price * this.quantity) * product.taxPercent) / 100);
    
        this.total = (this.subTotal + this.tax), 
  
        this.quantityTotal += +this.quantity
  
        this.subTotalTable = this.subTotal;
       
        this.MontTotalTable = this.total;
  
        this.changeDetect.detectChanges();
  
      });
    }
  
    deleteProducts(orderId: number){
  
      if (this.orders.id == 0) {
  
        this.productsTable = this.productsTable.filter( (x: any) => x.id !== orderId );
  
        this.orderProducts = this.productsTable; 
  
      } else if (this.orders.id > 0) {
  
        const modal = this._modalService.open(MyOrdersModalConfirmationComponent, {
      
          backdrop:'static',
      
          backdropClass:'customBackdrop',  
  
          centered: true,
  
          size:'sm'
      
        });
      
        modal.result.then((data) => {
      
            if (data) {
      
            this.stateEasyrouteService.deleteproducts(orderId).subscribe( (data: any) => {
              
              this.load();
          
            }, (error)=>{
              this._toastService.displayHTTPErrorToast( error.status, error.error.error );
          
            });
      
            }
          }, (error) => {
      
            this._toastService.displayHTTPErrorToast( error.status, error.error.error );
      
        });
      }  
    }
  
    changeEvent( id: number, event :any, ordersProducts :OrdersProductsInterface ,name: string) {
  
       switch (name) {
        case "quantity":
          ordersProducts.quantity = event;
          this.updateOrdersProducts(id ,ordersProducts.quantity ,name ,ordersProducts ,event);
        break;
      
        case "price":
          ordersProducts.price = event ;
          this.updateOrdersProducts(id, ordersProducts.price,name, ordersProducts, event);
        break;
  
        default:
          break;
      } 

    }
  
    updateOrdersProducts( id: number ,data: any, name:string ,ordersProducts:any ,event:any){
      switch (name) {
          case "quantity":
            this.data = {
              orderId:ordersProducts.orderId,
              quantity:data
            }
            break;
            case "price":
              this.data = {
                orderId:ordersProducts.orderId,
                quantity:parseInt(ordersProducts.quantity),
                customPrice:Number.parseFloat(event)
                }
                
              break;
        default:
          break;
      }
      if (this.orders.id > 0) {
  
        this.disable = true; 
  
        this.stateEasyrouteService.updateOrdersProducts(id ,this.data).subscribe( (data: any) => {
  
        this.disable = false;
    
        this.load();
    
        }, (error)=>{
  
          this._toastService.displayHTTPErrorToast( error.status, error.error.error );
      
        });
        this.totalTable();

        this.changeDetect.detectChanges();
      }
    } 
  
    createOrder() {
  
      let dataform = _.cloneDeep(this.orderForm.value);
    
      let deliverysPoints : any = [];
      
      let products: any = [];
    
      this.clients.forEach((element) => {
    
        deliverysPoints.push(
    
           element.id)
      });
  
    
      this.orderProducts.forEach((element) =>{
    
        products.push({
    
          productPriceId: element.id,
    
          quantity: element.quantity,
  
          customPrice: element.price
        })
      });
  
      dataform.deliveryPoints = deliverysPoints
      
      dataform.orderProduct = products;
      
      dataform.orderDate = dateNbToYYYYMMDD(this.orderForm.value.orderDate);

      console.log(dataform.orderDate, this.orderForm.value.orderDate);
    
      if (this.orderProducts.length ==0 || this.clients.length== 0 || this.orderForm.invalid) {
      
          this._toastService.displayHTTPErrorToast('Aviso;', 'El usuario no es valido');
          
      } else {
    
        if (this.orders.id && this.orders.id > 0) {
  
          this.stateEasyrouteService.updateMyOrders(this.orders.id, dataform).subscribe( (data: any) => {

            this._toastService.displayWebsiteRelatedToast(
              this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
              this._translate.instant('GENERAL.ACCEPT')
            );

            this.Router.navigate(['my-orders']);
        
          }, (error)=>{
  
            this._toastService.displayHTTPErrorToast( error.status, error.error.error );
        
          });
    
        } else  {
          
            this.stateEasyrouteService.registerMyOrders(dataform).subscribe( (data: any) => {
  
            this._toastService.displayWebsiteRelatedToast(
              this._translate.instant('GENERAL.REGISTRATION'),
              this._translate.instant('GENERAL.ACCEPT')
            );
        
            this.Router.navigate(['my-orders']);
        
          }, (error)=>{
  
            this._toastService.displayHTTPErrorToast( error.status, error.error.error );
        
          }); 
        }
      }
    }
  
    getPdfOrder(id: number){
      this.stateEasyrouteService.getPdfOrder(id);
    }

}
