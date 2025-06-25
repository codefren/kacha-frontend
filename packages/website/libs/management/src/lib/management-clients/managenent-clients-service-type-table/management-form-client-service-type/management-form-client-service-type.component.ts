import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StateEasyrouteService } from '../../../../../../state-easyroute/src/lib/state-easyroute.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../../../../../../shared/src/lib/services/loading.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { CategoryMessages } from '../../../../../../shared/src/lib/messages/category/category.message';
import { ClientServiceTypesSchedule } from '@optimroute/backend';
import { dayTimeAsStringToSeconds, secondsToDayTimeAsString } from '@optimroute/shared';
declare var $: any;
declare function init_plugins();

@Component({
  selector: 'easyroute-management-form-client-service-type',
  templateUrl: './management-form-client-service-type.component.html',
  styleUrls: ['./management-form-client-service-type.component.scss']
})
export class ManagementFormClientServiceTypeComponent implements OnInit {

  actions: any;

  data: any;

  titleTranslate: string;

  clientServiceTypeForm: FormGroup;

  clientServiceTypeSchedule: ClientServiceTypesSchedule;

  sub_category_messages: any;

  loadingCategory: string = 'success';

  showCode: boolean = true;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private _router: Router,
    private stateEasyrouteService: StateEasyrouteService,
    private toastService: ToastService,
    private translate: TranslateService,
    private loading: LoadingService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.load();
  }

  load() {

    if(this.actions !== "new"){

      this.loading.showLoading();

      this.stateEasyrouteService.getClientServiceTypeShedule(this.data.id).subscribe(
        (data: any) => {

          this.loading.hideLoading();

          this.clientServiceTypeSchedule = data.data;

          this.validaciones(this.clientServiceTypeSchedule);

        },
        (error) => {
          this.loading.hideLoading();

          this.toastService.displayHTTPErrorToast(error.status, error.error.error);
        },
      );

    } else {

      this.loading.hideLoading();

      this.clientServiceTypeSchedule = new ClientServiceTypesSchedule();

      this.validaciones(this.clientServiceTypeSchedule);
    }

  }

  close(){
    this.activeModal.close(false);
  }

  validaciones(clientServiceType: ClientServiceTypesSchedule) {

    this.clientServiceTypeForm = this.fb.group({
      name: [clientServiceType.name, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      code: [clientServiceType.code ? clientServiceType.code :'', [Validators.maxLength(30)]],
      timeStart:[clientServiceType.timeStart ? secondsToDayTimeAsString(clientServiceType.timeStart)
        : secondsToDayTimeAsString(0)],
      timeEnd:[clientServiceType.timeEnd  ? secondsToDayTimeAsString(clientServiceType.timeEnd)
        : secondsToDayTimeAsString(0)],
      isActive: [clientServiceType.isActive, [Validators.required]],
    });

    this.clientServiceTypeForm.controls['timeStart'].setValidators([
      this.ValidatorWindowsStart.bind(this.clientServiceTypeForm)
  ]);

  this.clientServiceTypeForm.controls['timeEnd'].setValidators([
      this.ValidatorWindowsEnd.bind(this.clientServiceTypeForm)
  ]);

    let sub_category_messages = new CategoryMessages();
    this.sub_category_messages = sub_category_messages.getCategoryMessages();


  }

  ValidatorWindowsStart(control: FormControl): { [s: string]: boolean } {

    let formulario: any = this;

    if (control.value === formulario.controls['timeEnd'].value) {

        return {
            confirmar: true
        };

    } else if (control.value > formulario.controls['timeEnd'].value) {

        return {
            sutrast: true
        };
    }
    return null;
  }
  
  ValidatorWindowsEnd(control: FormControl): { [s: string]: boolean } {
    let formulario: any = this;
  
    if (control.value < formulario.controls['timeStart'].value) {
  
        return {
  
            sutrast: true
  
        };
    } else if (control.value === formulario.controls['timeStart'].value) {
  
        return {
  
            confirmar: true
  
        };
    }
    return null;
  
  }
  
  
  changetime(event: any, name: string) {
  
    if (event.target.value === '') {
        switch (name) {
            case "timeStart":
                this.clientServiceTypeForm.get('timeStart').setValue(secondsToDayTimeAsString(0));
                this.clientServiceTypeForm.get('timeStart').updateValueAndValidity();
                break;
            case "timeEnd":
                this.clientServiceTypeForm.get('timeEnd').setValue(secondsToDayTimeAsString(86399));
                this.clientServiceTypeForm.get('timeEnd').updateValueAndValidity();
                break;
            default:
                break;
        }
    } else {
        this.clientServiceTypeForm.get('timeStart').updateValueAndValidity();
        this.clientServiceTypeForm.get('timeEnd').updateValueAndValidity();
    }
  
  }



  isFormInvalid(): boolean {
    return !this.clientServiceTypeForm.valid;
  }



  changeActive() {

    if (this.clientServiceTypeSchedule.isActive == true) {

      this.clientServiceTypeSchedule.isActive = false;

      this.clientServiceTypeForm.controls['isActive'].setValue(this.clientServiceTypeSchedule.isActive);

    } else if (this.clientServiceTypeSchedule.isActive == false) {

      this.clientServiceTypeSchedule.isActive = true;

      this.clientServiceTypeForm.controls['isActive'].setValue(this.clientServiceTypeSchedule.isActive);

    }

  }

  createclientServiceTypeSchedule() {

    const formValues = this.clientServiceTypeForm.value;

        formValues.timeStart = dayTimeAsStringToSeconds(
            this.clientServiceTypeForm.get('timeStart').value,
        );
  
        formValues.timeEnd = dayTimeAsStringToSeconds(
            this.clientServiceTypeForm.get('timeEnd').value,
        );

    if (this.isFormInvalid()) {
      this.toastService.displayWebsiteRelatedToast('The zone is not valid'),
        this.translate.instant('GENERAL.ACCEPT');
    } else {
      if (this.clientServiceTypeSchedule.id && this.clientServiceTypeSchedule.id > 0) {

        this.loading.showLoading();

        this.stateEasyrouteService.UpdateClientServiceTypeShedule(this.clientServiceTypeSchedule.id, this.clientServiceTypeForm.value).subscribe((data: any) => {

          this.loading.hideLoading();

          this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
            this.translate.instant('GENERAL.ACCEPT')
          );
          //this._router.navigate(['management/clients/servies-type']);
          this.activeModal.close(true);

        }, (error) => {

          this.loading.hideLoading();
          this.toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
          );
          return;

        });

      } else {

        this.loading.showLoading();

        this.stateEasyrouteService.createClientServiceTypeShedule(this.clientServiceTypeForm.value).subscribe((data: any) => {

          this.loading.hideLoading();

          this.toastService.displayWebsiteRelatedToast(
            this.translate.instant('CONFIGURATIONS.REGISTRATION'),
            this.translate.instant('GENERAL.ACCEPT')
          );

          //this._router.navigate(['management/clients/servies-type']);

          this.activeModal.close(true);

        }, (error) => {

          this.loading.hideLoading();

          this.toastService.displayHTTPErrorToast(
            error.status,
            error.error.error,
          );
          return;

        });
      }
    }

  }

  searchIncidentCode(){
    
    this.showCode = false;

    $("#tooltip").tooltip('hide');


    setTimeout(() => {
        this.stateEasyrouteService
        .getClientServiceTypeAutoCompleteCode()
        .subscribe(
            (data: any) => {
               this.clientServiceTypeForm
               .get('code')
               .setValue(data.code);
               this.clientServiceTypeForm.get('code').updateValueAndValidity();

               this.showCode = true;

               this.changeDetectorRef.detectChanges();

               this.setTimeoutFuntion();
            },
            (error) => {
                this.showCode = true;
                this.toastService.displayHTTPErrorToast(
                    error.status,
                    error.error.error,
                );
            },
        );
    }, 500);

  }
  
  setTimeoutFuntion() {
    setTimeout(() => {
        init_plugins();
    }, 500);
  }

}
