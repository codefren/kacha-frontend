import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@optimroute/backend';
import { LoadingService, ToastService } from '@optimroute/shared';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-app-lite-preferences',
  templateUrl: './app-lite-preferences.component.html',
  styleUrls: ['./app-lite-preferences.component.scss']
})
export class AppLitePreferencesComponent implements OnInit {

  constructor(private backend: BackendService,
    private detectChange: ChangeDetectorRef,
    private loading: LoadingService,
    private toast: ToastService,
    private translate: TranslateService,
    private fb: FormBuilder) { }

  appLitePreferences: any = {
    urlImage: null
  };
  cardImageBase64: any;
  date = new Date();
  imageError: any;
  form: FormGroup;
  isImageSaved: boolean;
  ngOnInit() {
    this.load();
  }

  async load(){

    this.form = this.fb.group({
      logo: [],
    });
    await this.loading.showLoading();

    this.backend.get('company_preference_lite').pipe(take(1)).subscribe(({data})=>{

      this.appLitePreferences = data;
      this.detectChange.detectChanges();
      this.loading.hideLoading();

    }, error => {

      this.loading.hideLoading();
      this.toast.displayHTTPErrorToast(error.status, error.error.error);

    });
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
              this.translate.instant('GENERAL.RECOMMENDED_SIZE')


            this.detectChange.detectChanges();
            //  this.removeImage();
            const imgBase64Path = e.target.result;
            this.cardImageBase64 = imgBase64Path;
            this.form.get('logo').setValue(imgBase64Path);
            this.isImageSaved = true;
            this.updateCompany();
            this.detectChange.detectChanges();
            return true;

          } else {
            const imgBase64Path = e.target.result;
            this.cardImageBase64 = imgBase64Path;
            this.form.get('logo').setValue(imgBase64Path);
            this.isImageSaved = true;
            this.updateCompany();
            this.detectChange.detectChanges();
          }
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  removeImage() {
    this.form.get('logo').setValue('');
    this.cardImageBase64 = null;
    this.isImageSaved = false;
  }

  updateCompany() {

    this.backend.post('company_preference_lite', {
      image: this.form.value.logo
    }).pipe(take(1)).subscribe(({data})=>{

      this.toast.displayWebsiteRelatedToast( 
        this.translate.instant('GENERAL.UPDATE_SUCCESSFUL'), 
        this.translate.instant('GENERAL.ACCEPT'))
      console.log(data);
    });

    /* this.companyFacade.editCompany(newElement.id, newElement);
    this.companyFacade.updated$.pipe(take(1)).subscribe((updated) => {

        this.profileSnapShot.company = newElement;
        if (!changeLogo) {
            this.profileSnapShot.company = newElement;
        }

        this.refreshCompany(this.profileSnapShot);
        this.toastService.displayWebsiteRelatedToast(
            this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
            this._translate.instant('GENERAL.ACCEPT')
        );
        this.detectChange.detectChanges();
        setTimeout(() => {
            return this.facade.loadAll();
        }, 4000);
    }); */

}


}
