import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthLocalService } from '@optimroute/auth-local';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendService } from '@optimroute/backend';
import { take } from 'rxjs/operators';

@Component({
    selector: 'easyroute-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPassword: FormGroup;

  img: string;

  errorMessage: string;

  // Loading
  loading: string = '';

  logo: string = '';


  constructor(
      private authLocal: AuthLocalService,
      private detectChange: ChangeDetectorRef,
      public routerActivated: ActivatedRoute,
      private _backend: BackendService
  ) {
      this.img = 'url(assets/images/background/fondo-login.png)';
  }

  ngOnInit() {

      // Identificando si la url tiene polpoo
      let hostname = window.location.hostname;
      let include = hostname.includes('polpoo.com');
  
      if (!include) {
    
        this.bookForUrlCompanyPartner(hostname);
      
      } else {
      
        this.logo = 'assets/icons/logopolpo.png';
      
      }

      this.resetPassword = new FormGroup({
          password: new FormControl('', [Validators.required, Validators.required]),
          password_confirmation: new FormControl(''),
      });

      this.resetPassword.controls['password_confirmation'].setValidators([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(40),
          this.ConfirmarPassword.bind(this.resetPassword),
      ]);

      this.load();
  }

  bookForUrlCompanyPartner(value: any) {

    this.logo = '';

    this._backend.post_client('company_parents_data_url',
    {
        urlPartnerType: value
    })
    .pipe(take(1))
    .subscribe(( data ) => {

        if (data && data.activeLogoNomenclature && data.urlLogoTypePartner != null) {
            
            this.logo = data.urlLogoTypePartner;
            
        } else {

          this.logo = 'assets/icons/logopolpo.png';

        }

        this.detectChange.detectChanges();

    })

  }

  load() {
    localStorage.removeItem('token');

    this.loading = 'loading';
    
    // console.log(this.loading);

    this.authLocal.clientCredentials().then((resp: any) => {

        localStorage.setItem('token', resp.access_token);
        console.log('dsdasdasd')
        this.routerActivated.params.subscribe((params) => {
            console.log(params,'params')
            if (params['token'] !== '') {
                if (params['client'] === 'client') {
                    this.validateCLientToken(params['token']);
                } else if (params['client'] === 'miwigo') {
                    this.validateMiwigoToken(params['token']);
                } else {
                    this.validateAdminToken(params['token']);
                }
            } else {
                // console.log('entro en el else');
                this.errorMessage = '¡Token inválido!';
                this.loading = 'error';
                this.detectChange.detectChanges();
            }
        });
    })
    .catch(() => {
        this.errorMessage = '¡Ha ocurrido un error, por favor actualice la página!';
        this.loading = 'error';
        this.detectChange.detectChanges();
    });
  }
  
  async submit() {

    this.routerActivated.params.subscribe((params) => {

      this.authLocal.resetPassword(this.resetPassword.value, params);

    });
      
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

  validateAdminToken(token: string) {
      
    this.authLocal.validateTokenAdmin(token).then((resp: any) => {
      
      // console.log( resp );
      localStorage.setItem('token', resp.access_token);

      this.loading = 'success';

      this.detectChange.detectChanges();
    })
    .catch((error) => {
      // console.log( error.error.error );
      this.errorMessage = '¡' + error.error.error + '!';

      this.loading = 'error';

      this.detectChange.detectChanges();
    });
  }

  validateCLientToken(token: string) {
    this.authLocal.validateTokenClient(token);

    localStorage.setItem('token', token);

    this.loading = 'success';
    this.detectChange.detectChanges();
    // console.log('success client-token', this.loading);
  }
    
  validateMiwigoToken(token: string) {
    this.authLocal.validateTokenMiwigo(token);

    localStorage.setItem('token', token);

    this.loading = 'success';
    this.detectChange.detectChanges();
    // console.log('success client-token', this.loading);
  }
}
