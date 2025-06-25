import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthLocalService } from '../../../../auth-local/src/lib/auth-local.service';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { BackendService } from '../../../../backend/src/lib/backend.service';

@Component({
  selector: 'easyroute-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss']
})
export class VerifyAccountComponent implements OnInit {

  img: string;

  message: string;
  // loading
  loading: string = '';

  constructor( private authLocal: AuthLocalService,
               private backendService:BackendService,
               private detectChange: ChangeDetectorRef,
               public routerActivated: ActivatedRoute, ) { 
               
               }

  ngOnInit() {
    this.load();
  }

  load(){

    localStorage.removeItem('token');

    this.loading = 'loading';

    this.authLocal.clientCredentials().then( (resp: any) => {

      localStorage.setItem('token', resp.access_token);

      this.routerActivated.params.subscribe( params => {
        console.log(params , 'ramametro de ruta');

        this.validateToken( params['token']);

        this.detectChange.detectChanges();
      });

    }).catch( () => {

      this.loading = 'error';

      this.message = '¡Lo sentimos, se ha presentado un error!';

      this.detectChange.detectChanges();

    });
  }
  validateToken(token:any){

    this.authLocal.validateTokenUser(token).then((resp: any) => {

      localStorage.setItem('token', resp.access_token);

      this.loading = 'success';

      this.message=resp.data;

      localStorage.removeItem('token');
    
      this.detectChange.detectChanges();

    
    })
    .catch((error) => {

      localStorage.removeItem('token');

      this.message = '¡' + error.error.error + '!';

      this.loading = 'error';
      
      this.detectChange.detectChanges();
    });
  }


}
