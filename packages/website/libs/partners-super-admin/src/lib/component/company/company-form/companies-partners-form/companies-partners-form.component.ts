import { PlanMessages } from './../../../../../../../shared/src/lib/messages/plan/plan.message';
import { UserMessages } from './../../../../../../../shared/src/lib/messages/user/user.message';
import { CompanyMessages } from './../../../../../../../shared/src/lib/messages/company/company.message';
import { ValidatePhone } from './../../../../../../../shared/src/lib/validators/phone.validator';
import { ValidateCompanyId } from './../../../../../../../shared/src/lib/validators/company-id.validator';
import { BackendService } from './../../../../../../../backend/src/lib/backend.service';
import { LoadingService } from './../../../../../../../shared/src/lib/services/loading.service';
import { AuthLocalService } from './../../../../../../../auth-local/src/lib/auth-local.service';
import { StateCompaniesFacade } from './../../../../../../../state-companies/src/lib/+state/state-companies.facade';
import { StateCompaniesService } from './../../../../../../../state-companies/src/lib/state-companies.service';
import { ToastService } from './../../../../../../../shared/src/lib/services/toast.service';

import { Company } from './../../../../../../../backend/src/lib/types/companies.type';
import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { environment } from '@optimroute/env/environment';
import { Observable, Subject } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material';
import * as moment from 'moment-timezone';
import * as _ from 'lodash';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilData, dateToObject, getToday, objectToString } from '@optimroute/shared';
import { ModuleInterface } from '@optimroute/backend';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, startWith, take, takeUntil } from 'rxjs/operators';
import { ModalConfirmPhoneComponent } from './modal-confirm-phone/modal-confirm-phone.component';
import { ModalPhoneComponent } from './modal-phone/modal-phone.component';
import { DemoDialogComponent } from '../../company-list/demo-dialog/demo-dialog.component';
import { ActiveDialogModuleComponent } from '../rate-form/active-dialog-module/active-dialog-module.component';
declare var $;
@Component({
  selector: 'easyroute-companies-partners-form',
  templateUrl: './companies-partners-form.component.html',
  styleUrls: ['./companies-partners-form.component.scss']
})
export class CompaniesPartnersFormComponent implements OnInit, OnDestroy {

  @Input('company') company: Company;
  @Output('companies')
  companies: EventEmitter<any> = new EventEmitter();
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
  //company: Company;
  usuario_messages: any;
  company_messages: any;
  plan_messages: any;
  dateNow: NgbDateStruct = dateToObject(getToday());
  dateStart: any = null;
  dateEnd: any = null;
  dateCompletedIntegratio: any = null;
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
  table: any;
  toggleSecundaryPhone: boolean = true;
  listSecundaryPhone: any = [];
  phone: any = [];

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
    private ngZone: NgZone,
    private backendService: BackendService
  ) { }

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
        this.id = params['companie_id'];

        if (params['companie_id'] == 'new') {
           
            if (this.company.billingEmail.length > 0) {

                console.log(this.company, 'this.company');
               
                this.initForm(this.company, params['companie_id']);
            } else {
                
                this.company = new Company();

                this.initForm(this.company, params['companie_id']);
            }
            /* this.company = new Company();
            this.initForm(this.company, params['companie_id']); */
            this.load = true;

            this.loadingService.hideLoading();
            
        } else {
            this.companiesService.loadModules(params['companie_id']).subscribe(
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

            this.backendService.get('company_phone_list/' + params['companie_id']).pipe(take(1)).subscribe(({ data }) => {
                this.listSecundaryPhone = data;

                this.detectChange.detectChanges();
            })

            this.companiesService.getCompanyPartner(params['companie_id']).subscribe(
                (resp: any) => {
                    this.company = resp.data;
                    this.initForm(this.company, params['companie_id']);
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

    console.log(dataCompany, 'dataCompany');
   
    if (this.company.id > 0 && dataCompany && dataCompany.serviceType && dataCompany.serviceType.id > 0) {
        dataCompany.serviceTypeId =dataCompany.serviceType.id;
    }

    
    this.prefix = this.countrysWithPhone.find(
        (x: any) => x.country === dataCompany.country,
    )
        ? '+' +
        this.countrysWithPhone.find((x) => x.country === dataCompany.country).code
        : '+34';

    if (dataCompany.startDemoDate) {
        this.dateStart = dateToObject(dataCompany.startDemoDate);
    }

    if (dataCompany.endDemoDate) {
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
      /*   phone: [
            dataCompany.phone ? dataCompany.phone : '+34',
            [
                ValidatePhone(dataCompany.country ? dataCompany.country : 'España'),
                Validators.required,
            ],
        ], */
        phone: [
            dataCompany.phone ? dataCompany.phone : this.prefix,
            [
                Validators.required,
            ],
        ],
        billingEmail: [
            dataCompany.billingEmail,
            [Validators.required, Validators.email],
        ],
        vehicles: [
            dataCompany.vehicles ? dataCompany.vehicles: 0,
        ],
        //serviceTypeId: [dataCompany.serviceType !== null ? dataCompany.serviceType.id : ''],
        serviceTypeId: [ dataCompany.serviceTypeId && dataCompany.serviceTypeId !== null ? dataCompany.serviceTypeId : ''],
        isDemo: [dataCompany.isDemo],
        startDemoDate: [this.dateStart],
        endDemoDate: [this.dateEnd],
        autonomous: [dataCompany.autonomous],
        promotionCovid: [dataCompany.promotionCovid],
        companyProfileTypeId: [dataCompany.companyProfileTypeId ? dataCompany.companyProfileTypeId : 1],
        completedIntegration: [dataCompany.completedIntegration],
        stripeMonthlyPrice: [dataCompany.stripeMonthlyPrice, 
            [ 
                Validators.minLength(0), 
                Validators.maxLength(999999)
            ]],
        stripeMonthlyPriceIva: [dataCompany.stripeMonthlyPriceIva],
        phones:[]
        // currencyId: [ dataCompany.currencyId == 0 || dataCompany.currencyId == null ? 1 : dataCompany.currencyId ]
    });

    if (dataCompany.isDemo || !this.isAdmin()) {
       // this.createCompanyFormGroup.controls['isDemo'].disable();
        this.buttonDisabledStart = true;
        this.buttonDisabledEnd = true;
    }

    if (!dataCompany.isDemo) {
        this.buttonDisabledEnd = true;
    }

    if (id == 'new') {
        this.createCompanyFormGroup.addControl(
            'email',
            new FormControl(dataCompany.email, [Validators.email, Validators.required]),
        );
        this.createCompanyFormGroup.addControl(
            'name_user',
            new FormControl(dataCompany.name_user, [
                Validators.required,
                Validators.pattern('[A-Za-z ]+'),
                Validators.minLength(2),
                Validators.maxLength(50),
            ]),
        );
        this.createCompanyFormGroup.addControl(
            'surname',
            new FormControl(dataCompany.surname, [
                Validators.required,
                Validators.pattern('[A-Za-z ]+'),
                Validators.minLength(2),
                Validators.maxLength(50),
            ]),
        );
        this.createCompanyFormGroup.addControl(
            'nationalId',
            new FormControl(dataCompany.nationalId, [
                ValidateCompanyId(UtilData.COUNTRIES['ES']),
                Validators.required,
                Validators.maxLength(50),
            ]),
        );
        this.createCompanyFormGroup.addControl(
            'phone_user',
            new FormControl(dataCompany.phone_user ? dataCompany.phone_user : '+34', [Validators.required, ValidatePhone('España')]),
        );
        this.createCompanyFormGroup.addControl(
            'password',
            new FormControl(dataCompany.password, [Validators.minLength(8), Validators.required]),
        );
        this.createCompanyFormGroup.addControl(
            'password_confirmation',
            new FormControl(dataCompany.password_confirmation, [
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

    if(this.company.multiStore){
        setTimeout(() => this.loadFranchisesDatatable(), 100);
    }
    
    this.detectChange.detectChanges();

}

loadFranchisesDatatable() {
    let url = environment.apiUrl + 'company_franchise_datatables?companyId=' + this.company.id;

    let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();
    let table = '#franchises';

    this.table = $(table).DataTable({
        destroy: true,
        serverSide: true,
        processing: true,
        stateSave: true,
        cache: false,
        order: [0, 'desc'],
        lengthMenu: [5],
        stateSaveParams: function (settings, data) {
            data.search.search = "";
        },
        dom: `
        <"top-button-hide"><'point no-scroll-x table-responsive't>
        <'row reset'
          <'col-lg-12 col-md-12 col-12 d-flex flex-column justify-content-center align-items-lg-center align-items-md-center'p>
        >
    `,
        buttons: [
            {
                extend: 'colvis',
                text: this.translate.instant('GENERAL.SHOW/HIDE'),
                columnText: function (dt, idx, title) {
                    return idx + 1 + ': ' + title;
                },
            },
        ],
        language: environment.DataTableEspaniol,
        ajax: {
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                Authorization: tok,
            },
            error: (xhr, error, thrown) => {
                let html = '<div class="container" style="padding: 10px;">';
                html +=
                    '<span class="text-orange">Ha ocurrido un errror al procesar la informacion.</span> ';
                html +=
                    '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
                html += '</div>';

                $('#companies_processing').html(html);
            },
        },
        columns: [
            {
                data: 'name',
                title: this.translate.instant('COMPANIES.STORE_NAME'),
                render: (data, type, row) => {
                    let name = data;
                    if (name.length > 65) {
                        name = name.substr(0, 67) + '...';
                    }
                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        data +
                        '">' +
                        name +
                        '</span>'
                    );
                },
            },
            {
                data: 'nif',
                title: this.translate.instant('COMPANIES.CIF'),
                render: (data, type, row) => {
                    return data;
                },
            },
            {
                data: 'streetAddress',
                title: this.translate.instant('COMPANIES.DIRECTION'),
                render: (data, type, row) => {
                    return data;
                },
            }
        ],
    });
}

isAdmin() {
    return this.authLocal.getRoles()
        ? this.authLocal
            .getRoles()
            .find((role) => role === 1 || role === 3 || role === 8 || role === 17) !== undefined
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

startDemoDateConfirmar(group: AbstractControl) {
    let startDemoDate = objectToString(group.root.value.startDemoDate);
    let endDemoDate = objectToString(group.value);

    if (endDemoDate < startDemoDate) {
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

    let dataForm = _.cloneDeep(this.createCompanyFormGroup.value);

    if (this.isFormInvalid()) {
        this.toastService.displayWebsiteRelatedToast('The company is not valid'),
            this.translate.instant('GENERAL.ACCEPT');
    } else {

        dataForm.startDemoDate = objectToString(this.createCompanyFormGroup.value.startDemoDate);
        dataForm.endDemoDate = objectToString(this.createCompanyFormGroup.value.endDemoDate);

        if (!this.company.id || this.company.id === null) {

            dataForm.phones =this.listSecundaryPhone; 

            this.addCompany(dataForm);

        } else {

            delete dataForm.phones;

            this.editCompany([this.company.id, dataForm]);
            
        }
    }
}

isFormInvalid(): boolean {
    if (!this.company.id || this.company.id === null) {
        this.companies.emit( this.createCompanyFormGroup.value );
    }
    
    return !this.createCompanyFormGroup.valid;
}

addCompany(company: Company) {

    this.loadingService.showLoading();

    this.companiesService.addCompanyPartner(company).subscribe(
        (data: any) => {
            this.loadingService.hideLoading();
            this.toastService.displayWebsiteRelatedToast(
                this.translate.instant('GENERAL.REGISTRATION'),
                this.translate.instant('GENERAL.ACCEPT'),
            );
            this.company = undefined;
            this.ngZone.run(() => this.router.navigate(['/partners-super-admin/', data.data.id]).then());
            
            
        },
        (error) => {
            this.loadingService.hideLoading();
            this.toastService.displayHTTPErrorToast(error.error.code, error.error);
        },
    );
}

editCompany(obj: [number, Partial<Company>]) {

    this.loadingService.showLoading();

    this.companiesService.updateCompanyPartner(obj[0], obj[1]).subscribe(
        (data: any) => {
            this.loadingService.hideLoading();
            this.toastService.displayWebsiteRelatedToast(
                this.translate.instant('USERS.USER_UPDATED'),
                this.translate.instant('GENERAL.ACCEPT'),
            );
            this.company = undefined;
            this.ngZone.run(() => this.router.navigate(['/partners-super-admin']).then());
            
            
        },
        (error) => {
            this.loadingService.hideLoading();
            this.toastService.displayHTTPErrorToast(error.error.code, error.error);
        },
    );

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

public dateSuscription(date:any) {
    return moment(date).format('DD/MM/YYYY');
}


addSecundaryPhone() {

    let phone = {
        companyId: this.company.id,
        name:'',
        phone:''
    };
    const dialogRef = this.dialog.open(ModalPhoneComponent, {
        backdropClass: 'customBackdrop',
        centered: true,
        size: 'md',
        backdrop: 'static'

    });
    dialogRef.componentInstance.phone = phone;
    dialogRef.componentInstance.prefix = this.prefix;

    dialogRef.result.then((data) => {
        if (data && this.company.id > 0) {
            this.backendService.post('company_phone', data.data).pipe(take(1)).subscribe((response) => {
                if (response) {

                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('GENERAL.REGISTRATION'),
                        this.translate.instant('GENERAL.ACCEPT'),
                    );
                    this.backendService.get('company_phone_list/' + this.company.id).pipe(take(1)).subscribe(({ data }) => {
                        this.listSecundaryPhone = data;
                        this.detectChange.detectChanges();
                    })
                }
            })
        } else if (data && this.company.id === 0) {

            this.phone.push({
                name: data.data.name,
                phone: data.data.phone,
               
            });

            this.listSecundaryPhone = this.phone;
            this.detectChange.detectChanges();
            
        }
    })
}

editSecondaryPhone(item: any) {

    const dialogRef = this.dialog.open(ModalPhoneComponent, {
        backdropClass: 'customBackdrop',
        centered: true,
        size: 'md',
        backdrop: 'static'

    });
    dialogRef.componentInstance.phone = item;

    dialogRef.result.then((data) => {
        if (data && this.company.id > 0 ) {
            this.backendService.put('company_phone/' + item.id, data.data).pipe(take(1)).subscribe((response) => {
                if (response) {
                    this.backendService.get('company_phone_list/' + this.company.id).pipe(take(1)).subscribe(({ data }) => {
                        this.listSecundaryPhone = data;
                        this.detectChange.detectChanges();
                    });
                }
            });
        } else if (data && this.company.id === 0) {

            this.phone = this.phone.filter(x => x !== item);
            this.phone.push({
                name: data.data.name,
                phone: data.data.phone,
                isActive: true
            });

            this.listSecundaryPhone = this.phone;
            this.detectChange.detectChanges();
        }
    })
}


deleteSecundaryPhone(item: any) {

    const dialogRef = this.dialog.open(ModalConfirmPhoneComponent, {
        backdropClass: 'customBackdrop',
        centered: true,
        size: 'md',
        backdrop: 'static',

    });
    dialogRef.componentInstance.title = this.translate.instant(
        'GENERAL.CONFIRM_REQUEST',
    );
    dialogRef.componentInstance.message = this.translate.instant(
        'GENERAL.YOU_SURE_WANT_TO_DELETE_THIS_SELECTD_PHONE',
    );

    dialogRef.result.then((data) => {
        if (data && this.company.id > 0) {
            this.backendService.delete('company_phone/' + item).pipe(take(1)).subscribe((response) => {
                if (response) {
                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                        this.translate.instant('GENERAL.ACCEPT'),
                    );
                    this.backendService.get('company_phone_list/' + this.company.id).pipe(take(1)).subscribe(({ data }) => {
                        this.listSecundaryPhone = data;
                        this.detectChange.detectChanges();
                    });
                }
            });
        } else  {
             
        }
    })
}

showToggleSecundaryPhone() {

    this.toggleSecundaryPhone = !this.toggleSecundaryPhone;

    if (this.toggleSecundaryPhone && this.company.id > 0) {

        this.backendService.get('company_phone_list/' + this.company.id).pipe(take(1)).subscribe(({ data }) => {

            this.listSecundaryPhone = data;

            this.detectChange.detectChanges();

        })
    } else if (this.toggleSecundaryPhone && this.company.id === 0) {
        
        this.listSecundaryPhone = this.phone;
    }
}

/* eliminar phones cuando es creando */
deletePhone(echedule: any, id:any){

    let data = this.listSecundaryPhone.indexOf( echedule );

    if ( data !== -1 ) {
        this.listSecundaryPhone.splice( data, 1 );
    }

    this.detectChange.detectChanges();
    

}

ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
}

}
