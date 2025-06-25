import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { StateCompaniesService } from '@optimroute/state-companies';
import { take } from 'rxjs/operators';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '@optimroute/env/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService, ToastService } from '@optimroute/shared';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'easyroute-form-card',
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.scss']
})
export class FormCardComponent implements OnInit {

  client_secret: string;
  stripe: any;
  @ViewChild('cardNumber', { static: false }) cardNumber: ElementRef;
  @ViewChild('cardCvc', { static: false }) cardCvc: ElementRef;
  @ViewChild('cardExpiry', { static: false }) cardExpiry: ElementRef;
  @ViewChild('cardHolderName', { static: false }) cardHolderName: ElementRef;
  show: boolean = false;

  constructor(
    private companyService: StateCompaniesService,
    public activeModal: NgbActiveModal,
    private loading: LoadingService,
    private detectChange: ChangeDetectorRef,
    private toast: ToastService,
    private translate: TranslateService  
  ) { }
  
  ngOnInit() {
    this.companyService.intentSetup().pipe(take(1)).subscribe((data) => {
      this.load(data.client_secret);
    }); 
  }

  async load(client_secret: string) {
    this.stripe = await loadStripe(environment.stripePublicKey);
    this.show = true;
    this.detectChange.detectChanges();

    const elements = this.stripe.elements();
    const cardNumber = elements.create('cardNumber', { showIcon: true});
    const cardCvc = elements.create('cardCvc');
    const cardExpiry = elements.create('cardExpiry');
    cardNumber.mount(this.cardNumber.nativeElement);
    cardCvc.mount(this.cardCvc.nativeElement);
    cardExpiry.mount(this.cardExpiry.nativeElement);

    const cardButton = document.getElementById('card-button');
    const clientSecret = client_secret;

    cardButton.addEventListener('click', async (e) => {
      
      this.loading.showLoading();  // ejecuta el loading

        try {
          const { setupIntent, error } = await this.stripe.confirmCardSetup(
            clientSecret, {
                payment_method: {
                  card: cardNumber,
                  billing_details: { name: this.cardHolderName.nativeElement.value }
                }
            }
          );
          
          // pasa los errores al catch y se ejecuta el codigo
          if ( error ) {
            throw error;  
          }

          this.closeDialog( true, setupIntent );

        } catch ( error ) {
          
          console.log(error);
          this.toast.displayHTTPErrorToast(1000, error.message);
          this.loading.hideLoading();  

        }

      /*         
        const { setupIntent, error } = await this.stripe.confirmCardSetup(
            clientSecret, {
                payment_method: {
                  card: cardNumber,
                  billing_details: { name: this.cardHolderName.nativeElement.value }
                }
            }
        );

      if (error) {
        console.log(error);
        this.toast.displayHTTPErrorToast(1000, error.message);
          this.loading.hideLoading();
        } else {
          /this.companyService.createCard(setupIntent).pipe(take(1)).subscribe((data) => {
            this.loading.hideLoading();
            this.toast.displayWebsiteRelatedToast(
              this.translate.instant('INVOICING.PAY_METHOD.CREATE_METHOD'),
              this.translate.instant('GENERAL.ACCEPT')
            );
            this.closeDialog(true);
          }, error => {
              this.loading.hideLoading();
              this.toast.displayHTTPErrorToast(error.status, error.error.error);
          }) 
        } 
      */
    });

  }

  closeDialog(value: any, setupIntent?: any ) {
    this.activeModal.close({ value, setupIntent });
  }

}
