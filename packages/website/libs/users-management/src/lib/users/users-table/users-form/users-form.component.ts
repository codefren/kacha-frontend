
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
} from '@angular/forms';
import {
    UserMessages,
    LoadingService,
    ToastService,
} from '@optimroute/shared';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { User, BackendService, Profile } from '@optimroute/backend';
import { takeUntil, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../../users.service';
import { StateUsersFacade } from '@optimroute/state-users';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import * as moment from 'moment';
import { ProfileSettingsFacade } from '../../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAvatarComponent } from './modal-avatar/modal-avatar.component';


declare var $: any;


@Component({
    selector: 'easyroute-users-form',
    templateUrl: './users-form.component.html',
    styleUrls: ['./users-form.component.scss'],
})
export class UsersFormComponent implements OnInit, OnDestroy {
    createUserFormGroup: FormGroup;
    profiles: any;
    usuario_messages: any;
    user: User;
    me: boolean;
    unsubscribe$ = new Subject<void>();
    status: string;
    option: string;
    profile: Profile;
    isTecnical: boolean = false;
    showPreparator: boolean = false;
    toggleSchedule: boolean = true;
    loadingSchedule: boolean = false;
    userType: any

    imgLoad: string = 'default.png';

    select: string = 'generic_information';
    change = {
        generic_information: 'generic_information',
        carnets: 'carnets',
        hours: 'hours',
        documentation: 'documentation',
        costs: 'costs',
    };

    idParam: string;

    isActiveUser: boolean = true;

   userTypeSelect :number = 1;

   redirect: any;

   isPartnerType: boolean = false;

    constructor(
        private fb: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private backendService: BackendService,
        private loadingService: LoadingService,
        private toastService: ToastService,
        private translate: TranslateService,
        private userService: UsersService,
        private usersFacade: StateUsersFacade,
        public authLocal: AuthLocalService,
        private loading: LoadingService,
        private toast: ToastService,
        private detectChange: ChangeDetectorRef,
        public facadeProfile: ProfileSettingsFacade,
        private dialog: NgbModal,
        private router: Router,
    ) { }

    ngOnInit() {
        this.loadingService.showLoading();

        this.facadeProfile.loaded$.pipe(take(1)).subscribe((loaded) => {
            if (loaded) {

                this.facadeProfile.profile$
                    .pipe(takeUntil(this.unsubscribe$))
                    .subscribe((data) => {

                        this.profile = data;
                    });
            }
        });

        this.isPartnersCompany();
        
        this.validateRoute();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    loadImage() {
        const modal = this.dialog.open(ModalAvatarComponent, {
            backdropClass: 'modal-backdrop-ticket',
            windowClass:'modal-view-avatar',
            size:'lg',
            backdrop: 'static'
        });

        modal.componentInstance.imgLoad = this.imgLoad;

        modal.result.then(
            (data) => {
                if (data[0]) {

                    this.handleUpdateImage(data[1])

                    this.detectChange.detectChanges();

                }
            },
            (reason) => { },
        );
    }

    handleUpdateImage(image: any) {

        if (this.user.id > 0) {

            this.imgLoad = image;
            
            this.loading.showLoading();

            this.backendService.put(`user_update_image/${ this.user.id}`,{urlImage:image}).subscribe(
                ({ data }) => {
                   
                    this.toastService.displayWebsiteRelatedToast(
                        this.translate.instant('CONFIGURATIONS.UPDATE_NOTIFICATIONS'),
                        this.translate.instant('GENERAL.ACCEPT'),
                    );
        
                    this.validateRoute();
                   
                    this.loadingService.hideLoading();
                },
                (error) => {
                    this.toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
    
        
        } else {

            this.imgLoad = image;

            this.detectChange.detectChanges();
        }
    }

    showToggleSchedule() {

        this.toggleSchedule = !this.toggleSchedule;
    }

    validateRoute() {
        this._activatedRoute.params.subscribe(({ id, me }) => {

            this.idParam = id;
            this.me = me ? true : false;

            if (id === 'new') {

                this.isTecnical = false;
                this.user = new User();
                this.user.userType.id = this.userTypeSelect;
                this.initForm(this.user);
                this.loadingService.hideLoading();
                
            } else {

                this.getUrl();
                
                this.backendService.get(`users/${id}`).subscribe(
                    ({ data }) => {
                        
                        
                        this.user = {
                            email: data.email,
                            name: data.name,
                            surname: data.surname,
                            isActive: data.isActive,
                            profiles: data.profiles,
                            id: data.id,
                            userType:data.userType,
                            createdAt:  data.createdAt,
                            created_by_user: data.created_by_user,
                            urlImage: data.urlImage
                        };

                        if (data.profiles && data.profiles.find((x) => x.id === 6)) {
                            this.isTecnical = true;
                        }
                        
                        this.initForm(this.user);
                        
                        if (this.user.urlImage) {
                            this.imgLoad = this.user.urlImage;
                        }

                        this.userTypeSelect = this.user && this.user.userType && this.user.userType.id ? this.user && this.user.userType && this.user.userType.id:null;

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
        });
    }

    initForm(user: User) {

        this.createUserFormGroup = this.fb.group({
            id: [user.id],
            profiles: this.fb.array([]),
            isActive: [user.isActive],
            userTypeId:[user.userType !=null ? user.userType.id :1 ],
        });

        this.userService.loadProfiles().subscribe(({ data }) => {
            this.profiles = data;
            this.addProfiles(user.profiles);
        }); 
        this.userService.getUser().subscribe(({ data }) => {
            this.userType = data;
            
        });
  
        this.usuario_messages = new UserMessages().getUserMessages();
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

    returnsDate(date:any){

        if (date) {
            return moment(date).format('DD/MM/YYYY')
        } else {
            return '00/00/0000'
        }
    }

    changePage(name: string) {
        
        this.select = this.change[name];
    
        this.detectChange.detectChanges();
    }

    changeUserType(event: any){

        this.userTypeSelect = event;

        if (this.user && this.user.id >0) {
           
            this.editUser([this.user.id, this.obtainNewUser()]);
            this.usersFacade.updated$
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((data) => {
                  
                    if (data) {
                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('USERS.USER_UPDATED'),
                            this.translate.instant('GENERAL.ACCEPT'),
                        );

                    }
                });
        }

        
    }

    onItemChange(value){
        console.log(" Value is : ", value );
     }

    changeActive(event: any){
        this.isActiveUser = event;
        this.user.isActive = event;

        if (this.user && this.user.id >0) {
           
            this.editUser([this.user.id, this.obtainNewUser()]);
            this.usersFacade.updated$
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((data) => {
                    if (data) {
                        this.toastService.displayWebsiteRelatedToast(
                            this.translate.instant('USERS.USER_UPDATED'),
                            this.translate.instant('GENERAL.ACCEPT'),
                        );
                    }
                });
        }
    }

    editUser(obj: [number, Partial<User>]) {
        this.usersFacade.editUser(obj[0], obj[1]);
    }
    
    obtainNewUser(): User {

        let user: User = {
            email: this.user.email,
            isActive: this.isActiveUser,
            surname: this.user.surname,
            name: this.user.name,
            profiles: this.getProfiles(),
            userTypeId: this.userTypeSelect,
        };

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
        this.getPreparator(selectedOrderIds);
    
        return selectedOrderIds;
    }

    getPreparator(selectedOrderIds: any) {
        const dato = selectedOrderIds.find(x => x.name === 'Preparador') != undefined;
    
        let preparatorName = selectedOrderIds.find(x => x.name === 'Preparador');
        preparatorName ? Object.assign({}, name) : false
    
        if (preparatorName && preparatorName.name != undefined) {
            this.selectPreparator(dato, preparatorName.name);
        }
    }
    
    selectPreparator(event: any, name: any) {
         
        if (event && name === 'Preparador') {
            this.showPreparator = true;
        } else if (!event && name === 'Preparador') {
            this.showPreparator = false;
        }
    
    }

    changeText(data: any){

        return data.replace( 'Empleado', 'Empresa')

    }

    showNotTraffic(){
        return this.authLocal.getRoles()
        ? this.authLocal.getRoles().find((role) => role != 16) !==
        undefined
        : false;
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

    getUrl(){
        this._activatedRoute.params.subscribe((params) => {
    
            this.idParam = params['id'];
    
            this.redirect = params['redirect'];

            if ( this.idParam  &&  this.redirect){
        
               switch (this.redirect) {
        
                case 'carnets':
        
                  this.select ='carnets';
        
                  break;
               
                default:
                  this.select = this.change['generic_information'];
                  break;
               }
            }

            this.detectChange.detectChanges();

        });
    }


    returnsList(){

        if (this.redirect == 'carnets' || this.redirect == 'generic_information') {

            this.router.navigate(['notifications']);
            
        } else {

            if (this.me) {

                this.router.navigate(['management/users']);
                
            } else {

                this.router.navigate(['users-management/users']);

            }

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
