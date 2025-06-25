import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BackendService, Login } from '@optimroute/backend';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { Router } from '@angular/router';
import { LoadingService } from '@optimroute/shared';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
@Component({
  selector: 'easyroute-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  check: boolean = false;

  isRemember: boolean = false;

  img: string;

  logo: string = '';

  inputType = 'password';

  constructor( private _backend:BackendService,
               private _router: Router,
               private translate: TranslateService,
               public detectChange: ChangeDetectorRef,
               private _authLocal: AuthLocalService) 
  { 
    
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

    this._authLocal.logout();
    this.form = new FormGroup({
      username: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required, Validators.minLength(8)]),
    });
    this.verifyRememberStorage();

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

  submit() {
    if (this.form.valid) {
      let login = new Login(
        this._backend.grant_type,
        this._backend.client_id,
        this._backend.client_secret,
        this.form.value.username.toLowerCase(),
        this.form.value.password
      );
      if (this.check == true ) {

        localStorage.setItem('remember',  JSON.stringify(this.form.value));

      } else {

        localStorage.removeItem('remember');

      }
      this._authLocal.login(login); 
    }
  }
  fieldsChange(e) {
    this.check = !this.check;

  }
  verifyRememberStorage() {

    this.isRemember = false;

    if ( localStorage.getItem('remember') !== null) {

      this.check = true;

      this.isRemember = true;

      this.loadRemenber();

    } else {
      this.isRemember = false;
    }

  }
  loadRemenber() {

    let user = JSON.parse(localStorage.getItem('remember'));

    this.form.get('username').setValue(user.username);

    this.form.get('password').setValue(user.password);

  }

  recoverPassword(){
    this._router.navigateByUrl('/login/recover');
  }

  seePassword() {
    if  ( this.inputType === 'password') {
      
      this.inputType = 'text';
    } else {
      
      this.inputType = 'password';
    }
  }



}
