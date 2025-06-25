import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Profile, CompanyProfile } from '../../../../../../backend/src/lib/types/profile.type';
import { ProfileSettingsFacade } from '../../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { StateEasyrouteFacade } from '../../../../../../state-easyroute/src/lib/+state/state-easyroute.facade';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from '../../../../../../profile/src/lib/profile.service';
import { StateCompaniesFacade } from '../../../../../../state-companies/src/lib/+state/state-companies.facade';
import { StateCompaniesService } from '../../../../../../state-companies/src/lib/state-companies.service';
import { AuthLocalService } from '../../../../../../auth-local/src/lib/auth-local.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CompanyProfileMessages } from '../../../../../../shared/src/lib/messages/company-profile/company-profile.messages';
import { ValidateCompanyId } from '../../../../../../shared/src/lib/validators/company-id.validator';
import { take, takeUntil } from 'rxjs/operators';
import { UtilData } from '../../../../../../shared/src/lib/validators/util-data';
import { ProfileMessages } from '../../../../../../shared/src/lib/messages/profile/profile.messages';
import { Observable, Subject } from 'rxjs';
import { Companies } from '../../../../../../state-companies/src/lib/+state/state-companies.reducer';
import { ErrorStateMatcher } from '@angular/material';
import * as _ from 'lodash';
import { currency } from '../../../../../../backend/src/lib/types/currency.type';
import { BackendService } from '../../../../../../backend/src/lib/backend.service';
import { LoadingService } from '../../../../../../shared/src/lib/services/loading.service';
import { dayTimeAsStringToSeconds, secondsToDayTimeAsString } from '../../../../../../shared/src/lib/util-functions/day-time-to-seconds';
class Matcher implements ErrorStateMatcher {
  isErrorState(
      control: FormControl | null,
      form: FormGroupDirective | NgForm | null,
  ): boolean {
      const isSubmitted = form && form.submitted;
      return !!(
          control &&
          control.invalid &&
          (control.dirty || control.touched || isSubmitted)
      );
  }
}
@Component({
  selector: 'easyroute-generic-information',
  templateUrl: './generic-information.component.html',
  styleUrls: ['./generic-information.component.scss']
})
export class GenericInformationComponent implements OnInit, OnDestroy {

  profile$: Observable<Profile>;
  profileSnapShot: {
      profile: Profile['profile'];
      address: Profile['address'];
      company: Profile['company'];
  };

  private unsubscribe$ = new Subject<void>();

  email: string;

  profileSettingsGroup: FormGroup;

  profileMessages: any;

  companiesForm: FormGroup;

  company$: Observable<Companies>;

  companiesMessages: any;

  countries: string[] = [];

  filteredCountries: Observable<string[]>;

  matcher = new Matcher();

  changePasswordForm: FormGroup;

  passwordMessages: any;

  servicesType: any = [];

  created_by: any;

  created_at: string;

  profile: any;

  imageError: string;

  isImageSaved: boolean;

  cardImageBase64: string;

  prefix: any;

  countrys: any = [];

  countrysWithPhone: any = [];

  countrysWithCode: any = [];

  date = new Date();

  currencies: any[];

  template: any = this._sanitizer.bypassSecurityTrustHtml(
      this._translate.instant('TEMPLATE.PROFILE_COMPANY_ASOCIATED')
  );

  typeListHour: any = [];

  overTimeScheduleCompany : any =[];


  constructor(
    private fb: FormBuilder,
    private facade: ProfileSettingsFacade,
    private easyrouteFacade: StateEasyrouteFacade,
    private toastService: ToastService,
    private _translate: TranslateService,
    private _profile: ProfileService,
    private companyFacade: StateCompaniesFacade,
    private companiesService: StateCompaniesService,
    public authLocal: AuthLocalService,
    private detectChange: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private bakendService:BackendService,
    private loading: LoadingService
  ) { }

 
    ngOnInit() {
    this.prefix = '+34';
    /*  this.easyrouteFacade.isAuthenticated$
         .pipe(takeUntil(this.unsubscribe$))
         .subscribe((isAuthenticated) => {
             if (isAuthenticated) {
                 this.facade.loadAll();
             }
         }); */
    this.companiesService
        .loadServiceType()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((data) => {
            // console.log(data); type service
            this.servicesType = data.data;
        });
    this.profile$ = this.facade.profile$;
    this.profile$.pipe(
        take(1),
    ).subscribe((profile) => {
        console.log(profile, 'llno');
        if (profile) {

            this.profile =profile;

            this.email = profile.email;
            this.profileSnapShot = {
                profile: profile.profile,
                address: profile.address,
                company: profile.company,
            };
            this.created_at = profile.company.createdAt
                ? profile.company.createdAt.substring(0, 10)
                : '';
            this.created_by = profile.company.createdBy
                ? profile.company.createdBy
                : {};
            this.countrys = UtilData.getCountry();
            this.countrysWithPhone = UtilData.getCountryPhoneCode();
            this.countrysWithCode = UtilData.getCountryWithCode();
            this.refreshCompany({
                profile: profile.profile,
                address: profile.address,
                company: profile.company,
            });
            
            this.detectChange.detectChanges();
        }
    });

    this.getCurrency();
    this.getovertimeScheduleCompany();
   
    
  }

    getCurrency() {
      this._profile.getCurrency().pipe(take(1)).subscribe(
          ({ data }) => {
              
              this.currencies = data;
          },
          (error) => {
              this.toastService.displayHTTPErrorToast(error.error, error.error.error);
          }
      )
  }

    ngOnDestroy() {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
  }

    formIsCorrect(): boolean {
      return !(
          this.profileSettingsGroup.get('name').invalid ||
          this.profileSettingsGroup.get('surname').invalid ||
          this.profileSettingsGroup.get('nationalId').invalid ||
          this.profileSettingsGroup.get('phone').invalid
      );
  }

    fileChanceEvent(fileInput: any) {
      this.imageError = null;
      if (fileInput.target.files && fileInput.target.files[0]) {
          // Size Filter Bytes
          const max_size = 1000000;
          const allowed_types = ['image/png', 'image/jpeg'];
          const max_height = 300;
          const max_width = 300;
  
  
          // no cambia la imagen si concuerda con algunas de las condicionales
          if (fileInput.target.files[0].size > max_size) {
              this.imageError = 'Tamaño máximo permitido ' + max_size / 1000 / 1000 + 'Mb';
              this.removeImage();
              return false;
          }
  
          if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
              this.imageError = 'Formatos permitidos ( JPG | PNG )';
              this.removeImage();
              return false;
          }
  
          const reader = new FileReader();
          reader.onload = (e: any) => {
              const image = new Image();
              image.src = e.target.result;
              image.onload = (rs) => {
  
                  const img_height = rs.currentTarget['height'];
                  const img_width = rs.currentTarget['width'];
  
                  if (img_height > max_height || img_width > max_width) {
  
                      this.imageError =
                          this._translate.instant('GENERAL.RECOMMENDED_SIZE')
                           /* +
                          
                          max_height +
                          'px x ' +
                          max_width +
                          'px' */;
  
                      this.detectChange.detectChanges();
                      //  this.removeImage();
                      const imgBase64Path = e.target.result;
                      this.cardImageBase64 = imgBase64Path;
                      this.companiesForm.get('logo').setValue(imgBase64Path);
                      this.isImageSaved = true;
                      this.updateCompany(true);
                      this.detectChange.detectChanges();
                      return true;
  
                  } else {
                      const imgBase64Path = e.target.result;
                      this.cardImageBase64 = imgBase64Path;
                      this.companiesForm.get('logo').setValue(imgBase64Path);
                      this.isImageSaved = true;
                      this.updateCompany(true);
                      this.detectChange.detectChanges();
                  }
              };
          };
  
          reader.readAsDataURL(fileInput.target.files[0]);
      }
  }

    removeImage() {
      this.companiesForm.get('logo').setValue('');
      this.cardImageBase64 = null;
      this.isImageSaved = false;
  }

    isAdminAdministrative() {
      return this.authLocal.getRoles()
          ? this.authLocal.getRoles().find((role) => role === 1 || role === 2 || role === 16) !== undefined
          : false;
  }

  

    async refreshCompany(profile: {
    profile: Profile['profile'];
    address: Profile['address'];
    company: Profile['company'];
  }) {
  
    // companies Form
  
    this.companiesForm = this.fb.group({
        id: [profile.company.id, [Validators.required]],
        name: [profile.company.name, [Validators.required]],
        country: [profile.company.country, [Validators.required]],
        countryCode: [profile.company.countryCode],
        province: [profile.company.province, [Validators.required]],
        streetAddress: [
            profile.company.streetAddress,
            [Validators.required, Validators.minLength(10)],
        ],
        zipCode: [profile.company.zipCode, [Validators.required]],
        serviceTypeId: [profile.company.serviceTypeId ? profile.company.serviceTypeId : '', [Validators.required]],
        billingEmail: [
            profile.company.billingEmail,
            [Validators.required, Validators.email],
        ],
        createdAt: { value: this.created_at ? this.created_at : '', disabled: true },
        createdBy: {
            value: this.created_by ? this.created_by.email : '',
            disabled: true,
        },
        logo: [''],
        currencyId: [profile && profile.company && profile.company.currency && profile.company.currency.id ? profile.company.currency.id : 1,
        [Validators.required]],
        nif: [profile.company.nif || ''],
        phone: [
            profile.company.phone ? profile.company.phone : this.prefix,
        ],
    });
  
    this.companiesForm.updateValueAndValidity();
    const validationMessagesCompany = new CompanyProfileMessages();
    this.companiesMessages = validationMessagesCompany.getCompanyProfileMessages();
    this.detectChange.detectChanges();
    if (!this.canEdit()) {
        this.companiesForm.disable();
    }
    this.changeCountry(profile.company.country);
  }

    filterCountries(value: string) {
    const filterValue = value.toLowerCase();
    return this.countries.filter((option) =>
        option.toLowerCase().includes(filterValue),
    );
  }

    canEdit() {
    return this.authLocal.getRoles()
        ? this.authLocal.getRoles().find((role) => role === 2 || role === 1) !==
        undefined
        : false;
  }

    cancel() {
    this.refreshCompany(this.profileSnapShot);
  
  }

    update() {
    const newElement: Profile = {
        profile: {
            name: this.profileSettingsGroup.get('name').value,
            surname: this.profileSettingsGroup.get('surname').value,
            nationalId: this.profileSettingsGroup.get('nationalId').value,
            phone: this.profileSettingsGroup.get('phone').value,
        },
    };
    let partialProfile = this.compareProfiles(this.profileSnapShot, newElement);
  
    if (Object.keys(partialProfile).length !== 0) {
        this.facade.updateProfile(partialProfile as Partial<Profile>);
        this.toastService.displayWebsiteRelatedToast(
            this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
            this._translate.instant('GENERAL.ACCEPT')
        );
    }
  }

    updateCompany(changeLogo: boolean = false) {

    let currencyData = this.currencies.find(x => x.id === Number(this.companiesForm.get('currencyId').value));

    const newElement: CompanyProfile = {
        id: this.companiesForm.get('id').value,
        name: this.companiesForm.get('name').value,
        country: this.companiesForm.get('country').value,
        countryCode: this.companiesForm.get('countryCode').value,
        province: this.companiesForm.get('province').value,
        streetAddress: this.companiesForm.get('streetAddress').value,
        zipCode: this.companiesForm.get('zipCode').value,
        serviceTypeId: this.companiesForm.get('serviceTypeId').value,
        billingEmail: this.companiesForm.get('billingEmail').value,
        accountNumber: null,
        logo: this.companiesForm.get('logo').value,
        currencyId: Number(this.companiesForm.get('currencyId').value),
        termsAccepted: this.profile.company.termsAccepted,
        nif: this.companiesForm.get('nif').value,
        phone: this.companiesForm.get('phone').value,
        currency:currencyData
    };
  
    this.companyFacade.editCompany(newElement.id, newElement);
    
    this.companyFacade.updated$.pipe(take(1)).subscribe((updated) => {
  
        this.profileSnapShot.company = newElement;
        if (!changeLogo) {
            this.profileSnapShot.company = newElement;
        }

  
        console.log(this.profileSnapShot,'ññemop');
        this.refreshCompany(this.profileSnapShot);
        this.toastService.displayWebsiteRelatedToast(
            this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
            this._translate.instant('GENERAL.ACCEPT')
        );
        this.detectChange.detectChanges();
        setTimeout(() => {
            return this.facade.loadAll();
        }, 4000);
    });
  
  }

    changeCountry(value: string) {
    this.companiesForm.get('countryCode').setValue(
        this.countrysWithCode.find(x => x.country === value).key
    );
    if (value === 'España') {
        this.companiesForm.controls['nif'].setValidators([
            ValidateCompanyId(
                value
                    ? value
                    : 'España'
            ),
            Validators.required,
        ]);
        this.companiesForm.get('nif').updateValueAndValidity();
  
    } else {
        this.companiesForm.get('nif').setValidators([
            Validators.required]);
        this.companiesForm.get('nif').updateValueAndValidity();
    }
  
    this.detectChange.detectChanges();
  }

    compareProfiles(
    oldProfile: Profile | Profile['profile'] | Profile['address'],
    newProfile: Profile | Profile['profile'] | Profile['address'],
  ): Partial<Profile | Profile['profile'] | Profile['address']> {
    let partialProfile: Partial<Profile | Profile['profile'] | Profile['address']> = {};
    for (let key in oldProfile) {
        if (
            typeof oldProfile['key'] !== 'object' &&
            oldProfile[key] !== newProfile[key]
        )
            partialProfile[key] = newProfile[key];
        else if (typeof oldProfile[key] === 'object') {
            const partialObject = this.compareProfiles(
                oldProfile[key],
                newProfile[key],
            );
            if (Object.keys(partialObject).length !== 0)
                partialProfile[key] = partialObject;
        }
    }
    return partialProfile;
  }

  getOvertimeTypeList(){
    /* this.bakendService.get('overtime_type_list_hour')._subscribe */
    this.loading.showLoading();

    this.bakendService.get('overtime_type_list_hour').pipe(take(1)).subscribe((data)=>{
       
        this.typeListHour = data.data;

        this.typeListHour = this.typeListHour.map(( module ) => {
            
            return {
              ...module,
              createdAt: module.createdAt,
              deletedAt: module.deletedAt,
              frequencyId: module.frequencyId,
              id:module.id,
              isActive:module.isActive,
              name:module.name,
              updatedAt:module.updatedAt,
              startTime: this.getValueOverTimeStart(module),
              endTime: this.getValueOverTimeEnd(module),
            }
          });

        this.loading.hideLoading();

        this.detectChange.detectChanges();
       
    }, error => {
        this.loading.hideLoading();
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    })
  }

  getovertimeScheduleCompany(){

    this.bakendService.get('overtime_schedule_company').pipe(take(1)).subscribe((data)=>{
    
        this.overTimeScheduleCompany = data.data;

        console.log( this.overTimeScheduleCompany , 'this.getovertimeScheduleCompany()')

        this.getOvertimeTypeList();

       this.detectChange.detectChanges();

    }, error => {
     
        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    })
  }

  /* obtener value de time start */
  getValueOverTimeStart(item: any) {


    const overtime = this.overTimeScheduleCompany.find(x => x.overtimeTypeId == item.id);

    return overtime && overtime.startTime ? overtime.startTime : '';

  }

  getValueOverTimeEnd(item: any) {

    const overtime = this.overTimeScheduleCompany.find(x => x.overtimeTypeId == item.id);

    return overtime && overtime.endTime ? overtime.endTime : '';

  }

  //change value timer 
  changeValue(value: any, item: any, id:any ,i: any) {

 /*    const cloneItem = item; */

     let disbleSend = false;

    const overtime = this.overTimeScheduleCompany.find(x => x.overtimeTypeId == item.id);

    if (id ==='timeStart') {

        console.log(id, 'if time')

        item.startTime = dayTimeAsStringToSeconds(value);

        if (this.overTimeScheduleCompany.length > 0 && overtime) {

            this.overTimeScheduleCompany[i].startTime = dayTimeAsStringToSeconds(value);
        }

        this.detectChange.detectChanges();

       /*  if (this.validtimeStart(item)) {
            disbleSend = true;
        } */

    } else {

        console.log(id, 'else time')

        item.endTime = dayTimeAsStringToSeconds(value);

        if (this.overTimeScheduleCompany.length > 0 && overtime) {

            this.overTimeScheduleCompany[i].endTime = dayTimeAsStringToSeconds(value);
        }

        this.detectChange.detectChanges();

       /*  if (this.validtimeEnd(item)) {
            disbleSend = true;
        } */
    }



    if (overtime) {

        if (item.startTime > 0 && item.endTime > 0 ) {

            this.bakendService.put('overtime_schedule_company/' + overtime.id, {

                startTime: item.startTime,
        
                endTime: item.endTime
        
              }).pipe(take(1)).subscribe((data) => {
        
                this.toastService.displayWebsiteRelatedToast(
        
                  this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
        
                  this._translate.instant('GENERAL.ACCEPT')
        
                );
        
              },error => {
     
                this.toastService.displayHTTPErrorToast(error.status, error.error.error);
            });
        }

    } else {

        if (item.startTime > 0 && item.endTime > 0 ) {

            this.bakendService.post('overtime_schedule_company', {

                overtimeTypeId: item.id,

                startTime: item.startTime,

                endTime: item.endTime

              }).pipe(take(1)).subscribe(({ data }) => {

                this.overTimeScheduleCompany.push(data);

                this.detectChange.detectChanges();

                this.toastService.displayWebsiteRelatedToast(

                  this._translate.instant('CONFIGURATIONS.REGISTRATION'),

                  this._translate.instant('GENERAL.ACCEPT')

                );

              }, error => {
     
                this.toastService.displayHTTPErrorToast(error.status, error.error.error);
            });
        }
     
    }
  }
  
  secondToTime(value) {

    if (value) {
        return secondsToDayTimeAsString(value);
    } else {
        return '';
    }
    
}
validtimeStart(hours) {

    
    
  return hours.startTime > hours.endTime || hours.startTime === hours.endTime || hours &&  hours.startTime === -1 ? true : false;
  
}

validtimeEnd(hours) {
  
    return hours.endTime < hours.startTime ||hours.endTime === hours.startTime || hours && hours.endTime === -1 ? true : false;
}


validIntervalHours(hours: any, index) {


    let exist = false;

    const overtime = this.overTimeScheduleCompany.find(x => x.overtimeTypeId == hours.id);

   this.overTimeScheduleCompany.forEach((element, i) => {
        if ( index !=i && !exist) {

            exist = (element.startTime <= overtime.startTime && element.endTime >= overtime.startTime) ? true : false;
            
        }
    });

    return exist;
}
 deliveryScheduleId(index, item) {
        return item.id;
    }


    ModuleCost(){
        if (this.profile &&
            this.profile.email !== '' &&
            this.profile.company &&
            this.profile.company &&
            this.profile.company.active_modules && this.profile.company.active_modules.find(x => x.id === 14)) {
    
            return true;
            
        } else {

            return false;

        }
    }
}


