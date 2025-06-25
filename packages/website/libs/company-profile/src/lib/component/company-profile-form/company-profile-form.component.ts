import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CompanyProfile, Profile } from '../../../../../backend/src/lib/types/profile.type';
import { take } from 'rxjs/operators';
import { StateCompaniesFacade } from '../../../../../state-companies/src/lib/+state/state-companies.facade';
import { ToastService } from '../../../../../shared/src/lib/services/toast.service';
import { ProfileSettingsFacade } from '../../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BackendService } from '../../../../../backend/src/lib/backend.service';
@Component({
  selector: 'easyroute-company-profile-form',
  templateUrl: './company-profile-form.component.html',
  styleUrls: ['./company-profile-form.component.scss']
})
export class CompanyProfileFormComponent implements OnInit {

  profile$: Observable<Profile>;

  select: string ='sheetRoute';

  change = {
    sheetRoute: 'sheetRoute',
    deliveryNotes: 'deliveryNotes',
    summary: 'summary',
};

imageError: string = '';

imgLoad: string ='';

date = new Date();

cardImageBase64: string;

isImageSaved: boolean;

email: any;

profileSnapShot: {
  profile: Profile['profile'];
  address: Profile['address'];
  company: Profile['company'];
};

profile

  constructor(
    private detectChanges: ChangeDetectorRef,
    private companyFacade: StateCompaniesFacade,
    private toastService: ToastService,
    private facade: ProfileSettingsFacade,
    private _translate: TranslateService
  ) { }

  ngOnInit() {

    this.profile$ = this.facade.profile$;
    this.profile$.pipe(
        take(1),
        // tap( ( data ) => console.log( data ) )
    ).subscribe((profile) => {
        if (profile) {
           console.log(profile, 'profile');

           this.email = profile.email;
            
            this.profileSnapShot = {
                profile: profile.profile,
                address: profile.address,
                company: profile.company,
            };

            this.profile =  this.profileSnapShot;
         
            this.detectChanges.detectChanges();
        }
    });
  }

  changePage(name: string) {
        
    this.select = this.change[name];

    this.detectChanges.detectChanges();
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

                    this.detectChanges.detectChanges();
                    //  this.removeImage();
                    const imgBase64Path = e.target.result;
                    this.cardImageBase64 = imgBase64Path;
                    console.log(this.cardImageBase64 ,'this.cardImageBase64 ')
                   // this.companiesForm.get('logo').setValue(imgBase64Path);
                    this.isImageSaved = true;
                    this.updateCompany(true);
                    this.detectChanges.detectChanges();
                    return true;

                } else {
                    const imgBase64Path = e.target.result;
                    this.cardImageBase64 = imgBase64Path;

                    console.log(this.cardImageBase64 ,'this.cardImageBase64 ')
                   // this.companiesForm.get('logo').setValue(imgBase64Path);
                    this.isImageSaved = true;
                    this.updateCompany(true);
                    this.detectChanges.detectChanges();
                }
            };
        };

        reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  removeImage() {
   // this.companiesForm.get('logo').setValue('');
    this.cardImageBase64 = null;
    this.isImageSaved = false;
  }

  updateCompany(changeLogo: boolean = false) {
  
    const newElement: CompanyProfile = {
  
       id:this.profileSnapShot.company.id,
  
       name: this.profileSnapShot.company.name,
  
       country: this.profileSnapShot.company.country,
  
       countryCode: this.profileSnapShot.company.countryCode,
  
       province: this.profileSnapShot.company.province,
  
       streetAddress: this.profileSnapShot.company.streetAddress,
  
       zipCode: this.profileSnapShot.company.zipCode,
  
       serviceTypeId: this.profileSnapShot.company.serviceTypeId,
  
       billingEmail: this.profileSnapShot.company.billingEmail,
  
       accountNumber: null,
  
       logo: this.cardImageBase64,
  
       currencyId: this.profileSnapShot && this.profileSnapShot.company && this.profileSnapShot.company.currency && this.profileSnapShot.company.currency.id ,
  
       termsAccepted: this.profile.company.termsAccepted,
  
       nif: this.profileSnapShot.company.nif,
  
       phone: this.profileSnapShot.company.phone
  
    };
  
    this.companyFacade.editCompany(newElement.id, newElement);
  
    this.companyFacade.updated$.pipe(take(1)).subscribe((updated) => {
  
     
        this.profileSnapShot.company = newElement;
  
        this.profile =  this.profileSnapShot;
           
        if (!changeLogo) {
  
            this.profileSnapShot.company = newElement;
        }
  
        //this.refreshCompany(this.profileSnapShot);
        this.toastService.displayWebsiteRelatedToast(
  
            this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
  
            this._translate.instant('GENERAL.ACCEPT')
  
        );
  
        this.detectChanges.detectChanges();
  
        setTimeout(() => {
  
            return this.facade.loadAll();
  
        }, 4000);
  
    });
  
  }

  returmDatehigh(date: any){
  
    if (date) {
  
      return moment(date).format('DD/MM/YYYY');
      
    } else {
  
      return '';
      
    }
  
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
