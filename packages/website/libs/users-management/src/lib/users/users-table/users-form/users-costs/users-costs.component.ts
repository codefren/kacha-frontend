import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BackendService } from '../../../../../../../backend/src/lib/backend.service';
import { LoadingService } from '../../../../../../../shared/src/lib/services/loading.service';
import { ToastService } from '../../../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { take, filter } from 'rxjs/operators';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from '@optimroute/shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
@Component({
  selector: 'easyroute-users-costs',
  templateUrl: './users-costs.component.html',
  styleUrls: ['./users-costs.component.scss']
})
export class UsersCostsComponent implements OnInit, OnChanges {

  @Input() idParam: any;

  @Input() userTypeSelect:any;

  @Input() me: boolean;

  costForm: FormGroup;

  total_cost: number = 0;
  salary: number = 0;
  segurity: number = 0;
  changedUpdate = false;

  costList: any = [];
  userPersonalCostList: any = [];

  showProvidersType: boolean = true;
  showProviders: boolean = true;
  showConcept: boolean = true;


  otherMonthlyExpensesForm: FormGroup;
  providerTypeList: any = []; // Listado tipos de proveedores
  providerList: any[][] = []; //Listado de proveedores
  conceptList: any[][] = []; //Listado concepto de proveedores
  otherMonthlyExpensesUser: any = []; //Listado de los que lleva cargado el usuario
  overtimeType: any[] = [];
  overtimeTypeByUser: any = [];

  rateForm :FormGroup;
  rateConceptList: any = [];
  userRateChargingList: any = [];
  showRatesType: boolean = true;

  companyPreferenceCoste: any = {
    allowApplyAnnualCost: false,
    divideCostIntoTwelveMonths:false,
    lowerCostOnceYear: false,

  };


  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private backendService: BackendService,
    private detectChange: ChangeDetectorRef,
    private modal: NgbModal,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {

    this.loadAll();


  }




  loadOvertimeType() {
    this.backendService.get('overtime_type').pipe(take(1)).subscribe(({ data }) => {
      this.overtimeType = data;
      this.detectChange.detectChanges();
    })
  }

  loadOverTimeTypeByUser() {
    this.backendService.get('overtime_type_user_list/' + this.idParam).pipe(take(1)).subscribe(({ data }) => {
      this.overtimeTypeByUser = data;
      this.detectChange.detectChanges();
    })
  }

  loadOtherMonthlyExpensesUserlist() {
    this.backendService.get('other_monthly_expenses_user_list/' + this.idParam).pipe(take(1)).subscribe(({ data }) => {
      this.otherMonthlyExpensesUser = data;

      console.log(data,'data que llena esta parte');

      if (data && data.length > 0) {
        data.forEach((element, index) => {
          const concept = new FormGroup({
            id: new FormControl(element.id),
            userId: new FormControl(this.idParam),
            providerTypeId: new FormControl(element.providerTypeId),
            providerId: new FormControl({ value: element.providerId, disabled: true }),
            providerTypeConceptId: new FormControl({ value: element.providerTypeConceptId, disabled: true }),
            price: new FormControl({ value: element.price, disabled: true }),
            new: new FormControl(false),
            paymentType: new FormControl(element.paymentType),
          });
          this.getSelectProvider(element.providerTypeId, index);
          this.getSelectConcept(element.providerId, index);
          this.conceptOtherMonthlyExpenses.push(concept);
          this.conceptOtherMonthlyExpenses.controls[index].get('price').enable();
          this.conceptOtherMonthlyExpenses.controls[index].get('price').updateValueAndValidity();

          this.detectChange.detectChanges();
        })
      }
      this.detectChange.detectChanges();
    })
  }

  loadAll() {
    this.loadPreferencesCost();
    this.getSeletCost();
    this.getProvidersTypeList();
    this.loadOvertimeType();
    this.loadOverTimeTypeByUser();
    this.getRatesTypeList();
    this.load();
  }

  load() {

    if (this.idParam !== 'new') {

      this.validaciones();

      this.loadingService.showLoading();

      this.backendService.get(`get_user_salary/${this.idParam}`).pipe(take(1)).subscribe(
        ({ data }) => {

          this.salary = data.grossSalary;

          /* this.segurity = Number(data.socialSecurity);

          let total = this.salary + this.salary

          this.total_cost = Number(total.toFixed(2)); */

          this.detectChange.detectChanges();

          this.loadingService.hideLoading();

        },
        (error) => {
          this.toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
          );
        },
      );

    }

  }

  loadPreferencesCost() {

    this.loadingService.showLoading();

    this.backendService.get('company_preference_cost').pipe(take(1)).subscribe(({ data }) => {

      this.loadingService.hideLoading();

      this.companyPreferenceCoste = data;

      console.log( this.companyPreferenceCoste, ' this.companyPreferenceCoste');
      this.detectChange.detectChanges();

    }, (error) => {
      this.loadingService.hideLoading();
      this.toastService.displayHTTPErrorToast(
        error.error.code,
        error.error,
      );
    });

  }

  checkedOverTime(item: any) {
    const overtime = this.overtimeTypeByUser.find(x => x.overtimeTypeId == item.id);
    return overtime && overtime.isActive ? overtime.isActive : false;
  }

  getValueOverTime(item: any) {
    const overtime = this.overtimeTypeByUser.find(x => x.overtimeTypeId == item.id);
    return overtime && overtime.price ? overtime.price : 0;
  }

  validaciones() {

    this.costForm = this.fb.group({

      concepts: new FormArray([]),

    });

    this.otherMonthlyExpensesForm = this.fb.group({

      conceptOtherMonthlyExpenses: new FormArray([]),

    });

    /* formulario de rates */

    this.rateForm = this.fb.group({

      rate:  new FormArray([]),
      
    });

    this.getUserPersonalCost();

    this.loadOtherMonthlyExpensesUserlist();

    // this.getUserRateLoad();

  }

  // Salario

  validateInput(value: any, etiqueta: string) {

    if (etiqueta == 'grossSalary') {

      if (this.changedUpdate) {
        this.salary = Number(value);

        this.updateSalary(value, etiqueta);

        this.changedUpdate = false
      }

    }

    if (etiqueta == 'socialSecurity') {

      if (this.changedUpdate) {
        this.segurity = Number(value);

        this.updateSalary(value, etiqueta);
        this.changedUpdate = false
      }


    }

    this.detectChange.detectChanges();

  }

  updateSalary(value: any, etiqueta: string) {

    let data = {

      [etiqueta]: value
    };

    this.loadingService.showLoading();

    this.backendService.put(`user_update_salary/${this.idParam}`, data).pipe(take(1)).subscribe(

      ({ data }) => {

        this.load();

        this.toastService.displayWebsiteRelatedToast(
          this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
          this.translate.instant('GENERAL.ACCEPT'),
        );

        this.loadingService.hideLoading();

      },
      (error) => {
        this.loadingService.hideLoading();
        this.toastService.displayHTTPErrorToast(
          error.status,
          error.error.error,
        );
      },
    );
  }




  // Costes extras

  getSeletCost() {
    this.backendService.get(`company_fee_cost_active_list`).pipe(take(1)).subscribe(
      ({ data }) => {

        this.costList = data;

        this.detectChange.detectChanges();

        this.loadingService.hideLoading();

      },
      (error) => {
        this.toastService.displayHTTPErrorToast(
          error.status,
          error.error.error,
        );
      },
    );
  }

  getUserPersonalCost() {

    this.backendService.get(`user_fee_cost_list/` + this.idParam).pipe(take(1)).subscribe(

      ({ data }) => {

        this.userPersonalCostList = data;

        this.getChargingConcepts();

        this.detectChange.detectChanges();

        this.loadingService.hideLoading();

      },
      (error) => {
        this.toastService.displayHTTPErrorToast(
          error.status,
          error.error.error,
        );
      },
    );
  } 

  getChargingConcepts() {

    this.userPersonalCostList.forEach((item) => {

      const concept = new FormGroup({

        id: new FormControl(item.id),

        userId: new FormControl(item.userId),

        name: new FormControl(item.name),

        price: new FormControl(item.price),

        companyPersonalCostId: new FormControl(item.companyPersonalCostId),

        predetermined: new FormControl(item.predetermined),

        companyFeeCostId: new FormControl(item.companyFeeCostId)

      });

      this.rate.push(concept);

    });

  }

  addConcept() {

    const concept = new FormGroup({
      id: new FormControl(0),
      name: new FormControl(''),
      userId: new FormControl(this.idParam),
      companyPersonalCostId: new FormControl(''),
      price: new FormControl(0),

    });

    this.concepts.push(concept);

    this.detectChange.detectChanges();

  }

  get concepts() {

    return this.costForm.get('concepts') as FormArray;

  }
  //add rates

  addRates() {

    const addRate = new FormGroup({

      id: new FormControl(0),

      userId: new FormControl(this.idParam),

      price: new FormControl(0),

      companyFeeCostId: new FormControl(''),

      predetermined: new FormControl(false),

    });

    this.rate.push(addRate);

    console.log(addRate, 'para cargar el formulario')

    this.detectChange.detectChanges();

  }

  get rate() {

    return this.rateForm.get('rate') as FormArray;

  }



  /* si hay datos cargados */

  getUserRateLoad() {

    this.backendService.get(`user_fee_cost_list/` + this.idParam).pipe(take(1)).subscribe(

      ({ data }) => {

        this.userRateChargingList = data;

        this.getChargingRates();

        this.detectChange.detectChanges();

        this.loadingService.hideLoading();

      },
      (error) => {
        this.toastService.displayHTTPErrorToast(
          error.status,
          error.error.error,
        );
      },
    );
  }

    /* cuando llenar datos a formulario datos */

    getChargingRates() {

      this.userRateChargingList.forEach((item) => {
  
        const concept = new FormGroup({
  
          id: new FormControl(item.id),
  
          userId: new FormControl(item.userId),
  
          price: new FormControl(item.price),
  
          companyFeeCostId: new FormControl(item.companyFeeCostId),
  
          predetermined: new FormControl(item.predetermined),
  
        });
  
        this.rate.push(concept);
  
      });
  
    }

    /* metodo para llenar el price automatico */

    changeSelectRateType(value: any, data: any, index: any, target: any) {


      if (this.idParam > 0) {
  
        if (data.value.companyFeeCostId > 0) {

          /* busca el precio del concepto y lo agrega automaticamente */

          let serchPrice = this.rateConceptList.find( x => x.id == value);

          this.rate.controls[index].get('price').setValue(serchPrice.price);

          this.rate.controls[index].get('price').updateValueAndValidity();

          this.loadActions(data.value, index)

        } else {

          this.rate.controls[index].get('price').setValue('');


          this.rate.controls[index].get('price').updateValueAndValidity();
        }
  
      }
  
    }

    /* funcion de desición dado si es crear o actualizar */

    loadActions(data: any, index:any){

      if (data.id > 0) {

        /* manda a actualizar */

        this.UpdateRateUser(data ,index);

      } else {

        /* manda a crear */

        this.createRateUser(data ,index);

      }

    }
  
    /* crear rate */

    createRateUser( data: any , index: any) {

      let dataform = _.cloneDeep(data);

      delete dataform.id;

      this.loadingService.showLoading();
  
      this.backendService.post('user_fee_cost', dataform).pipe(take(1)).subscribe((data) => {

        this.toastService.displayWebsiteRelatedToast(
          this.translate.instant('Tarifa creada satisfactorimente'),
          this.translate.instant('GENERAL.ACCEPT'),
      );

        this.rate.controls[index].get('id').setValue(data.data.id);

        this.rate.controls[index].get('userId').setValue(data.data.userId);

        this.rate.controls[index].get('price').setValue(data.data.price);

        this.rate.controls[index].get('companyFeeCostId').setValue(data.data.companyFeeCostId);
        
        this.rate.controls[index].get('predetermined').setValue(data.data.predetermined);
  
        this.loadingService.hideLoading();
  
        this.detectChange.detectChanges();
  
      }, error => {

        this.loadingService.hideLoading();
  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);

      });
  
    }

    /* actualizar rate */
    UpdateRateUser( data: any , index: any) {


      let dataform = _.cloneDeep(data);

      this.loadingService.showLoading();
  
      this.backendService.put('user_fee_cost/'+ dataform.id, dataform).pipe(take(1)).subscribe((data) => {


        this.toastService.displayWebsiteRelatedToast(
          this.translate.instant('Tarifa actualizada satisfactorimente'),
          this.translate.instant('GENERAL.ACCEPT'),
      );

        this.rate.controls[index].get('id').setValue(data.data.id);

        this.rate.controls[index].get('userId').setValue(data.data.userId);

        this.rate.controls[index].get('price').setValue(data.data.price);

        this.rate.controls[index].get('companyFeeCostId').setValue(data.data.companyFeeCostId);
        
        this.rate.controls[index].get('predetermined').setValue(data.data.predetermined);
      
        this.loadingService.hideLoading();
  
        this.detectChange.detectChanges();
  
      }, error => {

        this.loadingService.hideLoading();
  
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);

      });
  
    }

    /* delete rate */
    deleteRate(data: any, index: number = null) {

      if (data.value.id > 0) {
  
        this.backendService
          .delete('user_fee_cost/' + data.value.id)
          .pipe(take(1))
          .subscribe(
            (response) => {
  
              this.rate.controls.splice(index, 1);
  
              this.toastService.displayWebsiteRelatedToast(
                this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                this.translate.instant('GENERAL.ACCEPT'),
              );
  
              this.loadAll()
  
              this.detectChange.detectChanges();
            },
            (error) => {
              this.toastService.displayHTTPErrorToast(
                error.error.code,
                error.error,
              );
            },
          );
  
  
      } else {
  
        this.rate.controls.splice(index, 1);
  
        this.loadAll()
  
        this.detectChange.detectChanges();
  
      }
  
    }

    changePredetermine(data: any, index: any){

    
      if (data.id > 0) {

        this.loadActions(data, index);

      }

      this.rateForm.value.rate.forEach((element, index) => {

        if (element.id != data.id) {

          this.rate.controls[index].get('predetermined').setValue(false);

          element.predetermined= false;

        }

        return
      });

     
      this.rateForm.get('rate').updateValueAndValidity();
      

    }
  /* end add rates */

  deleteComponent(data: any, index: number = null) {

    if (data.value.id > 0) {

      this.backendService
        .delete('user_personal_cost/' + data.value.id)
        .pipe(take(1))
        .subscribe(
          (response) => {

            this.concepts.controls.splice(index, 1);

            this.toastService.displayWebsiteRelatedToast(
              this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
              this.translate.instant('GENERAL.ACCEPT'),
            );

            this.loadAll()

            this.detectChange.detectChanges();
          },
          (error) => {
            this.toastService.displayHTTPErrorToast(
              error.error.code,
              error.error,
            );
          },
        );


    } else {

      this.concepts.controls.splice(index, 1);

      this.loadAll()

      this.detectChange.detectChanges();

    }

  }

  existConcept(companyPersonalCostId: number) {

    return this.concepts.value.find(x => Number(x.companyPersonalCostId) === companyPersonalCostId) ? true : false;
  }

  changeImporte(value: any, data: any, index: any) {

    if (this.idParam > 0) {

      if (data.value.id > 0) {

        this.editProvideTypeConcept(data.value, index);

      } else {

        this.addProvideTypeConcept(data.value, index);

      }

    }

  }

  changeSelect(value: any, data: any, index: any, target: any) {


    if (this.idParam > 0) {

      if (data.value.id > 0) {

        this.editProvideTypeConcept(data.value, index);

      } else {

        this.addProvideTypeConcept(data.value, index);

      }

    }
  }

  editProvideTypeConcept(data: any, index: any) {

    if (data.companyPersonalCostId && data.price) {
      this.backendService
        .put('user_personal_cost/' + data.id, data)
        .pipe(take(1))
        .subscribe(
          (response) => {

            this.concepts.controls[index].get('id').setValue(response.data.id);

            this.concepts.controls[index].get('userId').setValue(response.data.userId);

            this.concepts.controls[index].get('price').setValue(response.data.price);

            this.concepts.controls[index].get('companyPersonalCostId').setValue(response.data.companyPersonalCostId);

            this.toastService.displayWebsiteRelatedToast(

              this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),

              this.translate.instant('GENERAL.ACCEPT'),

            );

            this.detectChange.detectChanges();
          },
          (error) => {
            this.toastService.displayHTTPErrorToast(error.error.code, error.error);
            this.detectChange.detectChanges();
          },
        );
    }

  }

  addProvideTypeConcept(data: any, index: any) {

    let dataform = _.cloneDeep(data);

    if (data.companyPersonalCostId && data.price) {

      this.backendService.post('user_personal_cost', dataform).pipe(take(1)).subscribe((response) => {

        this.concepts.controls[index].get('id').setValue(response.data.id);

        this.concepts.controls[index].get('userId').setValue(response.data.userId);

        this.concepts.controls[index].get('price').setValue(response.data.price);


        this.concepts.controls[index].get('companyPersonalCostId').setValue(response.data.companyPersonalCostId);

        this.toastService.displayWebsiteRelatedToast(

          this.translate.instant('CONFIGURATIONS.REGISTRATION'),

          this.translate.instant('GENERAL.ACCEPT'),

        );

        this.detectChange.detectChanges();

      }, (error) => {
        this.toastService.displayHTTPErrorToast(error.error.code, error.error);
        this.detectChange.detectChanges();
      },)
    }


  }



  //Coste  Horas extras

  changeActive(value: any, item: any) {
    const overtime = this.overtimeTypeByUser.find(x => x.overtimeTypeId == item.id);
    if (overtime) {
      this.backendService.put('overtime_type_user/' + overtime.id, {
        price: overtime.price,
        isActive: value
      }).pipe(take(1)).subscribe((data) => {
        this.toastService.displayWebsiteRelatedToast(
          this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
          this.translate.instant('GENERAL.ACCEPT')
        );
      });
    } else {
      this.backendService.post('overtime_type_user', {
        userId: this.idParam,
        overtimeTypeId: item.id,
        price: 0,
        isActive: value
      }).pipe(take(1)).subscribe(({ data }) => {
        this.overtimeTypeByUser.push(data);
        this.toastService.displayWebsiteRelatedToast(
          this.translate.instant('CONFIGURATIONS.REGISTRATION'),
          this.translate.instant('GENERAL.ACCEPT')
        );
      });
    }
  }

  changeValue(value: any, item: any) {
    const overtime = this.overtimeTypeByUser.find(x => x.overtimeTypeId == item.id);
    if (overtime) {
      this.backendService.put('overtime_type_user/' + overtime.id, {
        price: value,
        isActive: overtime.isActive
      }).pipe(take(1)).subscribe((data) => {
        this.toastService.displayWebsiteRelatedToast(
          this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
          this.translate.instant('GENERAL.ACCEPT')
        );
      });
    } else {
      this.backendService.post('overtime_type_user', {
        userId: this.idParam,
        overtimeTypeId: item.id,
        price: value
      }).pipe(take(1)).subscribe(({ data }) => {
        this.overtimeTypeByUser.push(data);
        this.toastService.displayWebsiteRelatedToast(
          this.translate.instant('CONFIGURATIONS.REGISTRATION'),
          this.translate.instant('GENERAL.ACCEPT')
        );
      });
    }
  }



  //Costes Otros gastos mensuales

  getProvidersTypeList() {

    this.showProvidersType = false;

    this.backendService.get('provider_type_for_user').pipe(take(1)).subscribe((data) => {

      this.providerTypeList = data.data;

      this.showProvidersType = true;

      this.detectChange.detectChanges();

    }, error => {

      this.showProvidersType = true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  //get rates settings

  getRatesTypeList() {

    this.showRatesType = false;

    this.backendService.get('company_fee_cost_active_list').pipe(take(1)).subscribe((data) => {

      this.rateConceptList = data.data;

      this.showRatesType = true;

      this.detectChange.detectChanges();

    }, error => {

      this.showRatesType = true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  changeSelectProviderType(value: any, data: any, index: any, target: any) {

    if (this.idParam > 0) {

      if (data.value.providerTypeId > 0) {

        this.getSelectProvider(data.value.providerTypeId, index);

      }

    }

  }

  getSelectProvider(providerTypeId: number, index: any) {

    this.showProviders = false;
    
    let sentData = {

      providerTypeId: providerTypeId,
  
      providerAssigmentTypeId : 2
  
    }

    this.backendService.post('providers_by_type', sentData).pipe(take(1)).subscribe((data) => {

      this.providerList[providerTypeId] = data.data;

      this.conceptOtherMonthlyExpenses.controls[index].get('providerId').enable();
      this.conceptOtherMonthlyExpenses.controls[index].get('providerId').updateValueAndValidity();

      this.showProviders = true;

      this.detectChange.detectChanges();

    }, error => {

      this.showProviders = true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

  changeSelectProvider(value: any, data: any, index: any, target: any) {

    if (this.idParam > 0) {

      if (data.value.providerId > 0) {

        this.getSelectConcept(data.value.providerId, index);

      }

    }
  }

  getSelectConcept(providerId: number, index: any) {

    this.showConcept = false;

    this.backendService.post('provider_type_concept_by_provider', { providerId: providerId }).pipe(take(1)).subscribe((data) => {

      this.conceptList[providerId] = data.data;

      this.conceptOtherMonthlyExpenses.controls[index].get('providerTypeConceptId').enable();
      this.conceptOtherMonthlyExpenses.controls[index].get('providerTypeConceptId').updateValueAndValidity();

      this.showConcept = true;

      this.detectChange.detectChanges();

    }, error => {

      this.showConcept = true;

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

  changeSelectConcept(value: any, data: any, index: any, target: any) {

    if (this.idParam > 0 && value) {

      if (data.value.providerTypeConceptId > 0) {

        let price = this.conceptList[data.value.providerId].find((x: any) => x.id === Number(data.value.providerTypeConceptId)).price;

        this.conceptOtherMonthlyExpenses.controls[index].get('price').enable();
        this.conceptOtherMonthlyExpenses.controls[index].get('price').setValue(price);
        this.conceptOtherMonthlyExpenses.controls[index].get('price').updateValueAndValidity();

        if (data.value.id > 0) {

          this.editOtherMonthlyExpenses(data.value, index);

        } else {

          this.addOtherMonthlyExpenses(data.value, index);

        }

      }

    }

  }

  deleteOtherMonthlyExpense(data: any, index: number = null) {

    if (data.value.id > 0) {
      const modal = this.modal.open(ConfirmModalComponent, {
        size: 'xs',
        backdropClass: 'customBackdrop',
        centered: true,
        backdrop: 'static',
      });

      modal.componentInstance.message = "¿Está seguro de eliminar?";

      modal.result.then((resp) => {
        if (resp) {
          this.backendService.delete('other_monthly_expenses_user/' + data.value.id).pipe(take(1)).subscribe((data) => {
            this.conceptOtherMonthlyExpenses.controls.splice(index, 1);
            this.detectChange.detectChanges();
          }, error => {
            this.toastService.displayHTTPErrorToast(error.status, error.error.error);
          })
        }
      });


    } else {

      this.conceptOtherMonthlyExpenses.controls.splice(index, 1);

      //  this.loadAll()

      this.detectChange.detectChanges();

    }

  }

  addConceptOtherMonthlyExpenses() {

    const concept = new FormGroup({
      id: new FormControl(0),
      userId: new FormControl(this.idParam),
      providerTypeId: new FormControl(''),
      providerId: new FormControl({ value: '', disabled: true }),
      providerTypeConceptId: new FormControl({ value: '', disabled: true }),
      price: new FormControl({ value: 0, disabled: true }),
      paymentType:new FormControl('1'),
    });

    this.conceptOtherMonthlyExpenses.push(concept);

    this.detectChange.detectChanges();

  }

  get conceptOtherMonthlyExpenses() {

    if (this.otherMonthlyExpensesForm)
      return this.otherMonthlyExpensesForm.get('conceptOtherMonthlyExpenses') as FormArray;

  }

  changeImporteProvider(value: any, data: any, index: any) {

    if (this.idParam > 0) {

      if (data.value.id > 0) {

        this.editOtherMonthlyExpenses(data.value, index);

      } else {

        this.addOtherMonthlyExpenses(data.value, index);

      }

    }

  }

  editOtherMonthlyExpenses(data: any, index: any) {

    const value = this.conceptOtherMonthlyExpenses.controls[index].value;
    this.backendService.put('other_monthly_expenses_user/' + value.id, value).pipe(take(1)).subscribe((data) => {
      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
        this.translate.instant('GENERAL.ACCEPT'),
      );
    }, error => {
      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });

  }

  addOtherMonthlyExpenses(data: any, index: any) {

    const value = this.conceptOtherMonthlyExpenses.controls[index].value;
    this.backendService.post('other_monthly_expenses_user', value).pipe(take(1)).subscribe(({ data }) => {
      this.conceptOtherMonthlyExpenses.controls[index].get('id').setValue(data.id)
      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('CONFIGURATIONS.REGISTRATION'),
        this.translate.instant('GENERAL.ACCEPT')
      );
    }, error => {
      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  redirect(value: any) {
    console.log('value');
   // return
   // this.router.navigate([`/cost/settings/${this.idParam}/${value}/me/${this.me}`]);
    this.router.navigateByUrl(`/preferences?option=${value}`);
  
  }

  redirectProviders(){
    this.router.navigate([`/providers`]);
  }


}
