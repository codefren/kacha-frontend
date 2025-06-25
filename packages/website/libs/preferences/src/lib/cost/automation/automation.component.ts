import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { LoadingService, ToastService, dateToObject, objectToString } from '@optimroute/shared';
import { take } from 'rxjs/operators';

import * as moment from 'moment';

@Component({
  selector: 'easyroute-automation',
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.scss']
})
export class AutomationComponent implements OnInit {

  days = [];
  companyPreferenceCoste: any = {
    lowerDriverCostAutomatically: false,
    lowerSalary: false,
    loweNightlyOvertime: false,
    lowerExtraDaytimeHours: false,
    lowerExtraDays: false,
    lowerSupplements: false,
    lowerVehicleCostAutomatically: false,
    lowerVehicleAcquisition: false,
    lowerInsurance: false,
    lowerVacancyCostAutomatically: false,
    lowerSalaryDay: 1,
    lowerSupplementsDay: 1,
    lowerVehicleAcquisitionDay: 1,
    lowerInsuranceDay: 1,
    allowApplyAnnualCost: false,
    divideCostIntoTwelveMonths:false,
    dayToSplitCost: 1,
    lowerCostOnceYear: false,
    lowerCostOnceYearDate:'',
    lowerOtherMonthlyExpenses: false,
    lowerOtherMonthlyExpensesDay:1,
    lowerOtherMonthlyExpensesVehicle: false,
    lowerOtherMonthlyExpensesDayVehicle:1

  };

  min: NgbDateStruct = dateToObject(moment().format('YYYY-MM-DD'));

  dateSearchFrom: FormControl = new FormControl(null);

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private backendService: BackendService,
    private loadingService: LoadingService,
    private _modalService: NgbModal,
    private translate: TranslateService,
    private toastService: ToastService
  ) { }


  ngOnInit() {

    for (let index = 1; index < 31; index++) {
     this.days.push(index);
    }
    this.load();
  }

  load() {

    this.loadingService.showLoading();

    this.backendService.get('company_preference_cost').pipe(take(1)).subscribe(({ data }) => {

      this.loadingService.hideLoading();

      this.companyPreferenceCoste = data;

      if (this.companyPreferenceCoste.lowerCostOnceYearDate) {

        this.dateSearchFrom = new FormControl(dateToObject(this.companyPreferenceCoste.lowerCostOnceYearDate));

      }

      this.changeDetectorRef.detectChanges();

    }, (error) => {
      this.loadingService.hideLoading();
      this.toastService.displayHTTPErrorToast(
        error.error.code,
        error.error,
      );
    });

  }

  changeUpdatefield(etiqueta: string, value: any) {

    let data = {

      [etiqueta]: value

    };

    this.loadingService.showLoading();

    this.backendService.post('company_preference_cost', data).pipe(take(1))

    .subscribe((data)=>{

      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
        this.translate.instant('GENERAL.ACCEPT'),
      );

      this.load();

    }, error => {

      this.loadingService.hideLoading();

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);

    });

  }

  changeCostAnual(etiqueta: string, value: any){


    let data: any;

    if (etiqueta ==='divideCostIntoTwelveMonths') {

      data = {
        
        [etiqueta]: value,

        lowerCostOnceYear: false
  
      };

      this.companyPreferenceCoste.divideCostIntoTwelveMonths = value;

      this.companyPreferenceCoste.lowerCostOnceYear = false;

    } else {
     
      data = {

        [etiqueta]: value,

        divideCostIntoTwelveMonths: false
  
      };
      
      this.companyPreferenceCoste.lowerCostOnceYear = value;

      this.companyPreferenceCoste.divideCostIntoTwelveMonths = false;
    }

    this.loadingService.showLoading();

    this.backendService.post('company_preference_cost', data).pipe(take(1))

    .subscribe((data)=>{

      this.toastService.displayWebsiteRelatedToast(
        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
        this.translate.instant('GENERAL.ACCEPT'),
      );

      this.load();

    }, error => {

      this.loadingService.hideLoading();

      this.toastService.displayHTTPErrorToast(error.status, error.error.error);

    });

  

  }
  changeDate(name: string, dataEvent: NgbDate) {

    if (name == 'from') {

      this.changeUpdatefield('lowerCostOnceYearDate', objectToString(dataEvent));

    }

  }

}
