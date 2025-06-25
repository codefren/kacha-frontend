import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import {
    FormControl,
    FormGroup,
    FormBuilder,
    Validators,
    AbstractControl,
} from '@angular/forms';
import { Company, BackendService, ModuleInterface } from '@optimroute/backend';
import { Observable, Subject } from 'rxjs';
import { startWith, map, take, tap, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import {
    ToastService,
    ValidatePhone,
    ValidateCompanyId,
    UtilData,
    UserMessages,
    CompanyMessages,
    PlanMessages,
    dateToObject,
    getToday,
    objectToString,
    LoadingService,
    dateYYYYMMDD,
} from '@optimroute/shared';
import { StateCompaniesFacade, StateCompaniesService } from '@optimroute/state-companies';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DemoDialogComponent } from '../companies-table/demo-dialog/demo-dialog.component';
import { ActiveDialogModuleComponent } from './active-dialog-module/active-dialog-module.component';
import * as moment from 'moment';
@Component({
    selector: 'easyroute-companies-form',
    templateUrl: './companies-form.component.html',
    styleUrls: ['./companies-form.component.scss'],
})
export class CompaniesFormComponent implements OnInit {
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
    company: Company;
    usuario_messages: any;
    company_messages: any;
    plan_messages: any;
   // dateNow: string;
    dateNow: NgbDateStruct = dateToObject(getToday());
    dateStart: any = null;
    dateEnd: any = null;
    buttonDisabledStart: boolean;
    buttonDisabledEnd: boolean;
    countrys: any = [];
    countrysWithCode: any = [];
    countrysWithPhone: any = [];
    prefix: any = '';
    id: any = '';
    load: boolean;
    currencies: any[];
    modules: ModuleInterface[];

    constructor(
        private toastService: ToastService,
        private fb: FormBuilder,
        private companiesService: StateCompaniesService,
        private companiesFacade: StateCompaniesFacade,
        private detectChange: ChangeDetectorRef,
        private authLocal: AuthLocalService,
        private translate: TranslateService,
        private activatedRoute: ActivatedRoute,
        private loadingService: LoadingService,
        private dialog: NgbModal,
        private router: Router, // private backendService: BackendService
    ) {}

    ngOnInit() {
        this.loadingService.showLoading();

        this.countrys = UtilData.getCountry();
        this.countrysWithPhone = UtilData.getCountryPhoneCode();
        this.countrysWithCode = UtilData.getCountryWithCode();

        this.validateRoute();
    }

    validateRoute() {
        this.load = false;
        this.activatedRoute.params.subscribe((params) => {
            this.me = params['me'] ? params['me'] : false;
            this.id = params['id'];

            if (params['id'] == 'new') {
                this.company = new Company();
                this.initForm(this.company, params['id']);
                this.load = true;
                this.loadingService.hideLoading();
            } else {
                this.companiesService.loadModules(params['id']).subscribe(
                    (resp: any) => {
                        this.modules = resp.data;
                    },
                    (error: any) => {
                        this.loadingService.hideLoading();
                        this.toastService.displayHTTPErrorToast(
                            error.status,
                            error.error.error,
                        );
                    },
                );

                this.companiesService.getCompany(params['id']).subscribe(
                    (resp: any) => {
                        this.company = resp.data;
                        this.initForm(this.company, params['id']);
                        this.load = true;
                        this.loadingService.hideLoading();
                    },
                    (error: any) => {
                        this.loadingService.hideLoading();
                        this.toastService.displayHTTPErrorToast(
                            error.status,
                            error.error.error,
                        );
                    },
                );
            }
        });
    }
    async initForm(dataCompany: Company, id: any) {
        this.prefix = this.countrysWithPhone.find(
            (x: any) => x.country === dataCompany.country,
        )
            ? '+' +
              this.countrysWithPhone.find((x) => x.country === dataCompany.country).code
            : '+34';

        if(dataCompany.startDemoDate){
            this.dateStart = dateToObject(dataCompany.startDemoDate);
        }
    
        if(dataCompany.endDemoDate){
            this.dateEnd = dateToObject(dataCompany.endDemoDate);
        }

        this.createCompanyFormGroup = this.fb.group({
            id: [dataCompany.id, [Validators.required]],
            name: [dataCompany.name, [Validators.required]],
            country: [
                dataCompany.country ? dataCompany.country : 'España',
                [Validators.required],
            ],
            streetAddress: [
                dataCompany.streetAddress,
                [Validators.required, Validators.minLength(10), Validators.maxLength(200)],
            ],
            city: [dataCompany.city, [Validators.required]],
            province: [dataCompany.province, [Validators.required]],
            zipCode: [dataCompany.zipCode, Validators.required],
            countryCode: [dataCompany.countryCode ? dataCompany.countryCode : 'ES'],
            nif: [
                dataCompany.nif,
                [
                    ValidateCompanyId(dataCompany.country ? dataCompany.country : 'España'),
                    Validators.required,
                ],
            ],
            phone: [
                dataCompany.phone ? dataCompany.phone : '+34',
                [
                    ValidatePhone(dataCompany.country ? dataCompany.country : 'España'),
                    Validators.required,
                ],
            ],
            billingEmail: [
                dataCompany.billingEmail,
                [Validators.required, Validators.email],
            ],
            vehicles: [
                dataCompany.plan && dataCompany.plan.planRateId ? dataCompany.vehicles : 0,
            ],
            serviceTypeId: [dataCompany.serviceType !== null ? dataCompany.serviceType.id : ''],
            isDemo: [dataCompany.isDemo],
            startDemoDate: [this.dateStart],
            endDemoDate: [this.dateEnd],
            autonomous: [dataCompany.autonomous],
            promotionCovid: [dataCompany.promotionCovid],
            companyProfileTypeId:[dataCompany.companyProfileTypeId ? dataCompany.companyProfileTypeId :1]
            // currencyId: [ dataCompany.currencyId == 0 || dataCompany.currencyId == null ? 1 : dataCompany.currencyId ]
        });

        if (dataCompany.isDemo || !this.isAdmin()) {
            this.createCompanyFormGroup.controls['isDemo'].disable();
            this.buttonDisabledStart = true;
            this.buttonDisabledEnd = true;
        }

        if (!dataCompany.isDemo) {
            this.buttonDisabledEnd = true;
        }

        if (id == 'new') {
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
                new FormControl('+34', [Validators.required, ValidatePhone('España')]),
            );
            this.createCompanyFormGroup.addControl(
                'password',
                new FormControl('', [Validators.minLength(8), Validators.required]),
            );
            this.createCompanyFormGroup.addControl(
                'password_confirmation',
                new FormControl('', [
                    Validators.minLength(8),
                    Validators.required,
                    this.checkPasswords.bind(this),
                ]),
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

        let company_messages = new CompanyMessages();
        this.company_messages = company_messages.getCompanyMessages();

        let usuario_messages = new UserMessages();
        this.usuario_messages = usuario_messages.getUserMessages();

        let plan_messages = new PlanMessages();
        this.plan_messages = plan_messages.getPlanMessages();
    }

    isAdmin() {
        return this.authLocal.getRoles()
            ? this.authLocal
                  .getRoles()
                  .find((role) => role === 1 || role === 3 || role === 8) !== undefined
            : false;
    }

    checkPasswords(group: AbstractControl) {
        let pass = group.root.value.password;
        let confirmPass = group.value;

        return pass === confirmPass ? null : { confirmar: true };
    }

    filterCountries(value: string) {
        const filterValue = value.toLowerCase();
        return this.countries.filter((option) =>
            option.toLowerCase().includes(filterValue),
        );
    }

    onChange(value: any) {
        let datos = this.plansRate
            .sort((a, b) => {
                return a.vehicles - b.vehicles;
            })
            .find((x) => value <= x.vehicles);

        if (datos !== undefined) {
            if (!this.canUpdatesVehiclePrice()) {
                this.createCompanyFormGroup.controls['setup'].setValidators([
                    Validators.required,
                    Validators.minLength(datos.priceSetupFrom),
                    Validators.maxLength(datos.priceSetupTo),
                ]);
            } else {
                this.createCompanyFormGroup.controls['setup'].setValidators([
                    Validators.required,
                ]);
            }
            this.createCompanyFormGroup.get('setup').updateValueAndValidity();
            this.planRateSelected = datos;
            this.setupMin = datos.priceSetupFrom;
            this.setupMax = datos.priceSetupTo;
            let vehicles = this.createCompanyFormGroup.controls['vehicles'].value;

            if (!this.canUpdatesVehiclePrice()) {
                this.createCompanyFormGroup.controls['monthPrice'].setValue(
                    vehicles * datos.vehiclePrice,
                );
            } else {
                this.createCompanyFormGroup.controls['monthPrice'].setValue(
                    vehicles *
                        this.createCompanyFormGroup.controls['vehicleMonthPrice'].value,
                );

                this.createCompanyFormGroup.controls['monthPrice'].setValidators(
                    Validators.required,
                );
            }
            this.createCompanyFormGroup.controls['planRateId'].setValue(datos.id);
        }
        this.createCompanyFormGroup.updateValueAndValidity();
        this.detectChange.detectChanges();
    }

    canUpdatesVehiclePrice() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 1 || role === 8) !==
                  undefined
            : false;
    }

    changeCountry(value) {
        this.createCompanyFormGroup
            .get('countryCode')
            .setValue(this.countrysWithCode.find((x) => x.country === value).key);
        if (value != 'España') {
            this.prefix = this.countrysWithPhone.find((x) => x.country === value)
                ? '+' + this.countrysWithPhone.find((x) => x.country === value).code
                : '';
            this.createCompanyFormGroup.get('phone').setValue(this.prefix);
            this.createCompanyFormGroup
                .get('nif')
                .setValidators([Validators.required, Validators.maxLength(50)]);
            this.createCompanyFormGroup.get('nif').updateValueAndValidity();

            if (this.id == 'new') {
                this.createCompanyFormGroup.get('phone_user').setValue(this.prefix);
                this.createCompanyFormGroup
                    .get('nationalId')
                    .setValidators([Validators.required, Validators.maxLength(50)]);
                this.createCompanyFormGroup.get('nationalId').updateValueAndValidity();
            }
        } else {
            this.prefix = '+34';
            this.createCompanyFormGroup.get('phone').setValue(this.prefix);
            this.createCompanyFormGroup
                .get('nif')
                .setValidators([
                    ValidateCompanyId('España'),
                    Validators.required,
                    Validators.maxLength(50),
                ]);
            this.createCompanyFormGroup.get('nif').updateValueAndValidity();
            if (this.id == 'new') {
                this.createCompanyFormGroup.get('phone_user').setValue(this.prefix);
                this.createCompanyFormGroup.get('nationalId').updateValueAndValidity();
                this.createCompanyFormGroup
                    .get('nationalId')
                    .setValidators([
                        ValidateCompanyId('España'),
                        Validators.required,
                        Validators.maxLength(50),
                    ]);
                this.createCompanyFormGroup.get('nationalId').updateValueAndValidity();
            }
        }
        this.createCompanyFormGroup
            .get('phone')
            .setValidators([
                ValidatePhone(
                    UtilData.COUNTRIES[
                        this.countrysWithCode.find(
                            (x) =>
                                x.country ===
                                this.createCompanyFormGroup.get('country').value,
                        ).key
                    ],
                ),
                Validators.required,
            ]);

        this.createCompanyFormGroup.get('phone').updateValueAndValidity();
        if (this.id == 'new') {
            this.createCompanyFormGroup
                .get('phone_user')
                .setValidators([
                    ValidatePhone(
                        UtilData.COUNTRIES[
                            this.countrysWithCode.find(
                                (x) =>
                                    x.country ===
                                    this.createCompanyFormGroup.get('country').value,
                            ).key
                        ],
                    ),
                    Validators.required,
                ]);
            this.createCompanyFormGroup.get('phone_user').updateValueAndValidity();
        }
    }

    changeDemo(value: any) {
        if (value) {
            this.createCompanyFormGroup.controls['startDemoDate'].setValidators([
                Validators.required,
            ]);
            this.createCompanyFormGroup.controls['endDemoDate'].setValidators([
                Validators.required,
                this.startDemoDateConfirmar.bind(this),
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

    startDateSelect(event: any) {
        this.createCompanyFormGroup.get('endDemoDate').enable();

        this.buttonDisabledEnd = false;
    }

    createCompany(): void {

        if (this.isFormInvalid()) {
            this.toastService.displayWebsiteRelatedToast('The company is not valid'),
                this.translate.instant('GENERAL.ACCEPT');
        } else {

            this.createCompanyFormGroup.value.startDemoDate = objectToString(this.createCompanyFormGroup.value.startDemoDate);
            this.createCompanyFormGroup.value.endDemoDate = objectToString(this.createCompanyFormGroup.value.endDemoDate);
     
            if (!this.company.id || this.company.id === null) {
                this.addCompany(this.createCompanyFormGroup.value);
            } else {
                this.editCompany([this.company.id, this.createCompanyFormGroup.value]);
                this.companiesFacade.updated$.subscribe(
                    (data) => {
                        if (data) {
                            this.loadingService.hideLoading();
                            this.toastService.displayWebsiteRelatedToast(
                                this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                                this.translate.instant('GENERAL.ACCEPT'),
                            );
                        }
                    },
                    (error) => {
                        this.loadingService.hideLoading();
                        this.toastService.displayHTTPErrorToast(
                            error.error.code,
                            error.error,
                        );
                    },
                );
            }
        }
    }

    isFormInvalid(): boolean {
        return !this.createCompanyFormGroup.valid;
    }

    addCompany(company: Company) {
        this.loadingService.showLoading();

        this.companiesService.addCompany(company).subscribe(
            (data: any) => {
                this.loadingService.hideLoading();
                this.toastService.displayWebsiteRelatedToast(
                    this.translate.instant('GENERAL.REGISTRATION'),
                    this.translate.instant('GENERAL.ACCEPT'),
                );

                if (this.me) {
                    this.router.navigate(['/users-management/companiesMe/']);
                } else {
                    this.router.navigate(['/users-management/companies/']);
                }
            },
            (error) => {
                this.loadingService.hideLoading();
                this.toastService.displayHTTPErrorToast(error.error.code, error.error);
            },
        );
    }

    editCompany(obj: [number, Partial<Company>]) {
        this.companiesFacade.editCompany(obj[0], obj[1]);
        this.companiesFacade.updated$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                if (data) {
                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('USERS.USER_UPDATED'),
                        this.translate.instant('GENERAL.ACCEPT'),
                    );
                    if (this.me) {
                        this.router.navigate(['/users-management/companiesMe/']);
                    } else {
                        this.router.navigate(['/users-management/companies/']);
                    }
                }
            });
    }

    OnChangeCheckDemo(): void {
        const dialogRef = this.dialog.open(DemoDialogComponent, {
            backdrop: 'static',
            backdropClass: 'customBackdrop',
            centered: true,
        });

        dialogRef.componentInstance.data = {
            companyId: this.company.id,
        };
        dialogRef.componentInstance.startDemoDate = this.company.startDemoDate
            ? dateToObject(this.company.startDemoDate)
            : undefined;
        dialogRef.componentInstance.endDemoDate = this.company.endDemoDate
            ? dateToObject(this.company.endDemoDate)
            : undefined;
        dialogRef.result.then(([add, object]) => {
            if (add) {
                this.editDemoCompany([
                    this.company.id,
                    {
                        startDemoDate: objectToString(object.startDemoDate),
                        endDemoDate: objectToString(object.endDemoDate),
                    },
                ]);
            }
        });
    }
    editDemoCompany(obj: [number, any]) {
        
        this.companiesFacade.updateDemoCompany(obj[0], obj[1]);
        this.companiesFacade.allUsers$.subscribe((data) => {
            if (data) {
                this.validateRoute();
            }
        });
    }

    OnChangeActiveModule(index: number, module: ModuleInterface) {
        const dialogRef = this.dialog.open(ActiveDialogModuleComponent, {
            size: 'lg',
            centered: true,
            backdrop: 'static',
        });

        (dialogRef.componentInstance.data = {
            isActive: !module.company_module[0].isActive,
        }),
            dialogRef.result.then(([add, object]) => {
                if (add) {
                    this.companiesService
                        .updateActiveCompanyModule(module.company_module[0].id, {
                            isActive: !module.company_module[0].isActive,
                        })
                        .subscribe(
                            (resp) => {
                                this.modules[index].company_module[0] = resp.data;
                            },
                            (error) => {
                                this.toastService.displayHTTPErrorToast(
                                    error.status,
                                    error.error.error,
                                );
                            },
                        );
                }
            });
    }

    OnCreateCompanyModule(index: number, module: ModuleInterface) {
        const dialogRef = this.dialog.open(ActiveDialogModuleComponent, {
            size: 'lg',
            centered: true,
            backdrop: 'static',
        });

        (dialogRef.componentInstance.data = {
            isActive: true,
        }),
            dialogRef.result.then(([add, object]) => {
                if (add) {
                    this.companiesService
                        .addCompanyModule({
                            companyId: this.company.id,
                            moduleId: module.id,
                        })
                        .subscribe(
                            (resp) => {
                                this.modules[index].company_module.push(resp.data);
                            },
                            (error) => {
                                this.toastService.displayHTTPErrorToast(
                                    error.status,
                                    error.error.error,
                                );
                            },
                        );
                }
            });
    }
}
