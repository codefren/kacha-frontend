import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthLocalService } from '@optimroute/auth-local';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
import { take, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'easyroute-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit, OnDestroy {
  
  img: string;

  disabled = true;

  readonly urlPolpooTerms :string ='https://polpoo.com/terminos-condiciones/';

  constructor(private facade: ProfileSettingsFacade, private auth: AuthLocalService, private router: Router) {
    this.img = 'url(assets/images/background/fondo-login.png)';
  }
  unsubscribe$ = new Subject<void>();
  ngOnInit() {
  }

  acceptTerms() {
    this.facade.updateAcceptTermes(true);
    this.facade.loaded$.pipe(takeUntil(this.unsubscribe$)).subscribe((load) => {
      if (load) {
        this.router.navigateByUrl('');  
      }
    })
  }

  cancelTerms() {
    this.auth.logout();
  }

  changeValue( $event: boolean ) {
    this.disabled = $event ? false : true;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
