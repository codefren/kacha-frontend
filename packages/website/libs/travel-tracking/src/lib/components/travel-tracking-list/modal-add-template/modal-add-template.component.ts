import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from 'libs/backend/src/lib/backend.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { ToastService } from 'libs/shared/src/lib/services/toast.service';
import { take } from 'rxjs/operators';
declare var $: any;
@Component({
  selector: 'easyroute-modal-add-template',
  templateUrl: './modal-add-template.component.html',
  styleUrls: ['./modal-add-template.component.scss']
})
export class ModalAddTemplateComponent implements OnInit {

  fileName: string = '';

  fileLoad: boolean = false;

  templateSeleterID: any = '';

  templateList: any []=[];

  fileSend:any;

  loadSelectList: boolean = false;

  dateDeliveryStart: any;

  constructor(
    public dialogRef: NgbActiveModal,
    private router: Router,
    private detectChanges: ChangeDetectorRef,
    private backendService: BackendService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.getTemplateList();
  }

  getTemplateList(){

    this.loadSelectList = true;

    this.backendService.get(`company_preference_integration_delivery_note`).pipe(take(1)).subscribe(
      ( data ) => {

        this.templateList = data.data;
          
        this.loadSelectList = false;

        this.detectChanges.detectChanges();
      },
      (error) => {
          this.toastService.displayHTTPErrorToast(
              error.status,
              error.error.error,
          );
      },
  );
  }

  close(value: any) {
    this.dialogRef.close(value);
  }

  create(){

    let excel: FormData = new FormData();

    excel.append('companyPreferenceIntegrationDeliveryNoteId',this.templateSeleterID);

    excel.append('import_template_file', this.fileSend, this.fileSend.name);

    excel.append('dateDeliveryStart',this.dateDeliveryStart),

    this.loadingService.showLoading();

    this.backendService.postFile('route_planning/albaran/load_from_template',excel).pipe(take(1)).subscribe(

      (resp: any) => {

          this.loadingService.hideLoading();

          this.detectChanges.detectChanges();

          this.toastService.displayWebsiteRelatedToast(
              'Archivo procesado satisfactoriamente.',
              this.translate.instant('GENERAL.ACCEPT'),
          );

          $("input[type='file']").val('');

          this.dialogRef.close(true);
        
      },
      (error: any) => {

          $("input[type='file']").val('');

          this.loadingService.hideLoading();

          this.toastService.displayHTTPErrorToast(error.error.code, error.error);
      },
  ); 

  }

  redirectPreferences(){

    this.router.navigateByUrl('/preferences?option=deliveryNoteIntegration');
    
    this.dialogRef.close(false);

  }

  importTemplateActions(file: any) {

    this.fileName = file.name ;

    this.fileSend = file;

    this.fileLoad = true;

    this.detectChanges.detectChanges();

  }

  clearFile(){

    console.log('hola');

    this.fileName = '';

    this.fileLoad = false;

    $("input[type='file']").val('');

    this.detectChanges.detectChanges();
  }

}
