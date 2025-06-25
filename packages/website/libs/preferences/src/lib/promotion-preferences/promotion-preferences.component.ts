import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BackendService } from '@optimroute/backend';
import { LoadingService, ModalPromotionImgInfoComponent, ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;
import * as _ from 'lodash';
@Component({
  selector: 'easyroute-promotion-preferences',
  templateUrl: './promotion-preferences.component.html',
  styleUrls: ['./promotion-preferences.component.scss']
})
export class PromotionPreferencesComponent implements OnInit {

  promotionsPreferences: any = {

    activeCarouselTime: false,

    carouselTimeIntervalPromotions: 0,

    showPromotionBetweenProducts: false,

    showPromotionHome: false,

    timePromotionBetweenProducts: 0,

    timePromotionHome: 0

  };

  category: any[] | undefined = undefined;

  subcategory: any = {};

  loadingCompanyList: string = 'success';

  companyPrefeProduct: any;

  cardImageBase64: string;

  imageError: string = '';

  timeImage: string;



  constructor(private changeDetectorRef: ChangeDetectorRef,
    private backend: BackendService,
    private loading: LoadingService,
    private _modalService: NgbModal,
    private _translate: TranslateService,
    private toast: ToastService) { }

  ngOnInit() {

    this.timeImage = this.timeImageFunc();

    this.load();

    this.getCategory();

    this.getCompanypreference();

  }


  timeImageFunc() {
    return '?v1=' + new Date().getTime();
  }

  async load() {

    await this.loading.showLoading();

    this.backend.get('company_preference_product_promotions').pipe(take(1)).subscribe(({ data }) => {

      this.loading.hideLoading();

      this.promotionsPreferences = data;

      this.changeDetectorRef.detectChanges();
    }, (error) => {
      this.loading.hideLoading();
      this.toast.displayHTTPErrorToast(
        error.error.code,
        error.error,
      );
    });
  }

  async changeCarouselTime() {

    await this.loading.showLoading();

    this.backend.post('company_preference_product_promotions', this.promotionsPreferences)

      .pipe(take(1)).subscribe(({ data }) => {


        this.loading.hideLoading();

        this.promotionsPreferences = data;

        this.toast.displayWebsiteRelatedToast(
          this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
          this._translate.instant('GENERAL.ACCEPT')
        );

        this.changeDetectorRef.detectChanges();

      }, (error) => {

        this.loading.hideLoading();

        this.toast.displayHTTPErrorToast(
          error.error.code,
          error.error,
        );
      });
  }

  /* open modal information */

  openModalConfiguration() {

    const modal = this._modalService.open(ModalPromotionImgInfoComponent, {

      centered: true,

      backdrop: 'static',

      size: 'md'

    });

    modal.componentInstance.type = 'showPromotionHomes';

    modal.componentInstance.title = this._translate.instant('PROMOTIONS.SHOW_PROMOTIONS_PR_HOME');

  }

  getCategory() {

    this.loadingCompanyList = 'loading';

    setTimeout(() => {
      this.backend.get('category_list_general').pipe(take(1)).subscribe(
        (data: any) => {
          // obtiene las categorías


          this.loadingCompanyList = 'success';

          this.category = data.data;

          this.changeDetectorRef.detectChanges();
        },
        (error) => {

          this.toast.displayHTTPErrorToast(
            error.status,
            error.error.error,
          );
        },
      );
    }, 500);
  }

  /* get card */

  getCompanypreference() {

    this.backend.get('company_prefe_product_pre_promo').pipe(take(1)).subscribe(
      (data: any) => {

        /* con esto se llena para dibujar los 4 card */

        this.companyPrefeProduct = [
          {
            category: {
              companyId: 0,
              id: 0,

            },
            subCategory: {
              companyId: 0,
              id: 0,
            },
            subCategoryId: '',
            categoryId: '',
            companyId: 0,
            id: 0,
            urlImage: '',
            image: ''
          },
          {
            category: {
              companyId: 0,
              id: 0,

            },
            subCategory: {
              companyId: 0,
              id: 0,
            },
            subCategoryId: '',
            categoryId: '',
            companyId: 0,
            id: 0,
            urlImage: '',
            image: ''
          },
          {
            category: {
              companyId: 0,
              id: 0,

            },
            subCategory: {
              companyId: 0,
              id: 0,
            },
            subCategoryId: '',
            categoryId: '',
            companyId: 0,
            id: 0,
            urlImage: '',
            image: ''
          },
          {
            category: {
              companyId: '',
              id: 0,

            },
            subCategory: {
              companyId: 0,
              id: 0,
            },
            subCategoryId: '',
            categoryId: '',
            companyId: 0,
            id: 0,
            urlImage: '',
            image: ''
          },

        ];
        /* si se carga uno hace un map y llena dada la posición el valor */
        if (data.data.length > 0) {

          data.data.map((item, index) => {


            this.companyPrefeProduct[index] = item;
            if(item.categoryId > 0){
              this.loadSubCategory(item.categoryId, index);
            }

            return item;
          });

        }

        this.changeDetectorRef.detectChanges();


      },
      (error) => {

        this.toast.displayHTTPErrorToast(
          error.status,
          error.error.error,
        );
      },
    );
  }

  fileChangeEvent($event: any, data: any) {

    return this.loadImage64($event, data);
  }


  loadImage64(e: any, data: any) {

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

    reader.onload = this._handleReaderLoaded.bind(this, data);

    reader.readAsDataURL(file);
  }


  _handleReaderLoaded(e: any, dataImg: any) {

    const index = this.companyPrefeProduct.indexOf(e);

    let reader = dataImg.target.result;

    this.cardImageBase64 = reader;


    if (e && e.id > 0) {

      this.loading.showLoading();

      this.backend.put('company_prefe_product_pre_promo/' + e.id, {

        image: reader

      }).subscribe(

        (data: any) => {

          this.loading.hideLoading();

          this.companyPrefeProduct[index].id = data.data.id;

          this.companyPrefeProduct[index].categoryId = data.data.categoryId;

          this.companyPrefeProduct[index].companyId = data.data.companyId;

          this.companyPrefeProduct[index].category = data.data.category;

          this.companyPrefeProduct[index].subCategory = data.data.subcategory;


          this.companyPrefeProduct[index].subCategoryId = data.data.subCategoryId;

          this.companyPrefeProduct[index].urlImage = data.data.urlImage;

          this.toast.displayWebsiteRelatedToast(
            this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
          );

          this.changeDetectorRef.detectChanges();

        },
        (error) => {

          this.loading.hideLoading();

          this.toast.displayHTTPErrorToast(

            error.status,

            error.error.error,

          );
        },
      );
    } else {

      this.companyPrefeProduct[index].urlImage = reader;

      this.companyPrefeProduct[index].image = reader;

      this.changeDetectorRef.detectChanges();
      /*  this.backend.post('company_prefe_product_pre_promo',{

         image: reader,
 
     }).pipe(take(1)).subscribe(
           (data: any) => {

           this.companyPrefeProduct[index].id = data.data.id;

           this.companyPrefeProduct[index].categoryId = data.data.categoryId;
      
           this.companyPrefeProduct[index].companyId = data.data.companyId;
      
           this.companyPrefeProduct[index].category = data.data.category;
      
           this.companyPrefeProduct[index].urlImage = data.data.urlImage;
             
           this.toast.displayWebsiteRelatedToast(

               this._translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),

           );

           this.changeDetectorRef.detectChanges();
              
           },
           (error) => {

               this.toast.displayHTTPErrorToast(

                   error.status,

                   error.error.error,

               );
           },
       ); */
    }


  }


  changeSubcategoryPromotion(event: any, data: any){
    
    const index = this.companyPrefeProduct.indexOf(data);

    const exist = this.companyPrefeProduct.find(x => x.companyId === Number(event));


    let specification = this.companyPrefeProduct.find(x => x.id == data.id);


    if (data.id > 0) {


      if (specification.id > 0 && event.length > 0) {

        this.updateSubcategory(data, event);

      }
    } else {

      if (event.length > 0) {

        this.companyPrefeProduct[index].subCategoryId = event;
      }


    }
  }

  changeSelectPromotion(event: any, data: any) {

    const index = this.companyPrefeProduct.indexOf(data);


    this.loadSubCategory(event, index);

    const exist = this.companyPrefeProduct.find(x => x.companyId === Number(event));


    let specification = this.companyPrefeProduct.find(x => x.id == data.id);


    if (data.id > 0) {


      if (specification.id > 0 && event.length > 0) {

        this.updatePromotion(data, event);

      }
    } else {

      if (event.length > 0) {

        this.companyPrefeProduct[index].categoryId = event;
        this.companyPrefeProduct[index].subCategoryId = undefined;
      }


    }

  }

  loadSubCategory(categoryId, index){

   /*  this.loadingCompanyList = 'loading'; */

    setTimeout(() => {
      this.backend.get('sub_category?categoryId=' + categoryId).pipe(take(1)).subscribe(
        (data: any) => {
          // obtiene las subcategorías
/* 

          this.loadingCompanyList = 'success'; */

          this.subcategory[index] = data.data;

          this.changeDetectorRef.detectChanges();
        },
        (error) => {

          this.toast.displayHTTPErrorToast(
            error.status,
            error.error.error,
          );
        },
      );
    }, 500);

  }

  //servicio de crear promocion desde configuración uno a uno

  createPromotion(data: any, event: any) {


    const index = this.companyPrefeProduct.indexOf(data);

    this.backend.post('company_prefe_product_pre_promo', {

      categoryId: event,

    }).pipe(take(1)).subscribe((response) => {


      this.companyPrefeProduct[index].id = response.data.id;

      this.companyPrefeProduct[index].categoryId = response.data.categoryId;

      this.companyPrefeProduct[index].companyId = response.data.companyId;

      this.companyPrefeProduct[index].category = response.data.category;

      this.companyPrefeProduct[index].urlImage = response.data.urlImage;

      console.log()

      this.toast.displayWebsiteRelatedToast(
        this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
        this._translate.instant('GENERAL.ACCEPT')
      )

      this.changeDetectorRef.detectChanges();

    }, (error) => {
      this.toast.displayHTTPErrorToast(
        error.error.code,
        error.error,
      );
    });
  }

  //editar promocion desde configuración uno a uno

  async updateSubcategory(data: any, event: any){
    await this.loading.showLoading();

    const index = this.companyPrefeProduct.indexOf(data);

    this.backend.put('company_prefe_product_pre_promo/' + data.id, {

      categoryId: this.companyPrefeProduct[index].categoryId,
      subCategoryId: event,


    }).pipe(take(1)).subscribe((response) => {

      this.loading.hideLoading();

      this.companyPrefeProduct[index].id = response.data.id;

      this.companyPrefeProduct[index].categoryId = response.data.categoryId;

      this.companyPrefeProduct[index].subCategoryId = response.data.subCategoryId;

      this.companyPrefeProduct[index].subCategory = response.data.subCategory;

      this.companyPrefeProduct[index].companyId = response.data.companyId;

      this.companyPrefeProduct[index].category = response.data.category;

      this.companyPrefeProduct[index].urlImage = response.data.urlImage;

      this.toast.displayWebsiteRelatedToast(
        this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
        this._translate.instant('GENERAL.ACCEPT')
      );

      this.changeDetectorRef.detectChanges();

    }, (error) => {

      this.loading.hideLoading();

      this.toast.displayHTTPErrorToast(
        error.error.code,
        error.error,
      );

      this.changeDetectorRef.detectChanges();

    },
    );
  }

  async updatePromotion(data: any, event: any) {

    await this.loading.showLoading();

    const index = this.companyPrefeProduct.indexOf(data);

    this.backend.put('company_prefe_product_pre_promo/' + data.id, {

      categoryId: event,
      subCategoryId: null,


    }).pipe(take(1)).subscribe((response) => {

      this.loading.hideLoading();

      this.companyPrefeProduct[index].id = response.data.id;

      this.companyPrefeProduct[index].categoryId = response.data.categoryId;

      this.companyPrefeProduct[index].subCategoryId = null;

      this.companyPrefeProduct[index].subCategory = null;

      this.companyPrefeProduct[index].companyId = response.data.companyId;

      this.companyPrefeProduct[index].category = response.data.category;

      this.companyPrefeProduct[index].urlImage = response.data.urlImage;

      this.toast.displayWebsiteRelatedToast(
        this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
        this._translate.instant('GENERAL.ACCEPT')
      );

      this.changeDetectorRef.detectChanges();

    }, (error) => {

      this.loading.hideLoading();

      this.toast.displayHTTPErrorToast(
        error.error.code,
        error.error,
      );

      this.changeDetectorRef.detectChanges();

    },
    );
  }

  async deleteImgPRomotion(data: any) {

    const index = this.companyPrefeProduct.indexOf(data);


    if (!data.id) {


      this.companyPrefeProduct[index].urlImage = '';

      this.companyPrefeProduct[index].image = '';

      this.changeDetectorRef.detectChanges();

    } else {

      await this.loading.showLoading();

      this.backend.put('company_prefe_product_pre_promo_get/' + data.id).pipe(take(1)).subscribe((response) => {

        this.loading.hideLoading();

        this.companyPrefeProduct[index].id = response.data.id;

        this.companyPrefeProduct[index].categoryId = response.data.categoryId;

        this.companyPrefeProduct[index].companyId = response.data.companyId;

        this.companyPrefeProduct[index].category = response.data.category;

        this.companyPrefeProduct[index].urlImage = response.data.urlImage;

        this.toast.displayWebsiteRelatedToast(
          this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
          this._translate.instant('GENERAL.ACCEPT')
        );

        this.changeDetectorRef.detectChanges();

      }, (error) => {

        this.loading.hideLoading();

        this.toast.displayHTTPErrorToast(
          error.error.code,
          error.error,
        );

        this.changeDetectorRef.detectChanges();

      });
    }



  }

  Submit() {


    let productPrePromo: any = [];

    this.companyPrefeProduct.forEach(element => {

      productPrePromo.push({

        categoryId: Number(element.categoryId),

        image: element.image,

        subCategoryId: Number(element.subCategoryId)

      });

    });

    this.publicPromotion(productPrePromo);
  }

  async publicPromotion(productPrePromo: any) {

    await this.loading.showLoading();

    this.backend.post('company_prefe_product_pre_promo', { productPrePromo: productPrePromo }).pipe(take(1)).subscribe((response) => {

      this.loading.hideLoading();

      this.getCompanypreference();

      this.toast.displayWebsiteRelatedToast(
        this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
        this._translate.instant('GENERAL.ACCEPT')
      )

      this.changeDetectorRef.detectChanges();

    }, (error) => {
      this.loading.hideLoading();
      this.toast.displayHTTPErrorToast(
        error.error.code,
        error.error,
      );
    });

  }

  showBtn() {

    let show = false;

    this.companyPrefeProduct.forEach(element => {

      show = element.id ? element.id : false;

    });

    return show;
  }

  showBtnCreate() {

    let show = false;

    this.companyPrefeProduct.forEach(element => {

      show = !element.id ? !element.id : false;

    });

    return show;
  }

  DisabledBtn() {

    let disabled = false;

    this.companyPrefeProduct.forEach(element => {

      disabled = !element.categoryId || !element.urlImage ? !element.categoryId || !element.urlImage : false;

    });

    return disabled;
  }

}
