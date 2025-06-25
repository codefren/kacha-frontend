import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthLocalService } from '@optimroute/auth-local';
import { Router } from '@angular/router';
import { environment } from '@optimroute/env/environment';
import { UserMessages } from '../../../../shared/src/lib/messages/user/user.message';
import { BackendService } from '@optimroute/backend';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss']
})

export class RecoverComponent implements OnInit {

  recaptcha: any = environment.Recaptcha;
  form: FormGroup;
  img: string;
  validationMessages: any;
  compactRecaptcha: 'compact' | 'normal' = 'normal';

  logo: string = '';


  constructor(private authLocal: AuthLocalService,
              private _router: Router,
              private detectChange: ChangeDetectorRef,
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

    this.form = new FormGroup({
      email: new FormControl('',[Validators.required, Validators.email]),
      captcha:new FormControl (null, [Validators.required]),
      
    });
    const validationMessages = new UserMessages();
    this.validationMessages = validationMessages.getUserMessages();


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

  async submit() {
    this.authLocal.recoverPassword(this.form.value);
  }

  redirectlogin(){
    this._router.navigateByUrl('/login');
  }
}
