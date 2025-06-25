import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalModifyFuelComponent } from './modal-modify-fuel/modal-modify-fuel.component';
import { StateVehiclesService } from '../../../../../state-vehicles/src/lib/state-vehicles.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { take } from 'rxjs/operators';
import { ModalApplySalaryCostComponent } from 'libs/shared/src/lib/components/modal-apply-salary-cost/modal-apply-salary-cost.component';
import { ModalApplyRentingCostComponent } from '@optimroute/shared';
declare var $: any;

@Component({
  selector: 'easyroute-cost-list',
  templateUrl: './cost-list.component.html',
  styleUrls: ['./cost-list.component.scss']
})
export class CostListComponent implements OnInit {

  select: string ='drivers';

  refreshVehicle: boolean = false;

  refreshDrivers : boolean = false;

  change = {
      drivers: 'drivers',
      vehicles: 'vehicles',
      unemployment: 'unemployment',
  };

  constructor(
    private router: Router,
    private detectChanges: ChangeDetectorRef,
    private _modalService: NgbModal,
    private vehicleService:StateVehiclesService,
    private _translate: TranslateService,
    private toast: ToastService,
    private loading: LoadingService

  ) { }

  ngOnInit(
    
  ) {
  }

  changePage(name: string) {
        
    this.select = this.change[name];

    this.detectChanges.detectChanges();
  }

  openSetting() {

    //this.router.navigate(['cost/settings']);
    this.router.navigateByUrl('/preferences?option=costStructure');
  }

  openModalModifyFuel() {

    this.refreshVehicle = false;

    const modal = this._modalService.open(ModalModifyFuelComponent, {
      backdropClass: 'modal-backdrop-ticket',
      centered: true,
      windowClass:'modal-add-fuel',
      size:'lg'
    });
  
    modal.result.then(
      (data) => {
        if (data) {
          this.refreshVehicle = true;
          this.detectChanges.detectChanges();
        }      
      },
      (reason) => {
        
      },
    ); 
  }

  importFuel(file: any) {

    this.refreshVehicle = false;

    //let mee : any = this.me;

    let excel: FormData = new FormData();

    excel.append('import_file', file, file.name);

   // excel.append('me', mee);

    this.loading.showLoading();

    this.vehicleService.loadFuelByExcel(excel).pipe(take(1)).subscribe(

        (resp: any) => {

            this.loading.hideLoading();

            this.refreshVehicle = true;

            this.detectChanges.detectChanges();

            this.toast.displayWebsiteRelatedToast(
                'Archivo procesado satisfactoriamente.',
                this._translate.instant('GENERAL.ACCEPT'),
            );

            $("input[type='file']").val('');
          
        },
        
        (error: any) => {

            $("input[type='file']").val('');

            this.loading.hideLoading();

            this.toast.displayHTTPErrorToast(error.error.code, error.error);
        },
    );

}

openModalApplySalaryCost() {

  this.refreshDrivers = false;
  
  const modal = this._modalService.open(ModalApplySalaryCostComponent, {
    backdropClass: 'modal-backdrop-ticket',
    centered: true,
    windowClass:'modal-salary-cost',
    size:'md'
  });

  modal.result.then(

    (data) => {

      if (data) {

        this.refreshDrivers = data;

        this.detectChanges.detectChanges();
      
      }      
    },
    (reason) => {
      
    },
  ); 
}

importSalary(file: any) {

  this.refreshDrivers = false;

 // let mee : any = this.me;
  let excel: FormData = new FormData();

  excel.append('import_file', file, file.name);

  //excel.append('me', mee);

  this.loading.showLoading();

  this.vehicleService.loadCostSalaryByExcel(excel).subscribe(
      (resp: any) => {

          this.loading.hideLoading();

          this.refreshDrivers = true;

          this.detectChanges.detectChanges();

          this.toast.displayWebsiteRelatedToast(
              'Archivo procesado satisfactoriamente.',
              this._translate.instant('GENERAL.ACCEPT'),
          );

          $("input[type='file']").val('');
        
      },
      (error: any) => {

          $("input[type='file']").val('');

          this.loading.hideLoading();

          this.toast.displayHTTPErrorToast(error.error.code, error.error);
      },
  );

}

openModalLoadRentingCost() {
  
  const modal = this._modalService.open(ModalApplyRentingCostComponent, {
    centered: true,
      size: 'xl',
      backdrop: 'static',
      backdropClass: 'modal-backdrop-ticket',
      windowClass: 'modal-travel-retainer-client',
  });

  modal.result.then(
    (data) => {
      if (data) {
      
      }      
    },
    (reason) => {
      
    },
  );
}

importRenting(file: any) {

  this.refreshVehicle = false;

  let excel: FormData = new FormData();

  excel.append('import_file', file, file.name);

  this.loading.showLoading();

  this.vehicleService.loadCostRentingByExcel(excel).subscribe(
      (resp: any) => {

          this.loading.hideLoading();

          this.refreshVehicle = true;

          this.detectChanges.detectChanges();

          this.toast.displayWebsiteRelatedToast(
              'Archivo procesado satisfactoriamente.',
              this._translate.instant('GENERAL.ACCEPT'),
          );

          $("input[type='file']").val('');
        
      },
      (error: any) => {
          $("input[type='file']").val('');
          this.loading.hideLoading();
          this.toast.displayHTTPErrorToast(error.error.code, error.error);
      },
  );

}


}
