import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthLocalService } from '../../../../auth-local/src/lib/auth-local.service';
import { BackendService } from '../../../../backend/src/lib/backend.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'easyroute-verify-miwigo-account',
  templateUrl: './verify-miwigo-account.component.html',
  styleUrls: ['./verify-miwigo-account.component.scss']
})
export class VerifyMiwigoAccountComponent implements OnInit {

  img: string;

  message: string;
  // loading
  loading: string = '';

  constructor(
               private authLocal: AuthLocalService,
               private backendService:BackendService,
               private detectChange: ChangeDetectorRef,
               public routerActivated: ActivatedRoute,
  ) { }

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

    this.authLocal.validateTokenMiwigoDispollCLient(token).then((resp: any) => {

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
