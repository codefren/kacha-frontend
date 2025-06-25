import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StateRegisterFacade, Register } from '@easyroute/state-register';
import { take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'easyroute-register-successful',
  templateUrl: './register-successful.component.html',
  styleUrls: ['./register-successful.component.scss']
})
export class RegisterSuccessfulComponent implements OnInit {

  language: string = 'es';
  register: Register;

  constructor(
    private facade: StateRegisterFacade,
    private router: Router,
  ) { }

  ngOnInit() {
    this.facade.load();
    this.facade.allStateRegister$.pipe( 
      take(1), 
      // tap( ( resp ) => console.log( resp ) )  
    ).subscribe(
      ( register ) => {
       /*  if ( register.termsAccepted ) {
          this.router.navigate(['login/register']);
        } */
        this.register = register;
        this.finishRegister();
      },
      ( error ) => console.error( error )
    );
  }

  finishRegister() {
    this.register = {
      autonomous: false,
      name: "",
      companyProfileTypeId: '',
      countryCode: "ES",
      country: "España",
      email: "",
      email_confirmation: "",
      password: "",
      password_confirmation: "",
      acceptNewslettersAndOffers: false,
      termsAccepted: false,
      acceptPrivacyPolicy: false,
      phone: ''
    }
    this.facade.updateOrCreate( this.register );
  }

  changeLanguage( value: string ) {
    this.language = value;
  }
}
