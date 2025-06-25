import { PlanMessages } from './../../../../../../../shared/src/lib/messages/plan/plan.message';
import { UserMessages } from './../../../../../../../shared/src/lib/messages/user/user.message';
import { CompanyMessages } from './../../../../../../../shared/src/lib/messages/company/company.message';
import { ValidatePhone } from './../../../../../../../shared/src/lib/validators/phone.validator';
import { ValidateCompanyId } from './../../../../../../../shared/src/lib/validators/company-id.validator';
import { AuthLocalService } from './../../../../../../../auth-local/src/lib/auth-local.service';
import { StateCompaniesFacade } from './../../../../../../../state-companies/src/lib/+state/state-companies.facade';
import { StateCompaniesService } from './../../../../../../../state-companies/src/lib/state-companies.service';
import { ToastService } from './../../../../../../../shared/src/lib/services/toast.service';
import { Company } from './../../../../../../../backend/src/lib/types/companies.type';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { dateToObject, getToday, objectToString } from '../../../../../../../shared/src/lib/util-functions/date-format';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { UtilData } from '../../../../../../../shared/src/lib/validators/util-data';
import { map, startWith, take, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'easyroute-companies-dialog-form',
  templateUrl: './companies-dialog-form.component.html',
  styleUrls: ['./companies-dialog-form.component.scss']
})
export class CompaniesDialogFormComponent implements OnInit {

  countries: string[] = [];
  filteredCountries: Observable<string[]>;
  unsubscribe$ = new Subject<void>();
  matcher = new ErrorStateMatcher();
  createCompanyFormGroup: FormGroup;
  dataForm: Company;
  servicesType: any = [];
  me: boolean;
  plans: any = [];
  plansRate: any = [];
  maxVehicles: number = 1;
  setupMin: number;
  setupMax: number;
  planSelected: any;
  planRateSelected: any;
  data: any;
  usuario_messages: any;
  company_messages: any;
  plan_messages: any;
  dateNow: NgbDateStruct = dateToObject(getToday());
  dateStart: any = null;
  dateEnd: any = null;
  buttonDisabledStart: boolean;
  buttonDisabledEnd: boolean;
  countrys: any = [];
  countrysWithCode: any = [];
  countrysWithPhone: any = [];
  prefix: any = '';

  constructor(
    private toastService: ToastService,
    private fb: FormBuilder,
    private companiesService: StateCompaniesService,
    private companiesFacade: StateCompaniesFacade,
    private detectChange: ChangeDetectorRef,
    private authLocal: AuthLocalService,
    public activeModal: NgbActiveModal,
    private _translate: TranslateService
  ) { }

  ngOnInit() {
    this.countrys = UtilData.getCountry();
    this.countrysWithPhone = UtilData.getCountryPhoneCode();

    this.countrysWithCode = UtilData.getCountryWithCode();
    this.me = this.data.me;
    this.initForm(this.data.company);
}

changeCountry(value) {
    this.createCompanyFormGroup.get('countryCode').setValue(this.countrysWithCode.find(x => x.country === value).key);
    if (value != 'España') {

        this.prefix = this.countrysWithPhone.find(x => x.country === value) ? '+'+this.countrysWithPhone.find(x => x.country === value).code : '';
        this.createCompanyFormGroup.get('phone').setValue(this.prefix);
        this.createCompanyFormGroup.get('nif').setValidators([Validators.required, Validators.maxLength(50)]);
        this.createCompanyFormGroup.get('nif').updateValueAndValidity();

        if (!this.data.company.id || this.data.company.id === null) {
            this.createCompanyFormGroup.get('phone_user').setValue(this.prefix);
            this.createCompanyFormGroup.get('nationalId').setValidators([Validators.required, Validators.maxLength(50)]);
            this.createCompanyFormGroup.get('nationalId').updateValueAndValidity();    
        }
        


    } else {
        this.prefix = '+34';
        this.createCompanyFormGroup.get('phone').setValue(this.prefix);
        this.createCompanyFormGroup.get('nif').setValidators([
            ValidateCompanyId(
                'España',
            ),
            Validators.required, Validators.maxLength(50)]);
        this.createCompanyFormGroup.get('nif').updateValueAndValidity();
        if (!this.data.company.id || this.data.company.id === null) { 
            this.createCompanyFormGroup.get('phone_user').setValue(this.prefix);
            this.createCompanyFormGroup.get('nationalId').updateValueAndValidity();
            this.createCompanyFormGroup.get('nationalId').setValidators([
                ValidateCompanyId(
                    'España'
                ),
                Validators.required, Validators.maxLength(50)]);
            this.createCompanyFormGroup.get('nationalId').updateValueAndValidity()
        }
        
        
    }
    this.createCompanyFormGroup.get('phone').setValidators([
        ValidatePhone(
            UtilData.COUNTRIES[
                this.countrysWithCode.find(x => x.country === this.createCompanyFormGroup.get('country').value).key
            ]
        ),
        Validators.required
    ]);

    this.createCompanyFormGroup.get('phone').updateValueAndValidity();
    if (!this.data.company.id || this.data.company.id === null) { 
        this.createCompanyFormGroup.get('phone_user').setValidators([
            ValidatePhone(
                UtilData.COUNTRIES[
                    this.countrysWithCode.find(x => x.country === this.createCompanyFormGroup.get('country').value).key
                ]
            ),
            Validators.required
        ]);
        this.createCompanyFormGroup.get('phone_user').updateValueAndValidity();
    }
    
}

async initForm(data: Company) {
    // Modificando la fecha de su formato 
    // para que sea leido por el ngbdatepicker
    this.prefix = this.countrysWithPhone.find(x => x.country === data.country) ? '+'+this.countrysWithPhone.find(x => x.country === data.country).code : '+34';
    if(data.startDemoDate){
        this.dateStart = dateToObject(data.startDemoDate);
    }

    if(data.endDemoDate){
        this.dateEnd = dateToObject(data.endDemoDate);
    }

    this.createCompanyFormGroup = this.fb.group({
        id: [data.id, [Validators.required]],
        name: [data.name, [Validators.required]],
        country: [ data.country ?  data.country : 'España',
            [Validators.required],
        ],
        streetAddress: [
            data.streetAddress,
            [Validators.required, Validators.minLength(10), Validators.maxLength(200)],
        ],
        city: [data.city, [Validators.required]],
        province: [data.province, [Validators.required]],
        zipCode: [data.zipCode, Validators.required],
        countryCode: [data.countryCode ? data.countryCode : 'ES' ],
        nif: [
            data.nif,
            [
                ValidateCompanyId(
                    data.country 
                            ?  data.country
                            : 'España'
                ),
                Validators.required,
            ],
        ],
        phone: [
            data.phone ? data.phone : '+34',
            [
                ValidatePhone(
                    data.country 
                    ?  data.country 
                    : 'España'
                ),
                Validators.required
            ],
        ],
        billingEmail: [data.billingEmail, [Validators.required, Validators.email]],
        vehicles: [data.plan && data.plan.planRateId ? data.vehicles : 0],
        serviceTypeId: [data.serviceType.id, [Validators.required]],
        planId: [
            data.plan && data.plan.planId ? data.plan.planId : '',
            [Validators.required],
        ],
        planRateId: [
            data.plan && data.plan.planRateId ? data.plan.planRateId : '',
            [Validators.required],
        ],
        setup: [
            data.plan && data.plan.priceSetup ? data.plan.priceSetup : '',
            [Validators.required],
        ],
        monthPrice: [
            data.plan && data.plan.monthPrice ? data.plan.monthPrice : '',
            [Validators.required],
        ],
        vehicleMonthPrice: [
            data.plan && data.plan.monthPrice ? +data.plan.monthPrice : 0,
            [Validators.required],
        ],
        isDemo: [data.isDemo],
        startDemoDate: [this.dateStart],
        endDemoDate: [this.dateEnd],
        promotionCovid: [data.promotionCovid],

    });

    this.createCompanyFormGroup.controls['monthPrice'].disable();

    if (data.isDemo || !this.isAdmin()) {
        this.createCompanyFormGroup.controls['isDemo'].disable();
        this.buttonDisabledStart = true;
        this.buttonDisabledEnd = true;
    }

    if (!data.isDemo) {
        this.buttonDisabledEnd = true;
    }
    
    if (!this.data.company.id || this.data.company.id === null) {
        this.createCompanyFormGroup.addControl(
            'email',
            new FormControl('', [Validators.email, Validators.required]),
        );
        this.createCompanyFormGroup.addControl(
            'name_user',
            new FormControl('', [
                Validators.required,
                Validators.pattern('[A-Za-z ]+'),
                Validators.minLength(2),
                Validators.maxLength(50),
            ]),
        );
        this.createCompanyFormGroup.addControl(
            'surname',
            new FormControl('', [
                Validators.required,
                Validators.pattern('[A-Za-z ]+'),
                Validators.minLength(2),
                Validators.maxLength(50),
            ]),
        );
        this.createCompanyFormGroup.addControl(
            'nationalId',
            new FormControl('', [
                ValidateCompanyId(UtilData.COUNTRIES['ES']),
                Validators.required,
                Validators.maxLength(50),
            ]),
        );
        this.createCompanyFormGroup.addControl(
            'phone_user',
            new FormControl('+34', [
                Validators.required,
                ValidatePhone(
                    'España',
                )
            ]),
        );
        this.createCompanyFormGroup.addControl(
            'password',
            new FormControl('', [Validators.minLength(8), Validators.required]),
        );
        this.createCompanyFormGroup.addControl(
            'password_confirmation',
            new FormControl('', [Validators.minLength(8), Validators.required, this.checkPasswords.bind(this)]),
        );

    }

    this.createCompanyFormGroup.controls['serviceTypeId'].setValidators([
        Validators.required,
    ]);

    await this.companiesService.loadServiceType().subscribe((data) => {
        this.servicesType = data.data;
    });

    this.filteredCountries = this.createCompanyFormGroup
        .get('country')
        .valueChanges.pipe(
            startWith(''),
            map((value) => this.filterCountries(value)),
        );

    for (const key in UtilData.COUNTRIES) {
        this.countries.push(UtilData.COUNTRIES[key]);
    }

    this.plans = (await this.companiesService
        .getPlan()
        .pipe(take(1))
        .toPromise()).data;
    if (this.data.company.plan && this.data.company.plan.planId) {
        await this.companiesService
            .getRateByPlanId(this.data.company.plan.planId)
            .subscribe((data) => {
                this.plansRate = data.data.sort((a, b) => {
                    return b.vehicles - a.vehicles;
                });

                this.maxVehicles = this.plansRate.find((x) => x.id).vehicles;

                this.planRateSelected = this.plansRate.find((x) => x.id);
                this.planSelected = this.plans.find(
                    (x) => x.id === this.data.company.plan.planId,
                );

                this.createCompanyFormGroup.controls['vehicles'].setValidators([
                    Validators.max(this.maxVehicles),
                    Validators.required,
                ]);

                let datos = this.plansRate
                    .sort((a, b) => {
                        return a.vehicles - b.vehicles;
                    })
                    .find((x) => this.data.company.vehicles <= x.vehicles);

                this.onChange(this.data.company.vehicles);
                this.createCompanyFormGroup.updateValueAndValidity();
                this.detectChange.detectChanges();
            });
    }

    let company_messages = new CompanyMessages();
    this.company_messages = company_messages.getCompanyMessages();

    let usuario_messages = new UserMessages();
    this.usuario_messages = usuario_messages.getUserMessages();

    let plan_messages = new PlanMessages();
    this.plan_messages = plan_messages.getPlanMessages();

}

isFormInvalid(): boolean {
    return !this.createCompanyFormGroup.valid;
}

closeDialog(value: any) {
    this.activeModal.close(value);
}

createCompany(): void {
    if (this.isFormInvalid()) {
        this.toastService.displayWebsiteRelatedToast('The company is not valid'),this._translate.instant('GENERAL.ACCEPT');
    } else {
        this.createCompanyFormGroup.value.startDemoDate = objectToString(this.createCompanyFormGroup.value.startDemoDate);
        this.createCompanyFormGroup.value.endDemoDate = objectToString(this.createCompanyFormGroup.value.endDemoDate);
        
        if (!this.data.company.id || this.data.company.id === null) {
            this.addCompany(this.createCompanyFormGroup.value);
            this.companiesFacade.added$
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((data) => {
                    if (data) {
                        this.closeDialog([true, this.createCompanyFormGroup.value]);
                    }
                });
        } else {
            this.editCompany([this.data.company.id, this.createCompanyFormGroup.value]);
            this.companiesFacade.updated$
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((data) => {
                    if (data) {
                        this.closeDialog([true, this.createCompanyFormGroup.value]);
                    }
                });
        }
    }
}

isAdmin() {
    return this.authLocal.getRoles()
        ? this.authLocal.getRoles().find((role) => role === 1 || role === 3 || role === 8) !==
              undefined
        : false;
}

canUpdatesVehiclePrice() {
    return this.authLocal.getRoles()
        ? this.authLocal.getRoles().find((role) => role === 1 || role === 8) !==
              undefined
        : false;
}

changeDemo(value: any) {
    if (value) {

        this.createCompanyFormGroup.controls['startDemoDate'].setValidators([
            Validators.required,
        ]);
        this.createCompanyFormGroup.controls['endDemoDate'].setValidators([
            Validators.required, this.startDemoDateConfirmar.bind(this)
        ]);

    } else {
        this.createCompanyFormGroup.get('startDemoDate').setValue(null);
        this.createCompanyFormGroup.get('endDemoDate').setValue(null);

        this.createCompanyFormGroup.get('startDemoDate').setValidators(null);
        this.createCompanyFormGroup.get('startDemoDate').updateValueAndValidity();
        this.createCompanyFormGroup.get('endDemoDate').setValidators(null);
        this.createCompanyFormGroup.get('endDemoDate').updateValueAndValidity();
    }
    this.detectChange.detectChanges();
}

changePlan(value: any) {
    this.companiesService.getRateByPlanId(value).subscribe((response) => {
        this.plansRate = response.data.sort((a, b) => {
            return b.vehicles - a.vehicles;
        });

        this.planSelected = this.plans.find((x) => +x.id === +value);

        this.planRateSelected = this.plansRate.find((x) => x.id);

        this.maxVehicles = this.plansRate.find((x) => x.id).vehicles;

        this.createCompanyFormGroup.controls['vehicles'].setValidators([
            Validators.max(this.maxVehicles),
            Validators.required,
        ]);

        this.createCompanyFormGroup.updateValueAndValidity();

        this.detectChange.detectChanges();

        this.onChange(this.data.company.vehicles);
    });
}

onChange(value: any) {
    let datos = this.plansRate
        .sort((a, b) => {
            return a.vehicles - b.vehicles;
        })
        .find((x) => value <= x.vehicles);
        
    if (datos !== undefined) {

        if(!this.canUpdatesVehiclePrice()){
            this.createCompanyFormGroup.controls['setup'].setValidators([
                Validators.required,
                Validators.minLength(datos.priceSetupFrom),
                Validators.maxLength(datos.priceSetupTo),
            ]);
        }else{
            this.createCompanyFormGroup.controls['setup'].setValidators([
                Validators.required
            ]);
        }
        this.createCompanyFormGroup.get('setup').updateValueAndValidity();
        this.planRateSelected = datos;
        this.setupMin = datos.priceSetupFrom;
        this.setupMax = datos.priceSetupTo;
        let vehicles = this.createCompanyFormGroup.controls['vehicles'].value;

        if(!this.canUpdatesVehiclePrice()){
            this.createCompanyFormGroup.controls['monthPrice'].setValue(
                vehicles * datos.vehiclePrice,
            );
        }else{
            this.createCompanyFormGroup.controls['monthPrice'].setValue(
                vehicles * this.createCompanyFormGroup.controls['vehicleMonthPrice'].value,
            );

            this.createCompanyFormGroup.controls['monthPrice'].setValidators(Validators.required);
        }
        this.createCompanyFormGroup.controls['planRateId'].setValue(datos.id);
    }
    this.createCompanyFormGroup.updateValueAndValidity();
    this.detectChange.detectChanges();
}

changeVehiclePrice(){
    let vehicles = this.createCompanyFormGroup.controls['vehicles'].value;
    this.createCompanyFormGroup.controls['monthPrice'].setValue(
        vehicles * this.createCompanyFormGroup.controls['vehicleMonthPrice'].value,
    );
}

checkPasswords(group: AbstractControl) {
    let pass = group.root.value.password;
    let confirmPass = group.value;

    return pass === confirmPass ? null : { confirmar: true };
}

startDemoDateConfirmar (group: AbstractControl) {
    let startDemoDate = objectToString(group.root.value.startDemoDate);
    let endDemoDate = objectToString(group.value);

    if ( endDemoDate < startDemoDate ) {
      return {
        coxnfirmar: true
      };
    }

    return null;
}

startDateSelect(event: any){
    this.createCompanyFormGroup.get('endDemoDate').enable();

    this.buttonDisabledEnd = false;
}

filterCountries(value: string) {
    const filterValue = value.toLowerCase();
    return this.countries.filter((option) =>
        option.toLowerCase().includes(filterValue),
    );
}

selectServiceType(value: number) {
    let val: any = this.servicesType.find((x: any) => (x.id = value));
    return val ? val.id : null;
}

addCompany(company: Company) {
    this.companiesFacade.addCompany(company);
}

editCompany(obj: [number, Partial<Company>]) {
    this.companiesFacade.editCompany(obj[0], obj[1]);
}

}
