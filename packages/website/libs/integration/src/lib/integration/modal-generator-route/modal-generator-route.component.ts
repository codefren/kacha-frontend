import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
import {
  dateToObject,
  getToday,
  objectToString,
  LoadingService,
  ToastService,
  IntegrationMessages
} from '@optimroute/shared';
import { StateCompaniesService } from '@optimroute/state-companies';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StatePointService } from 'libs/state-points/src/lib/state-point.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { Profile } from '@optimroute/backend';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
@Component({
  selector: 'easyroute-modal-generator-route',
  templateUrl: './modal-generator-route.component.html',
  styleUrls: ['./modal-generator-route.component.scss']
})
export class ModalGeneratorRouteComponent implements OnInit {

  type: number = 1;
  dateOrder: NgbDateStruct;
  dateNow: NgbDateStruct = dateToObject(getToday());
  dataOrder: any;
  form: FormGroup;
  integration_messages: any;
  profile: Profile;

  constructor(public dialogRef: NgbActiveModal,
    private preferencesFacade: PreferencesFacade,
    private loading: LoadingService,
    private companyService: StateCompaniesService,
    private toast: ToastService,
    private fb: FormBuilder,
    private statePointService: StatePointService,
    private _translate: TranslateService,
    private router: Router,
    private profileFacade: ProfileSettingsFacade,
    public authLocal: AuthLocalService,

  ) { }

  ngOnInit() {
    this.preferencesFacade.loadAllPreferences();
    this.preferencesFacade.loaded$.pipe(take(2)).subscribe((loaded) => {
      if (loaded) {
        this.profileFacade.profile$.pipe(take(1)).subscribe((profile)=>{
          this.profile = profile;
        })
        this.preferencesFacade.panelControlPreferencs$.pipe(take(1)).subscribe((panelControlPreferencs) => {
          this.dateOrder = dateToObject(panelControlPreferencs.assignedNextDay ? moment().add(1, 'days').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'));
          let integration_messages = new IntegrationMessages();
          this.integration_messages = integration_messages.getIntegrationMessages();
          this.form = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(300)]],
            orderDate: [this.dateOrder, [Validators.required]],
            dateSession: [this.dateOrder, [Validators.required]],
            description: [''],
            integrationSessionTypeId: [1]
          });
        })
      }
    })
  }

  closeDialog(value) {
    this.dialogRef.close(value);
  }

  createRoute() {

    if (this.type === 1) {
      this.loading.showLoading();
      let data = {
        ...this.form.value,
        orderDate: objectToString(this.dateOrder),
        dateSession: objectToString(this.form.value.dateSession),

      }
      this.statePointService.createIntegrationSession(data).subscribe( (data: any) => {

      this.loading.hideLoading();

      this.toast.displayWebsiteRelatedToast(
        this._translate.instant('GENERAL.REGISTRATION'),
        this._translate.instant('GENERAL.ACCEPT')
      );

        this.router.navigate(['integration', data.data._id]);

        this.closeDialog(false);

      }, (error)=>{

        this.loading.hideLoading();

        this.toast.displayHTTPErrorToast(error.status, error.error);

      });
    } else {
      this.loading.showLoading();
      let data = {
        ...this.form.value,
        orderDate: objectToString(this.dateOrder),
        dateSession: objectToString(this.form.value.dateSession),

      }
      this.companyService.createRouteForOrder(data).pipe(take(1)).subscribe((data) => {
        this.loading.hideLoading();
        this.router.navigate(['integration', data.data._id]);
        this.closeDialog(false);
      }, error => {
        this.loading.hideLoading();
        this.toast.displayHTTPErrorToast(error.error.code,error.error.error);
      })
    }
  }

  changeTypeOption(event) {

    console.log( this.type );
    if (this.type === 2) {
      this.form.get('integrationSessionTypeId').setValue(2);
      this.loading.showLoading();
      this.companyService.ordersResume(objectToString(this.dateOrder)).pipe(take(1)).subscribe((data) => {
        this.dataOrder = data.data;
        this.loading.hideLoading();
      }, (error: any) => {
        this.loading.hideLoading();
        this.toast.displayHTTPErrorToast(error.error.error);
      });
    } else {
      // se setea el valor de dataOrder a undefined para activar la validacion del primer formulario
      this.form.get('integrationSessionTypeId').setValue(1);
      this.dataOrder = undefined;
    }
  }


  hideMultidelegation() {

    if (!this.isAdminGlobal() && this.profile &&
        this.profile.email !== '' &&
        this.profile.company &&
        this.profile.company.active_modules &&
        this.profile.company.active_modules.find(x => x.id === 2) &&
        this.profile.company.hideMultidelegation) {

        return false;

    }

    return true;

  }

  isAdminGlobal() {
      return this.authLocal.getRoles()
          ? this.authLocal.getRoles().find((role) => role === 1) !== undefined
          : false;
  }

}
