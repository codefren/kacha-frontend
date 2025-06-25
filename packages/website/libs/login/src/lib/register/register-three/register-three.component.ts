import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyMessages, UtilData, ValidateCompanyId, ValidatePhone, ToastService } from '@optimroute/shared';
import { StateRegisterFacade, Register } from '@easyroute/state-register';
import { take } from 'rxjs/operators';
import { BackendService } from '../../../../../backend/src/lib/backend.service';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAcceptPrivacyPolicyComponent } from '../register-three/modal-accept-privacy-policy/modal-accept-privacy-policy.component';
import { ModalTermsAcceptedComponent } from '../register-three/modal-terms-accepted/modal-terms-accepted.component';
import { environment } from '@optimroute/env/environment';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'easyroute-register-three',
  templateUrl: './register-three.component.html',
  styleUrls: ['./register-three.component.scss']
})
export class RegisterThreeComponent implements OnInit, OnDestroy {

  registerThreeForm: FormGroup;
  language: string = 'es';
  countrys: any[] = [];
  countrysWithPhone: any[] = [];
  countrysWithCode: any[] = [];
  companyMessages: any;
  servicesType: any[];
  prefix: string;
  register: Register;
  subscriber$: Subscription;
  type: boolean;
  recaptcha: any = environment.Recaptcha;
  acceptPrivacyPolicy: boolean;
  URL_ACCEPT_TERMS_CONDITIONS = environment.URL_PRIVACY_TERMS;
  URL_PRIVACY_TERMS = environment.URL_PRIVACY_TERMS;
  compactRecaptcha: 'compact' | 'normal' = 'normal';  // compact recaptcha only moviles


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private facade: StateRegisterFacade,
    private backendService: BackendService,
    private loadingService: LoadingService,
    private detectChanges: ChangeDetectorRef,
    private _modalService: NgbModal,
    private toast: ToastService,
    private translate: TranslateService  
  ) { }

  ngOnInit() {
    this.facade.load();
    this.facade.allStateRegister$.pipe(take(1)).subscribe((data) => {
      this.register = data;
      this.setServiceId();
      this.setUtilData();
      this.initForm();
    });
    
  }

  ngOnDestroy() {
    this.registerThreeForm.reset();
  }
  setUtilData() {
    this.countrys = UtilData.getCountry();
    this.countrysWithPhone = UtilData.getCountryPhoneCode();
    this.countrysWithCode = UtilData.getCountryWithCode();
    this.prefix = '+34';
  }

  initForm() {
    this.registerThreeForm = this.fb.group({
      clientType: [this.register.autonomous ? 'autonomus' : 'business', [Validators.required]],
      name: [ this.register.name, [Validators.required, Validators.minLength(2), Validators.maxLength(50)] ],
      /* nif: [ this.register.nif, [  ValidateCompanyId(this.register.country)] ], */
      country: [ this.register.country,  [Validators.required, Validators.minLength(2), Validators.maxLength(50)] ],
      countryCode: [this.register.countryCode],
      companyProfileTypeId: [ this.register.companyProfileTypeId === '' ? '' : this.register.companyProfileTypeId  , [Validators.required, Validators.min(1)]],
      email :[this.register.email,[Validators.required, Validators.email]],
      /* email_confirmation :[this.register.email_confirmation], */
      password : [this.register.password,[Validators.required , Validators.minLength(8), Validators.maxLength(40)]],
      /* password_confirmation : [this.register.password_confirmation], */
      acceptNewslettersAndOffers:[this.register.acceptNewslettersAndOffers],
      termsAccepted:[this.register.termsAccepted,[Validators.required]],
      acceptPrivacyPolicy:[this.register.acceptPrivacyPolicy,[Validators.required]],
      phone: [this.register.phone ? this.register.phone : '+34' , [  ValidatePhone(this.register.country),  Validators.required ]],
      captcha: [null, [Validators.required]],
    });
    this.changeStyle(this.register.autonomous ? 'autonomus' : 'business');
    this.companyMessages = new CompanyMessages().getCompanyMessages();
  }

  confirmarPassword ( control: FormControl ): {  [s: string ]: boolean } {

    let formulario: any = this;

    if ( control.value !== formulario.controls['password'].value ) {

      return {
        confirmar: true
      };

    }

    return null;
  }

  confirmarEmail ( control: FormControl ): {  [s: string ]: boolean } {

    let formulario: any = this;

    if ( control.value !== formulario.controls['email'].value ) {

      return {
        confirmar: true
      };

    }

    return null;

  }

  changeStyle( value: string ) {
    this.type = value === 'autonomus' ? true : false;
  }

  submit() {

    this.register = {
      ...this.register,
      name: this.registerThreeForm.value.name,
      /* nif: this.registerThreeForm.value.nif, */
      country: this.registerThreeForm.value.country,
      countryCode: this.registerThreeForm.value.countryCode,
      companyProfileTypeId: this.registerThreeForm.value.companyProfileTypeId,
      acceptNewslettersAndOffers: this.registerThreeForm.value.acceptNewslettersAndOffers,
      acceptPrivacyPolicy: this.registerThreeForm.value.acceptPrivacyPolicy,
      autonomous: this.type,
      phone: this.registerThreeForm.value.phone,
      email: this.registerThreeForm.value.email,
      email_confirmation: this.registerThreeForm.value.email,
      password: this.registerThreeForm.value.password,
      password_confirmation: this.registerThreeForm.value.password,
      termsAccepted: this.registerThreeForm.value.termsAccepted
    }
    this.facade.updateOrCreate(this.register);
    this.facade.persistRegister(this.register);
    this.facade.persisted$.pipe(take(2)).subscribe((persisted) => {
      if (persisted) {
        // this.facade.updateOrCreate(this.register);
       /*  this.toast.displayHTTPErrorToast( 1000,
          this.translate.instant('GENERAL.VERIFY_TOAST'), 
          this.translate.instant('GENERAL.ACCEPT'), 
          6000 
        ); */
        this.router.navigate(['login/register-successful']);
      }
    });
  }

  changeLanguage( value: string ) {
    this.language = value;
  }

  setServiceId() {

    this.subscriber$ = this.backendService.get_client('company_profile_type_list').subscribe(
      ({ data }) => {
        console.log(data);
        this.servicesType = data;
        this.detectChanges.detectChanges();
        this.loadingService.hideLoading();
      },
      ( error ) => {
        console.log( error );
      }
    );
  }

  changeCountry( value: string ) {
    this.registerThreeForm.get('countryCode').setValue(
      this.countrysWithCode.find( x => x.country === value  ).key
    );

    this.registerThreeForm.get('phone').setValue(
      '+' + this.countrysWithPhone.find( x => x.country === value  ).code
    );

    
    if ( value !== 'España' ) {

      /* this.registerThreeForm.get('nif').setValidators([Validators.required, Validators.maxLength(50)]); */
      this.registerThreeForm.get('phone').setValidators([
        ValidatePhone(
          this.registerThreeForm.get('country').value,
        ),
        Validators.required, Validators.maxLength(50)
      ]);
      /* this.registerThreeForm.get('nif').updateValueAndValidity(); */
      this.registerThreeForm.get('phone').updateValueAndValidity();

    } else {

/*       this.registerThreeForm.get('nif').setValidators([
        ValidateCompanyId(
            'España',
        ),
        Validators.required, Validators.maxLength(50)
      ]); */

      this.registerThreeForm.get('phone').setValidators([
        ValidatePhone(
            'España',
        ),
        Validators.required, Validators.maxLength(50)
      ]);
      this.registerThreeForm.get('phone').updateValueAndValidity();
      /* this.registerThreeForm.get('nif').updateValueAndValidity(); */
    }
  }


  changeTerms() {
      this.openModalTermsAccepted();
  }

  changePrivacyPolicy() {

    this.openModalAcceptPrivacyPolicy();
  }

  openModalAcceptPrivacyPolicy( ){
    
      const modal = this._modalService.open(ModalAcceptPrivacyPolicyComponent, {
        size: 'xl',
        centered: true,
        backdrop: 'static',
    });
  } 

  openModalTermsAccepted(){
    const dialogRef = this._modalService.open(ModalTermsAcceptedComponent, {
      size: 'xl',
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      centered: true
    });
  }

  changeTermsCk(value){
    if(value){
      this.registerThreeForm.get('termsAccepted').setValue(value);
    }else{
      this.registerThreeForm.get('termsAccepted').setValue('');
    }
  }

  changePrivacy(value){
    if(value){
      this.registerThreeForm.get('acceptPrivacyPolicy').setValue(value);
    }else{
      this.registerThreeForm.get('acceptPrivacyPolicy').setValue('');
    }
  }
}
