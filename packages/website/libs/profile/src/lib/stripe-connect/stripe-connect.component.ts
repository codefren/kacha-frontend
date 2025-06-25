import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '@optimroute/backend';
import { LoadingService } from '@optimroute/shared';
import { take } from 'rxjs/operators';
import { ConfirmModalComponent } from '@optimroute/shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@optimroute/env/environment';
@Component({
  selector: 'easyroute-stripe-connect',
  templateUrl: './stripe-connect.component.html',
  styleUrls: ['./stripe-connect.component.scss']
})
export class StripeConnectComponent implements OnInit {

  constructor(private backend: BackendService, 
              private detectChange: ChangeDetectorRef,
              private loading: LoadingService,
              private modalService: NgbModal) { }
  connected: boolean = false;
  loaded: boolean = false;
  acceptTerms: boolean = false;
  URL_TERMS_CONDITIONS = environment.URL_PRIVACY_TERMS;
  ngOnInit() {
    this.loading.showLoading();
    this.backend.get('stripe_connect_returned_account').pipe(take(1)).subscribe((data)=>{
        this.connected = data.connected;
        this.loaded = true;
        this.detectChange.detectChanges();
        this.loading.hideLoading();
        
    })
  }

  createConnect(){
    this.loading.showLoading();
    this.backend.post('stripe_connect_account', {}).pipe(take(1)).subscribe((data)=>{
      this.loading.hideLoading();
      window.location = data.url;
    })
  }

  deleteConnect(){
    const modal = this.modalService.open(ConfirmModalComponent, {
      size: 'xs',
      backdropClass: 'customBackdrop',
      centered: true,
      backdrop: 'static',
    });
    modal.componentInstance.message = '¿Seguro que quieres desconectar tu cuenta de Stripe?'
    modal.componentInstance.title = false;
    modal.result.then((result)=>{
      if(result){
        this.loading.showLoading();
        this.backend.post('stripe_connect_delete_account', {}).pipe(take(1)).subscribe(()=>{
          this.loading.hideLoading();
          this.connected = false;
          this.detectChange.detectChanges();
        })
      }
    });    
  
  }

  changeCheckbox(value){
    console.log(value);
    console.log(this.acceptTerms);
  }
}
