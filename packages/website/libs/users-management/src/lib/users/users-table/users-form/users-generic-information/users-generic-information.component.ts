import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService, Company, Profile, User } from '@optimroute/backend';
import { LoadingService, ToastService, UserMessages, UtilData, ValidateCompanyId, ValidatePhone } from '@optimroute/shared';
import { StateCompaniesService } from '@optimroute/state-companies';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { StateUsersFacade } from '@optimroute/state-users';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { StateUsersService } from 'libs/state-users/src/lib/state-users.service';
import { UsersService } from '../../../users.service';
import { takeUntil, take } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { UsersConfirmDialogComponent } from '../../users-confirm-dialog/users-confirm-dialog.component';
import { AppPreferences } from '../../../../../../../backend/src/lib/types/preferences.type';
import { PreferencesFacade } from '../../../../../../../state-preferences/src/lib/+state/preferences.facade';


declare function init_plugins();
declare var $: any;

@Component({
  selector: 'easyroute-users-generic-information',
  templateUrl: './users-generic-information.component.html',
  styleUrls: ['./users-generic-information.component.scss']
})
export class UsersGenericInformationComponent implements OnInit, OnDestroy, OnChanges {
  
  @Input() idParam: any;
  @Input() me: boolean;
  @Input() isActiveUser: boolean;
  @Input() userTypeSelect: any;
  @Input() imgLoad: any;

  appPreferences$: Observable<AppPreferences>;

  createUserFormGroup: FormGroup;
  usuario_messages: any;
  userMe: any;
  user: User;

  countrys: any = [];
  countrysWithPhone: any = [];
  countrysWithCode: any = [];
  companies: Company[];

  unsubscribe$ = new Subject<void>();
  isTecnical: boolean = false;
  titleTranslate: string = 'USERS.ADD_USER';

  loadingSchedule: boolean = false;
  showPreparator: boolean = false;

  showCommercialAgentAdjustment: boolean = false;

  showCommercialDirectorAdjustment: boolean = false;

  showSuperAdmin: boolean = false;

  showAdminCompany: boolean = false;

  prefix: any;
  status: string;
  option: string;
  profile: Profile;
  profiles: any;

  isPartnerType: boolean = false;


  constructor(
        private fb: FormBuilder,
        private _profileSettingsFacade: ProfileSettingsFacade,
        private backendService: BackendService,
        private loadingService: LoadingService,
        private toastService: ToastService,
        private translate: TranslateService,
        private userService: UsersService,
        private usersFacade: StateUsersFacade,
        public authLocal: AuthLocalService,
        private companyService: StateCompaniesService,
        private router: Router,
        private detectChange: ChangeDetectorRef,
        private dialog: NgbModal,
        private stateUserService: StateUsersService,
        private facade: PreferencesFacade,
  ) { }

  ngOnInit() { }

  ngOnChanges() {

    this.isPartnersCompany();

    this.loadingService.showLoading();

    /* setTimeout(() => {
        init_plugins();
    }, 1000); */

    this.setUtilData();

    this._profileSettingsFacade.profile$.pipe(take(1)).subscribe(
        (resp) => {
            this.profile = resp;
            this.userMe = resp;
            this.validateRoute();
        },
        (error) => {
            console.log(error);
        },
    );

    this.appPreferences$ = this.facade.appPreferences$;
  }

  ngOnDestroy() {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
  }

  setUtilData() {
    this.countrys = UtilData.getCountry();
    this.countrysWithPhone = UtilData.getCountryPhoneCode();
    this.countrysWithCode = UtilData.getCountryWithCode();
  }

  validateRoute() {
  
    if (this.idParam === 'new') {

        this.isTecnical = false;
        this.user = new User();
    
        this.initForm(this.user);
        this.loadingService.hideLoading();

    } else {

        

        this.backendService.get(`users/${this.idParam}`).subscribe(
            ({ data }) => {
                this.user = {
                    email: data.email,
                    name: data.name,
                    surname: data.surname,
                    nationalId: data.nationalId,
                    phone: data.phone,
                    companyId: data.company.id,
                    isActive: data.isActive,
                    country: data.profile.country,
                    countryCode: data.company.countryCode,
                    id: data.id,
                    profiles: data.profiles,
                    allowedQuantityOrders: data.allowedQuantityOrders,
                    allowDeliveryNoteIdentificator: data.allowDeliveryNoteIdentificator,
                    deliveryNoteNomenclature: data.deliveryNoteNomenclature,
                    monthlyObjective: data.monthlyObjective,
                    commissionOrdersPercentage: data.commissionOrdersPercentage,
                    commissionOrdersAppPercentage: data.commissionOrdersAppPercentage,
                    urlImage: data.urlImage,
                    idERP: data.idERP
                };

                if (data.profiles && data.profiles.find((x) => x.id === 6)) {
                    this.isTecnical = true;
                }

                this.initForm(this.user);


                try{
                  
                  this.detectChange.detectChanges();
    
                } catch(e){
        
                }
                
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

  initForm(user: User) {
    this.status =
        +user.isActive === 1
            ? this.translate.instant('GENERAL.IS_ACTIVE')
            : this.translate.instant('GENERAL.IS_INACTIVE');
    this.option =
        +user.isActive === 1
            ? this.translate.instant('USERS.DEACTIVATE_USER')
            : this.translate.instant('USERS.ACTIVATE_USER');
    this.prefix = this.countrysWithPhone.find((x) => x.country === user.country)
        ? '+' + this.countrysWithPhone.find((x) => x.country === user.country).code
        : '+34';

    this.createUserFormGroup = this.fb.group({
        id: [user.id],
        email: [user.email, [Validators.email, Validators.required]],
        name: [
            user.name,
            [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
        ],
        surname: [
            user.surname,
            [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
        ],
        nationalId: [
            user.nationalId,
            [
                ValidateCompanyId(user.country ? user.country : 'España'),
                Validators.maxLength(50),
            ],
        ],
        phone: [
            user.phone ? user.phone : this.prefix,
            [
                ValidatePhone(user.country ? user.country : 'España'),
                Validators.required,
            ],
        ],
        country: [
            user.country ? user.country : this.profile.company.country,
            [Validators.required],
        ],
        companyId: [
            this.me ? this.userMe.profile.companyId : user.companyId,
            [Validators.required, Validators.min(1)],
        ],
        userTypeId:[user.userType !=null ? user.userType.id :1 ],
        countryCode: [user.countryCode ? user.countryCode : 'ES'],
        profiles: this.fb.array([]),
        password: ['', this.setPasswordValidators(user.id)],
        password_confirmation: ['', this.checkPasswords.bind(this)],
        allowedQuantityOrders: [user.allowedQuantityOrders],
        allowDeliveryNoteIdentificator: [user.allowDeliveryNoteIdentificator ? true : false],
        deliveryNoteNomenclature: [user.deliveryNoteNomenclature],
        monthlyObjective:[ user.monthlyObjective ,[ Validators.min(0) , Validators.max(99999) ]],
        commissionOrdersPercentage:[ user.commissionOrdersPercentage , [ Validators.min(0), Validators.max(99999)]],
        commissionOrdersAppPercentage:[ user.commissionOrdersAppPercentage, [ Validators.min(0), Validators.max(99999)]],
        urlImage: [user.urlImage],
        idERP: [user.idERP]
    });

    if (this.me && !this.isAdmin()) {
        this.createUserFormGroup.controls['companyId'].disable();
    } else {
        this.createUserFormGroup.controls['companyId'].enable();
    }
    this.userService.loadProfiles().subscribe(({ data }) => {
       
        this.profiles = data;
        this.addProfiles(user.profiles);
    });
    
    this.setCompanies();
    this.usuario_messages = new UserMessages().getUserMessages();

    console.log( this.createUserFormGroup.value, 'valor form');

  }

  isAdmin() {
    return this.authLocal.getRoles()
        ? this.authLocal
            .getRoles()
            .find((role) => role === 1 || role === 3 || role === 8) !== undefined
        : false;
  }

  setCompanies() {
    this.companyService
        .loadCompanies(this.me)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
            ({ data }) => 
            
            (this.companies = data),
            
            (error) => console.log(error),
        );
        
  }

  addProfiles(profiles: any[]) {

   
    this.profiles.map((o, i) => {

        let control: FormControl;

        if (profiles) {
            control = new FormControl(
                profiles.find((x) => x.name === o.name) != undefined,
            );

        } else {
            control = new FormControl(false);
        }

       
        (this.createUserFormGroup.controls.profiles as FormArray).push(control);

        
    });

   
  }

  setPasswordValidators(id: number) {
    if (id > 0) {
        return [Validators.minLength(8)];
    }

    return [Validators.required, Validators.minLength(8)];
  }

  checkPasswords(group: AbstractControl) {
    let pass = group.root.value.password;
    let confirmPass = group.value;

    return pass === confirmPass ? null : { confirmar: true };
  }

  changeCountry(value: string) {
    this.createUserFormGroup
        .get('countryCode')
        .setValue(this.countrysWithCode.find((x) => x.country === value).key);

    if (value != 'España') {
        this.prefix = this.countrysWithPhone.find((x) => x.country === value)
            ? '+' + this.countrysWithPhone.find((x) => x.country === value).code
            : '';
        this.createUserFormGroup.get('phone').setValue(this.prefix);
        this.createUserFormGroup
            .get('nationalId')
            .setValidators([Validators.maxLength(50)]);
        this.createUserFormGroup.get('nationalId').updateValueAndValidity();
    } else {
        this.prefix = '+34';
        this.createUserFormGroup.get('phone').setValue(this.prefix);
        this.createUserFormGroup
            .get('nationalId')
            .setValidators([ValidateCompanyId('España'), Validators.maxLength(50)]);
        this.createUserFormGroup.get('nationalId').updateValueAndValidity();
    }

    this.createUserFormGroup
        .get('phone')
        .setValidators([
            ValidatePhone(
                UtilData.COUNTRIES[
                this.countrysWithCode.find(
                    (x) =>
                        x.country === this.createUserFormGroup.get('country').value,
                ).key
                ],
            ),
            Validators.required,
        ]);

    this.createUserFormGroup.get('phone').updateValueAndValidity();
  }

  createUser(): void {
    
    if (this.user.id && this.user.id > 0) {
        this.editUser([this.user.id, this.obtainNewUser()]);
        this.usersFacade.updated$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                if (data) {
                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('USERS.USER_UPDATED'),
                        this.translate.instant('GENERAL.ACCEPT'),
                    );
                    if (this.me) {
                        this.router.navigateByUrl('management/users');
                    } else {
                        this.router.navigateByUrl('users-management/users');
                    }
                }
            });
    } else {
        this.addUser(this.obtainNewUser());
        this.usersFacade.added$
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((data) => {
              if (data) {
                  this.toastService.displayWebsiteRelatedToast(
                      this.translate.instant('USERS.USER_CREATED'),
                      this.translate.instant('GENERAL.ACCEPT'),
                  );
                  if (this.me) {
                      this.router.navigateByUrl('management/users');
                  } else {
                      this.router.navigateByUrl('users-management/users');
                  }
              }
          });
    }

  }

  obtainNewUser(): User {

    let user: User = {
        email: this.createUserFormGroup.get('email').value,
        name: this.createUserFormGroup.get('name').value,
        nationalId:
            this.createUserFormGroup.get('nationalId').value === ''
                ? null
                : this.createUserFormGroup.get('nationalId').value,
        phone: this.createUserFormGroup.get('phone').value,
        surname: this.createUserFormGroup.get('surname').value,
        profiles: this.getProfiles(),
        companyId: this.createUserFormGroup.get('companyId').value,
        password: this.createUserFormGroup.get('password').value,
        password_confirmation: this.createUserFormGroup.get('password_confirmation')
            .value,
        isActive: this.isActiveUser,
        country: this.createUserFormGroup.get('country').value,
        countryCode: this.createUserFormGroup.get('countryCode').value,
        allowedQuantityOrders: this.createUserFormGroup.get('allowedQuantityOrders').value,
        userTypeId: this.userTypeSelect, //Mandar por input
        allowDeliveryNoteIdentificator: this.createUserFormGroup.get('allowDeliveryNoteIdentificator').value,
        deliveryNoteNomenclature: this.createUserFormGroup.get('deliveryNoteNomenclature').value,
        monthlyObjective: this.createUserFormGroup.get('monthlyObjective').value,
        commissionOrdersPercentage: this.createUserFormGroup.get('commissionOrdersPercentage').value,
        commissionOrdersAppPercentage: this.createUserFormGroup.get('commissionOrdersAppPercentage').value,
        urlImage: this.imgLoad,
        idERP: this.createUserFormGroup.get('idERP').value
    };

    if (user.password == '') {
        delete user.password;
    }
    if (user.password_confirmation == '') {
        delete user.password_confirmation;
    }

    return user;

  }

  getProfiles() {
    const selectedOrderIds = this.createUserFormGroup.value.profiles

        .map((v, i) =>
            v
                ? {
                    id: this.profiles[i].id,
                    name: this.profiles[i].name,
                }
                : null,
        )
        .filter((v) => v !== null);

      
      this.validateAdmin(selectedOrderIds);

      this.validateAdminCompany(selectedOrderIds)

      this.validateRolAgent(selectedOrderIds);

      this.validateRolDirector(selectedOrderIds);

      this.getPreparator(selectedOrderIds);

      
      if (this.isPartnerType ) {

        let dataProfile ={
            id: 17,
            name :'partner'
        }

        selectedOrderIds.push(dataProfile);
      
      }

    return selectedOrderIds;
  }

  getPreparator(selectedOrderIds: any) {
    
   
    const dato = selectedOrderIds.find(x => x.name === 'Preparador') != undefined;

    let preparatorName = selectedOrderIds.find(x => x.name === 'Preparador');
    preparatorName ? Object.assign({}, name) : false

    if (preparatorName && preparatorName.name != undefined) {
        this.showPreparador(dato, preparatorName.name);
    }
  }

  selectPreparator(event: any, name: any) {

   // console.log(event, name, 'selectPreparator')

   switch (name) {
    case 'Preparador':

        this.showPreparador(event, name);
        
        break;

        case 'Director comercial':

            this.showCommercialDirector(event, name);

            break

            case 'Agente comercial':

                this.showCommercialAgent(event, name);

                case 'Admin':

                    this.showAdmin(event, name);

                    case 'Admin. Compañía':

                    this.showAdminCompanys(event, name);
            break
   
    default:
        break;
   }


  }

  validateAdminCompany(selectedOrder: any){
    
    
    const dato = selectedOrder.find(x =>  x.name === 'Admin. Compañía') != undefined;

    let preparatorName = selectedOrder.find(x =>  x.name === 'Admin. Compañía' );
    preparatorName ? Object.assign({}, name) : false;

   if (preparatorName && preparatorName.name != undefined) {

    this.showAdminCompanys(dato, preparatorName.name);

  }

}

showAdminCompanys(event: any, name: any){
    

     if (event && name === 'Admin. Compañía'){

        this.showAdminCompany = true;

    } 
     else if(!event && name === 'Admin. Compañía'){

        this.showAdminCompany = false;

    } 
}

  validateAdmin(selectedOrder: any){
    
    
    const dato = selectedOrder.find(x =>  x.name === 'Admin') != undefined;

    let preparatorName = selectedOrder.find(x =>  x.name === 'Admin' );
    preparatorName ? Object.assign({}, name) : false;

   if (preparatorName && preparatorName.name != undefined) {

    this.showAdmin(dato, preparatorName.name);

  }

}

showAdmin(event: any, name: any){
    

     if (event && name === 'Admin'){

        this.showSuperAdmin = true;

    } 
     else if(!event && name === 'Admin'){

        this.showSuperAdmin = false;

    } 
}

  showPreparador(event: any, name: any){

    if (event && name === 'Preparador') {

        this.showPreparator = true;

    } else if (!event && name === 'Preparador') {

        this.showPreparator = false;
    }
  }

   validateRolDirector(selectedOrder: any){
        
        
        const dato = selectedOrder.find(x =>   x.name === 'Director comercial') != undefined;
    
        let preparatorName = selectedOrder.find(x =>  x.name === 'Director comercial');
        preparatorName ? Object.assign({}, name) : false;
    
       if (preparatorName && preparatorName.name != undefined) {
    
        this.showCommercialDirector(dato, preparatorName.name);
    
      }
    
    }

  showCommercialDirector(event: any, name: any){
    

     if (event && name === 'Director comercial'){

        this.showCommercialDirectorAdjustment = true;

    } 
     else if(!event && name === 'Director comercial'){

        this.showCommercialDirectorAdjustment = false;

    } 
}

  validateRolAgent(selectedOrder: any){
    
    
    const dato = selectedOrder.find(x =>  x.name === 'Agente comercial') != undefined;

    let preparatorName = selectedOrder.find(x =>  x.name === 'Agente comercial' );
    preparatorName ? Object.assign({}, name) : false;

   if (preparatorName && preparatorName.name != undefined) {

    this.showCommercialAgent(dato, preparatorName.name);

  }

}

showCommercialAgent(event: any, name: any){
    

     if (event && name === 'Agente comercial'){

        this.showCommercialAgentAdjustment = true;

    } 
     else if(!event && name === 'Agente comercial'){

        this.showCommercialAgentAdjustment = false;

    } 
}



  addUser(user: User) {
    this.usersFacade.addUser(user);
  }
  
  editUser(obj: [number, Partial<User>]) {
      this.usersFacade.editUser(obj[0], obj[1]);
  }

  inactiveUser(user: User, i?: number) {
    let profiles = this.getProfiles();
    let profileAccept =
        profiles &&
            profiles.length > 1 &&
            profiles.find((x) => x.id === 6) === undefined
            ? true
            : profiles.length > 1 && profiles.find((x) => x.id === 6)
                ? true
                : profiles.length === 1 && profiles.find((x) => x.id !== 6)
                    ? true
                    : false;

    let title = 'USERS.DEACTIVATE_USER_QUESTION';
    let info = 'USERS.DEACTIVATE_USER_INFO';
    let buttonAccept = 'GENERAL.DEACTIVATE';

    if (
        this.profile &&
        this.profile.company &&
        this.profile.company.subscriptions &&
        this.profile.company.subscriptions.length > 0 &&
        profileAccept
    ) {
        this.loadingService.showLoading();

        console.log('******** Gestion ********');
        this.companyService
            .costPlan()
            .pipe(take(1))
            .subscribe(
                (data) => {
                    this.loadingService.hideLoading();
                    const dialogRef = this.dialog.open(UsersConfirmDialogComponent, {
                        backdropClass: 'customBackdrop',
                        centered: true,
                        backdrop: 'static',
                    });

                    dialogRef.componentInstance.title = title;
                    dialogRef.componentInstance.user = user;
                    dialogRef.componentInstance.info = info;
                    dialogRef.componentInstance.buttonAccept = buttonAccept;
                    dialogRef.result
                        .then((resp) => {
                            if (resp) {
                                this.loadingService.showLoading();
                                this.stateUserService
                                    .deactivate(user.id)
                                    .pipe(take(1))
                                    .subscribe(
                                        () => {
                                            this.loadingService.hideLoading();
                                            this.validateRoute();
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
                        })
                        .catch((error) => console.log(error));
                },
                (error) => {
                    this.loadingService.hideLoading();
                    this.toastService.displayHTTPErrorToast(error.status, error.error.error);
                },
            );
        } else {
    
            console.log('******** Gestion de usuarios ********');
            const dialogRef = this.dialog.open(UsersConfirmDialogComponent, {
                backdropClass: 'customBackdrop',
                centered: true,
                backdrop: 'static',
            });
            dialogRef.componentInstance.title = title;
            dialogRef.componentInstance.info = info;
            dialogRef.componentInstance.user = user;
            dialogRef.componentInstance.buttonAccept = buttonAccept;
            dialogRef.result
                .then((resp) => {
                    if (resp) {
                        this.loadingService.showLoading();
                        this.stateUserService
                            .deactivate(user.id)
                            .pipe(take(1))
                            .subscribe(
                                () => {
                                    this.loadingService.hideLoading();
                                    this.validateRoute();
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
                })
                .catch((error) => console.log(error));
        }
    }

    activeUser(user: User, i?: number) {
        let profiles = this.getProfiles();
        let profileAccept =
            profiles &&
                profiles.length > 1 &&
                profiles.find((x) => x.id === 6) === undefined
                ? true
                : profiles.length > 1 && profiles.find((x) => x.id === 6)
                    ? true
                    : profiles.length === 1 && profiles.find((x) => x.id !== 6)
                        ? true
                        : false;

        let title = 'USERS.ACTIVATE_USER_QUESTION';
        let info = 'USERS.ACTIVATE_USER_INFO';
        let buttonAccept = 'GENERAL.ACTIVATE';

        if (
            this.profile &&
            this.profile.company &&
            this.profile.company.subscriptions &&
            this.profile.company.subscriptions.length > 0 &&
            profileAccept
        ) {
            this.loadingService.showLoading();
            this.companyService
                .costPlan()
                .pipe(take(1))
                .subscribe(
                    (data) => {
                        this.loadingService.hideLoading();
                        const dialogRef = this.dialog.open(UsersConfirmDialogComponent, {
                            backdropClass: 'customBackdrop',
                            centered: true,
                            backdrop: 'static',
                        });
                        dialogRef.componentInstance.title = title;
                        dialogRef.componentInstance.info = info;
                        dialogRef.componentInstance.user = user;
                        dialogRef.componentInstance.buttonAccept = buttonAccept;
                        dialogRef.result
                            .then((resp) => {
                                if (resp) {
                                    this.loadingService.showLoading();
                                    this.stateUserService
                                        .activate(user.id)
                                        .pipe(take(1))
                                        .subscribe(
                                            () => {
                                                this.loadingService.hideLoading();
                                                this.validateRoute();
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
                            })
                            .catch((error) => console.log(error));
                    },
                    (error) => {
                        this.loadingService.hideLoading();
                        this.toastService.displayHTTPErrorToast(error.status, error.error.error);
                    },
                );
        } else {
            const dialogRef = this.dialog.open(UsersConfirmDialogComponent, {
                backdropClass: 'customBackdrop',
                centered: true,
                backdrop: 'static',
            });
            dialogRef.componentInstance.title = title;
            dialogRef.componentInstance.info = info;
            dialogRef.componentInstance.user = user;
            dialogRef.componentInstance.buttonAccept = buttonAccept;
            dialogRef.result
                .then((resp) => {
                    if (resp) {
                        this.loadingService.showLoading();
                        this.stateUserService
                            .activate(user.id)
                            .pipe(take(1))
                            .subscribe(
                                () => {
                                    this.loadingService.hideLoading();
                                    this.validateRoute();
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
                })
                .catch((error) => console.log(error));
        }
    }

    changeAllowDeliveryNoteIdentification(value){
        if(value){
            this.createUserFormGroup.get('deliveryNoteNomenclature').setValidators(Validators.required);
            this.createUserFormGroup.get('deliveryNoteNomenclature').updateValueAndValidity();
        } else {
            this.createUserFormGroup.get('deliveryNoteNomenclature').setValidators([]);
            this.createUserFormGroup.get('deliveryNoteNomenclature').updateValueAndValidity();
        }
    }

    Partners() {

    
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 17) !== undefined
            : false;
    }

    isPartnersCompany(){
        const prefereces = JSON.parse(localStorage.getItem('company'));

        this.isPartnerType = prefereces.isPartnerType;

    }



}
