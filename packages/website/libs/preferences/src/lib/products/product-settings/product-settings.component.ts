import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ToastService } from '@optimroute/shared';
import { BackendService } from 'libs/backend/src/lib/backend.service';
import { AllowDelayTime } from 'libs/backend/src/lib/types/allowDelayTime.type';
import { ProductsPreferences } from 'libs/backend/src/lib/types/preferences.type';

import { PreferencesFacade } from 'libs/state-preferences/src/lib/+state/preferences.facade';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-product-settings',
  templateUrl: './product-settings.component.html',
  styleUrls: ['./product-settings.component.scss']
})
export class ProductSettingsComponent implements OnInit {

  productPreferences$: Observable<ProductsPreferences>;

  discount: any = [];

  allowDelayTime: AllowDelayTime [] =[];
  
  constructor(
    private facade: PreferencesFacade,
    private backendService: BackendService,
    private toastService: ToastService,
    private translate: TranslateService,
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.facade.loadProductPreferences();

    this.productPreferences$ = this.facade.productPreferences$;

    this. LoadDiscount();

  }

  toggleProductGeneral(key: any, value: any) {

    this.facade.toggleProductPreference(key, value);

  }

   //cargar listado de discount
   
   LoadDiscount(){

    this.backendService.get('company_discount_type').pipe(take(1)).subscribe(({data})=>{

        if (data.length >0) {

            this.discount = data;

        }
       if (this.discount.length == 0) {
        this.discount.push ({
            id: 0,
            companyId: 0,
            name: "",
            discountPercent: 0,
            isActive: false,
            created: "",
            updated: "",
           });
       }

        this.detectChanges.detectChanges();

      });

  }


  addOthersDiscount(value, data: any, name:string){

    switch (name) {

        case "name":

            data.name = value;

            break;

        case "discountPercent":

            data.discountPercent = value;

            break;

        default:
            break;
    }

    if( !data.discountPercent) return;



    if(!data.id && data.name &&  data.discountPercent ) {

      this.createDiscount(data);

    } else {

        this.updateDiscount(data);

    }

}

createDiscount(data : any){

  const index = this.discount.indexOf(data);


  this.backendService.post('company_discount_type', {

      name: data.name,

      discountPercent: data.discountPercent,

    }).pipe(take(1)).subscribe((response)=>{


      this.discount[index].id = response.data.id;

      this.discount[index].name = response.data.name;

      this.discount[index].discountPercent = response.data.discountPercent;

      this.detectChanges.detectChanges();

      this.toastService.displayWebsiteRelatedToast(

          this.translate.instant('GENERAL.REGISTRATION'),

          this.translate.instant('GENERAL.ACCEPT')

      )

    }, error => {

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);

    });
}
updateDiscount(data :any){

  const index = this.discount.indexOf(data);

  this.backendService.put('company_discount_type/' + data.id, {

      name: data.name,

      discountPercent: data.discountPercent,



    }).pipe(take(1)).subscribe((response)=>{


      this.discount[index].id = response.data.id;

      this.discount[index].name = response.data.name;

      this.discount[index].discountPercent = response.data.discountPercent;


      this.detectChanges.detectChanges();

      this.toastService.displayWebsiteRelatedToast(

        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),

        this.translate.instant('GENERAL.ACCEPT')

    );


    }, error => {

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);

    });
}

addOtherDiscount(){
  this.discount.push({
      id:0,
      name:'',
      discountPercent:0
  });

  this.detectChanges.detectChanges();
}
/* muentra el valor del time */
showNUmber(number: number){

  return Math.floor(number / 60);

}


}
