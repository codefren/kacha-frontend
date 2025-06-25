import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '../../../../../backend/src/lib/backend.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { Profile } from '../../../../../backend/src/lib/types/profile.type';
import { ProfileMessages } from '../../messages/profile/profile.messages';
import { ProfileSettingsFacade } from '../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { UtilData } from '../../validators/util-data';
import { Observable } from 'rxjs';
import { PasswordMessages } from '../../messages/password/password.messages';

@Component({
  selector: 'easyroute-modal-my-profile',
  templateUrl: './modal-my-profile.component.html',
  styleUrls: ['./modal-my-profile.component.scss']
})
export class ModalMyProfileComponent implements OnInit {

  data: any;
  
 

  profileSettingsGroup: FormGroup; 


  showChangePass: boolean = false;

  profile: any;

  prefix: any;

  profile$: Observable<Profile>;

  countrysWithPhone: any = [];

  profileMessages: any;

  profileSnapShot: {
    profile: Profile['profile'];
    address: Profile['address'];
    company: Profile['company'];
};
email: string;

changePasswordForm: FormGroup;

passwordMessages: any;


  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private translate: TranslateService,
    private backendService: BackendService,
    private facade: ProfileSettingsFacade,
    public activeModal: NgbActiveModal,
    private detectChanges: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.prefix = '+34';

    this.countrysWithPhone = UtilData.getCountryPhoneCode();

    this.profile$ = this.facade.profile$;
    this.profile$.pipe(
        take(1),
        // tap( ( data ) => console.log( data ) )
    ).subscribe((profile) => {
        if (profile) {


          this.profile = profile;
            console.log(this.profile, 'this.profile'); // obtiene toda la data de perfil  
            this.email = profile.email;
            this.profileSnapShot = {
                profile: profile.profile,
                address: profile.address,
                company: profile.company,
            };
           
            this.countrysWithPhone = UtilData.getCountryPhoneCode();
            
            this.refreshDataProfile({
                profile: profile.profile,
                address: profile.address,
                company: profile.company,
            });
            this.detectChanges.detectChanges();
        }
    });
    this.changePasswordInit();
  }
  

    async refreshDataProfile(profile: {
      profile: Profile['profile'];
      address: Profile['address'];
      company: Profile['company'];
  }) {
     
      console.log(this.profile, 'this.profile');
      this.prefix = this.countrysWithPhone.find(x => x.country === profile.profile.country) ? '+' + this.countrysWithPhone.find(x => x.country === profile.profile.country).code : '+34';
      this.profileSettingsGroup = this.fb.group({
          name: [
              profile.profile.name,
              [
                  Validators.required,
                  Validators.pattern('[A-Za-z ]+'),
                  Validators.maxLength(50),
                  Validators.minLength(2),
              ],
          ],
          surname: [
              profile.profile.surname,
              [
                  Validators.required,
                  Validators.pattern('[A-Za-z ]+'),
                  Validators.maxLength(50),
                  Validators.minLength(2),
              ],
          ],
          nationalId: [
              profile.profile.nationalId,
              [
                  //Validators.required,
                  Validators.maxLength(50),
              ],
          ],
          /*  phone: [
               profile.profile.phone,
               [   ValidatePhone(
                   profile.profile.country ? profile.profile.country : 'España'
                   ),
                   Validators.required
               ],
           ], */
          phone: [
              profile.profile.phone ? profile.profile.phone : this.prefix,
          ],
      });
  
      this.profileSettingsGroup.updateValueAndValidity();
  
      const validationMessagesProfile = new ProfileMessages();
      this.profileMessages = validationMessagesProfile.getUserMessages();
      this.detectChanges.detectChanges();
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
            this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
            this.translate.instant('GENERAL.ACCEPT')
        );
        if (this.showChangePass) {
          this.changePassword();
        } else {
          this.activeModal.close(true);
        }
    }
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

  formIsCorrect(): boolean {
    return !(
        this.profileSettingsGroup.get('name').invalid ||
        this.profileSettingsGroup.get('surname').invalid ||
        this.profileSettingsGroup.get('nationalId').invalid ||
        this.profileSettingsGroup.get('phone').invalid
    );
}


  close(){
    this.activeModal.close(false);

  }



  submit(){
   /*  
    if (this.ExpenseTypeForm.valid) {

      let data ={

        providerId: this.ExpenseTypeForm.value.providerId,

        providerTypeConceptId:this.ExpenseTypeForm.value.providerTypeConceptId
      }

      
      this.backendService.post('route_sheet_concept_preference', data).pipe(take(1)).subscribe((data)=>{

        this.toastService.displayWebsiteRelatedToast(
          this.translate.instant('CONFIGURATIONS.REGISTRATION'),
      );

        this.activeModal.close(true);
    
        }, error => {
  
          this.showConcept = true;
        
    
          this.toastService.displayHTTPErrorToast(error.status, error.error.error);
        });
    } */
  }

  showChangePassword(){
    this.showChangePass =!this.showChangePass;
  }

  /* cambiar contraseña */

  changePasswordInit() {

    this.changePasswordForm = this.fb.group({

        password: ['', [Validators.required, Validators.minLength(8)]],

        password_confirmation: ['', [Validators.required, Validators.minLength(8)]],

        current_password: ['', [Validators.required, Validators.minLength(8)]],

    });

    this.changePasswordForm.controls['password_confirmation'].setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(40),
        this.ConfirmarPassword.bind(this.changePasswordForm),
    ]);

    const validationsMessagesPassword = new PasswordMessages();

    this.passwordMessages = validationsMessagesPassword.getPasswordMessages();
  }

  ConfirmarPassword(control: FormControl): { [s: string]: boolean } {
      let formulario: any = this;
  
      if (control.value !== formulario.controls['password'].value) {
          return {
              confirmar: true,
          };
      }
  
      return null;
  }

  changePassword() {

    if (this.changePasswordForm.valid) {

        this.backendService.post('change_password',this.changePasswordForm.value).subscribe(

            (data: any) => {

                this.changePasswordForm.reset();

                this.toastService.displayWebsiteRelatedToast(

                    'Se actualizo con éxito la contraseña',
                    this.translate.instant('GENERAL.ACCEPT')
                    
                );

                this.activeModal.close(true);
            },

            (error) => {
                this.toastService.displayHTTPErrorToast(error.status, error.error);
            },

        );
    }
}

cancelChangePasswork(){
  this.changePasswordForm.reset();
  this.showChangePass =!this.showChangePass;
}



}
