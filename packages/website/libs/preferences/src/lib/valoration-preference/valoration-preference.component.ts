import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BackendService } from '@optimroute/backend';
import { LoadingService, ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';

@Component({
  selector: 'easyroute-valoration-preference',
  templateUrl: './valoration-preference.component.html',
  styleUrls: ['./valoration-preference.component.scss']
})
export class ValorationPreferenceComponent implements OnInit {

  @ViewChild("inputValoration", { static: true, read: true }) inputValoration: ElementRef;
  valorations = [];
  useValoration: boolean = false;
  constructor(private changeDetectorRef: ChangeDetectorRef,
    private backend: BackendService,
    private loading: LoadingService,
    private toast: ToastService) { }

  ngOnInit() {
    this.load();
  }

  load(){
    this.backend.get('valoration_item_all').pipe(take(1)).subscribe(({data})=>{
      this.valorations = data;
      this.changeDetectorRef.detectChanges();
    });

    this.backend.get('company_preference_valoration').pipe(take(1)).subscribe(({data})=>{
      this.useValoration = data.useValoration;
      this.changeDetectorRef.detectChanges();
    })
  }

  addOthers(value){
    if(value && value != '' && value.length > 0){
      this.backend.post('valoration_item', {
        name: value,
        isActive: true
      }).pipe(take(1)).subscribe(({data})=>{
        this.valorations.push(data);
        console.log(this.valorations);
        this.changeDetectorRef.detectChanges();
        this.toast.displayWebsiteRelatedToast('Valoración agregada');
      }, error => {
        this.toast.displayHTTPErrorToast(error.status, error.error.error);
      });
      /* this.inputValoration.nativeElement.value = ''; */
    }
  }

  disabledSave(value) {
    return !(this.valorations.length > 0 || this.inputValoration.nativeElement.value.length > 0);
  }

  changeValorationItem(valoration){

    this.backend.put( 'valoration_item/' + valoration.id , valoration).pipe(take(1))
    .subscribe((data)=>{
      this.toast.displayWebsiteRelatedToast('Valoración actualizada');
      this.load();
    }, error => {
      this.toast.displayHTTPErrorToast(error.status, error.error.error);
    })

  }

  changeActiveValoration(value){
    this.loading.showLoading();
    this.backend.post('company_preference_valoration', {
      useValoration: value
    }).pipe(take(1)).subscribe(({data})=>{
      this.loading.hideLoading();
      this.useValoration = data.useValoration;
      this.changeDetectorRef.detectChanges();

    }, error => {
      this.loading.hideLoading();
      this.toast.displayHTTPErrorToast(error.status, error.error.error);
    });
  }

  changeActive(valoration , value){
    this.backend.put( 'valoration_item/' + valoration.id , {
      ...valoration,
      isActive: value
    }).pipe(take(1)).subscribe((data)=>{
      this.toast.displayWebsiteRelatedToast('Valoración actualizada');
      this.load();
    }, error => {
      this.toast.displayHTTPErrorToast(error.status, error.error.error);
    })
  }
  

}
