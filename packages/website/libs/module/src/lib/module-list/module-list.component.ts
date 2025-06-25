import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CompanyProfile } from '@optimroute/backend';
import { LoadingService, ToastService } from '@optimroute/shared';
import { Subject } from 'rxjs';
import { StateCompaniesService } from '../../../../state-companies/src/lib/state-companies.service';
import { ProfileSettingsFacade } from '../../../../state-profile-settings/src/lib/+state/profile-settings.facade';
import { ProfileService } from '../../../../profile/src/lib/profile.service';
import { ModalModulesComponent } from 'libs/shared/src/lib/components/modal-modules/modal-modules.component';

@Component({
  selector: 'easyroute-module-list',
  templateUrl: './module-list.component.html',
  styleUrls: ['./module-list.component.scss']
})
export class ModuleListComponent implements OnInit {

  modules: any[];
  unsubscribe$ = new Subject<void>();
  company: CompanyProfile;
  cards: any;
  cardSelected: string;
  readMore: boolean = false;
  
  constructor(
    private _profile: ProfileService,
    private _modalService: NgbModal,
    private loading: LoadingService,
    private _translate : TranslateService,
    private facadeProfile: ProfileSettingsFacade,
    private companyService: StateCompaniesService,
    private toastService: ToastService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.load();
  }

  load(){

    this.facadeProfile.loaded$.pipe(takeUntil(this.unsubscribe$)).subscribe( (loaded)=>{
      if(loaded){
        this.facadeProfile.profile$.pipe(take(1)).subscribe((data) => {

          if (data) {
    
            this.company = data.company;

            this.getModules( true );
            
            this.loadCards();
                
          }
      },(error)=> {
    
          
          this.toastService.displayHTTPErrorToast( error.status, error.error.error )
          
          });
      }
    });
    
  }

  ngOnDestroy() {
    this.unsubscribe$.complete();
    this.unsubscribe$.next();
  }

  loadCards(){
    this.companyService
    .loadCards()
    .pipe(take(1))
    .subscribe(
        (data) => {
          if (data.data.length > 0) {
            this.cardSelected = data.data.find((x) => x.default === true).id;
            this.cards = data.data;
            this.loading.hideLoading();
          } else {
            this.loading.hideLoading();
          }
       
        },
        (error) => {
            console.log(error);
            this.loading.hideLoading();
        },
    );
  }

  getModules( loading = true ) {

    if ( loading ) { this.loading.showLoading(); }

    this._profile.getModules().pipe( take(1) ).subscribe((data:any) => {
  
      this.modules = data;

      this.modules = this.modules.map(( module ) => {
        return {
          ...module,
          videoUrl:  this.sanitizeUrl( module.videoUrl )
        }
      });
    
      if ( loading ) { this.loading.hideLoading(); }

      //this.changeDetectorRef.detectChanges();  
        
    },(error)=> {

      if ( loading ) { this.loading.hideLoading(); };

      this.toastService.displayHTTPErrorToast( error.status, error.error.error )
  
    });
  }
  
  openModalModules( module:any ){
    
    const modal = this._modalService.open(ModalModulesComponent, {

      backdrop: 'static',
      backdropClass: 'customBackdrop',
      centered: true,

    });

   modal.componentInstance.modules = module;

   modal.result.then(

      (result) => {

          if (result) {

            this.updateModule(module);


          } else {

             // element.checked = !element.checked;
          }
      },
      (reason) => {

          this.toastService.displayHTTPErrorToast(reason.status, reason.error.error);
      },
  );

  }

  updateModule( module: any){
  
    let data ={
  
      moduleId: module.id,
      payment_method :this.cardSelected
    };
  
  
    this.loading.showLoading();
  
    this._profile.updateModule(data).subscribe(({ data }) => {
  
      this.getModules( false );
      
      this.toastService.displayWebsiteRelatedToast(
  
        this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
  
        this._translate.instant('GENERAL.ACCEPT')
  
      );
  
      this.facadeProfile.loadAll();
  
      this.loading.hideLoading();
      
      // realiza la consulta a los modulos y actualiza el DOM.
  
    },(error)=> {
  
      this.loading.hideLoading();
  
      this.toastService.displayHTTPErrorToast( error.status, error.error.error )
  
    });
  
  
  }

  sanitizeUrl( url: string ) {
    return this.sanitizer.bypassSecurityTrustResourceUrl( url );
  }

}
