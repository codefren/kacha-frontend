import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { OptimizationPreferences } from '@optimroute/backend';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { RoutePlanningFacade } from '@optimroute/state-route-planning';

import { BackendService } from 'libs/backend/src/lib/backend.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { ToastService } from 'libs/shared/src/lib/services/toast.service';
import { take } from 'rxjs/operators';
declare var $: any;
@Component({
  selector: 'easyroute-modal-load-template',
  templateUrl: './modal-load-template.component.html',
  styleUrls: ['./modal-load-template.component.scss']
})
export class ModalLoadTemplateComponent implements OnInit {

  fileName: string = '';

  fileLoad: boolean = false;

  templateSeleterID: any = '';

  templateList: any []=[];

  fileSend:any;

  loadSelectList: boolean = false;

  optimizationPreferences: OptimizationPreferences;

  constructor(
    public dialogRef: NgbActiveModal,
    private router: Router,
    private detectChanges: ChangeDetectorRef,
    private backendService: BackendService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private translate: TranslateService,
    private preferencesFacade: PreferencesFacade,
    private facade: RoutePlanningFacade
  ) { }

  async ngOnInit() {
    this.getTemplateList();
    this.optimizationPreferences = await this.preferencesFacade.optimizationPreferences$.pipe(take(1)).toPromise();
  }

  getTemplateList(){

    this.loadSelectList = true;

    this.backendService.get(`company_preference_integration_route`).pipe(take(1)).subscribe(
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

    let options = {
        createDeliveryPoints: this.optimizationPreferences.createSession
            .createDeliveryPoints,
        updateDeliveryPoints: this.optimizationPreferences.createSession
            .updateDeliveryPoints,
        createDeliveryZones: this.optimizationPreferences.createSession
            .createDeliveryZones,
        createUnassignedZone: this.optimizationPreferences.createSession
            .createUnassignedZone,
        setUnassignedZone: this.optimizationPreferences.createSession
            .setUnassignedZone,
    }

    excel.append('companyPreferenceIntegrationRouteId',this.templateSeleterID);

    excel.append('import_template_file', this.fileSend, this.fileSend.name);

    excel.append( 'warehouse' ,JSON.stringify(this.optimizationPreferences.warehouse));

    excel.append( 'options' ,JSON.stringify(options));



    this.loadingService.showLoading();
    this.facade.logout();
    this.backendService.postFile('route-planning/load_from_template',excel).pipe(take(1)).subscribe(

      (resp: any) => {

          this.loadingService.hideLoading();

          this.detectChanges.detectChanges();

          this.toastService.displayWebsiteRelatedToast(
              'Archivo procesado satisfactoriamente.',
              this.translate.instant('GENERAL.ACCEPT'),
          );

          $("input[type='file']").val('');

          this.facade.importTemplateRoute(resp);

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

    this.router.navigateByUrl('/preferences?option=routeIntegration');

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
