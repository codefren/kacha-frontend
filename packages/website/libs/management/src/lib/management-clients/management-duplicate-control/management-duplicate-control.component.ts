import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ErrorDialogComponent, ImportedProductsDeliveryPointDto, LoadingService, ModalCheckCostComponent, ModalGeneralDiscardComponent, ModalGeneralMergeRecordComponent, ToastService, removeNulls } from '@optimroute/shared';
import { plainToClass } from 'class-transformer';
import { Validator } from 'class-validator';
import { StateRoutePlanningService } from 'libs/state-route-planning/src/lib/state-route-planning.service';
import { group } from 'console';
import { BackendService } from '@optimroute/backend';
import { take } from 'rxjs/operators';
import * as csv from 'csvtojson';
import * as moment from 'moment';
import { FormStyle } from '@angular/common';

declare var $: any;
@Component({
  selector: 'easyroute-management-duplicate-control',
  templateUrl: './management-duplicate-control.component.html',
  styleUrls: ['./management-duplicate-control.component.scss']
})
export class ManagementDuplicateControlComponent implements OnInit {

  listSelecterArray: any = [];

  tableDuplicate: any[] = [];

  showTables: boolean = false;

  loading: string = 'error';

  jsonSended: any;

  searchBD: boolean = false;

  totalizedDate: any = {
    duplicatesDetected: 0,
    noDuplicity: 0,
    belongGroup: 0
  };

  showCode: boolean = true;

  constructor(
    private _translate: TranslateService,
    private toastService: ToastService,
    private _modalService: NgbModal,
    private router: Router,
    private stateRoutePlanningService: StateRoutePlanningService,
    private backend: BackendService,
    private loadingService: LoadingService,
    private changeDetect: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  importProductGlobal(file: File) {
    let fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = (e) => {
      if (file.type === 'application/json') {
        this.validateJSON(fileReader.result.toString());
      } else {
        this.toastService.displayWebsiteRelatedToast(
          this._translate.instant('CONTROL_PANEL.NOT_JSON'),
        );
      }
    };

  }


  private validateJSON(fileContent: string): void {
    let validator = new Validator();

    if (validator.isJSON(fileContent)) {
      let parsedJSON = JSON.parse(fileContent);

      this.JSONValidation(parsedJSON);

    } else {
      const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                <h3>El JSON importado tiene un mal formato</h3>
                            </div>`;
      this.openImportedFileErrorDialog(dialogHTML);
    }
  }

  private async JSONValidation(parsedJSON: any) {
    const deliveryPointsMap: { [key: string]: any } = {};
    if (parsedJSON.deliveryPoints) {
      if (parsedJSON.deliveryPoints.length === 0) {
        const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                    <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                        <h3>El archivo debe contener al menos un punto de entrega.</h3>                                            
                                    </div>
                            </div>`;
        this.openImportedFileErrorDialog(dialogHTML);
        return;
      }
      for (let i = 0; i < parsedJSON.deliveryPoints.length; ++i) {
        if (!this.checkUniqueId(parsedJSON.deliveryPoints[i], deliveryPointsMap, i))
          return;
      }

      let deliveryPoints = removeNulls(
        plainToClass(ImportedProductsDeliveryPointDto, parsedJSON),
      ) as ImportedProductsDeliveryPointDto;

      this.sendProducts(deliveryPoints);
    } else {
      const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                    <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                        <h3>El JSON debe contener el campo "deliveryPoints" el cual contiene todos los puntos de entrega</h3>
                                    </div>
                            </div>`;
      this.openImportedFileErrorDialog(dialogHTML);
    }
  }

  sendProducts(deliveryPointWithDupicales: any) {

    this.showTables = false;
    this.showCode = false;

    this.listSelecterArray = [];

    this.loading = 'process';

    this.stateRoutePlanningService
      .uploadClientsDuplicates(deliveryPointWithDupicales)
      .subscribe(
        (data) => {

          const mapped = Object.entries(data).map(([group, value]) => ({ group, value }));

          this.jsonSended = deliveryPointWithDupicales;

          mapped.sort((a, b) => {
            if (a.group < b.group) {
              return -1;
            }
            if (a.group > b.group) {
              return 1;
            }
            return 0;
          });

          this.tableDuplicate = mapped;

          this.totalizedReturn(this.tableDuplicate);
                  
          //console.log(this.tableDuplicate, 'this.tableDuplicate');

          this.toastService.displayWebsiteRelatedToast(

            'Archivo cargado satisfactoriamente',

          );

          this.showTables = true;
          this.showCode = true;

          this.loading = 'load';

        },
        (error) => {

          this.showTables = true;
          this.showCode = true;

          this.loading = 'load';

          this.toastService.displayHTTPErrorToast(error.status, error.error);
        },
      );

  }

  totalizedReturn(data: any) {

    this.totalizedDate.duplicatesDetected = 0;
    this.totalizedDate.noDuplicity = 0;
    this.totalizedDate.belongGroup = 0;

    //this.showCode = true;

    data.forEach((element: any, index: number) => {
            
      if (element.group !== 'with-group' && element.group !== 'no-group') {
          
        this.totalizedDate.duplicatesDetected += element.value.count;

      } else {
        if (element.group === 'no-group') {
        
          this.totalizedDate.noDuplicity += element.value.data.length;
          
        } else if (element.group === 'with-group') {
          
          element.value.forEach((element_with_group: any, index: number) => {

            this.totalizedDate.belongGroup += element_with_group.count;

          });
          
        }
        
      }
    });

    //this.showCode = true;

    //console.log(this.totalizedDate)
  }

  private openImportedFileErrorDialog(html: string) {
    const dialogRef = this._modalService.open(ErrorDialogComponent, {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      centered: true,
    });

    dialogRef.componentInstance.data = {
      errorDescription: html,
      errorTitle: 'Fallo en la importación del fichero',
    };
  }

  private checkUniqueId(
    deliveryPoint: any,
    deliveryPointsIds: { [key: string]: {} },
    index: number,
  ) {
    if (deliveryPoint.id && typeof deliveryPoint.id === 'string') {

      deliveryPointsIds[deliveryPoint.id] = deliveryPoint;
      return true;

    } else if (typeof deliveryPoint.id !== 'string') {
      const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                    <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                        <h3>El archivo contiene un punto de entrega con un formato incorrecto en el ID</h3>                                                                      
                                        <h4>Error en el punto de entrega n. ${index +
        1}</h4>
                                    </div>
                            </div>`;
      this.openImportedFileErrorDialog(dialogHTML);
    } else {
      const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                    <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                        <h3>El archivo contiene un punto de entrega sin el campo ID</h3>                                                                      
                                        <h4>Error en el punto de entrega n. ${index +
        1}</h4>
                                    </div>
                            </div>`;
      this.openImportedFileErrorDialog(dialogHTML);
      return false;
    }
  }


  importClient(file: any) {

    let fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = (e) => {
      this.validateCSV(fileReader.result.toString());
    }

  }

  async validateCSV(fileContent: string) {
    let header = {
      id: {},
      address: {},
      'coordinates.latitude': {},
      'coordinates.longitude': {},
      name: {},
      deliveryZoneId: {},
      'deliveryWindow.start': {},
      'deliveryWindow.end': {},
      demand: {},
      serviceTime: {},
      priority: {},
      deliveryNotes: {},
      sendDeliveryNoteMail: {},
      agentUserMail: {},
      requiredSignature: {},
      email: {},
      phoneNumber: {},
      population: {},
      deliveryType: {},
      orderNumber: {}
    };
    let json: any;
    await csv({
      trim: true,
      noheader: false,
      checkType: true,
      ignoreEmpty: true,
      colParser: {
        id: 'string',
        name: 'string',
        deliveryZoneId: 'string',
        deliveryNotes: 'string',
        'coordinates.latitude': 'number',
        'coordinates.longitude': 'number',
        'deliveryWindow.start': 'number',
        'deliveryWindow.end': 'number',
        demand: 'number',
        serviceTime: 'number',
        priority: 'number',
        sendDeliveryNoteMail: 'boolean',
        agentUserMail: 'string',
        requiredSignature: 'boolean',
        email: 'string',
        phoneNumber: 'string',
        population: 'string',
        deliveryType: 'string',
        orderNumber: 'string'
      },
    })
      .fromString(fileContent)
      .then((jsonObj) => {
        json = { deliveryPoints: jsonObj };
      });

    if (json && this.checkHeader(json, header)) {
      json.name = 'Ruta ' + moment().format('YYYY-MM-DD');
      json.dateSession = moment().format('YYYY-MM-DD');
      this.JSONValidation(json);
    }
    
  }

  createDelivery() {
    this.loadingService.showLoading();
    this.backend.post('group_delivery_point/add_integration', this.jsonSended).pipe(take(1)).subscribe(() => {
      this.showTables = false;
      this.showCode = true;
      this.loading = 'error';
      this.listSelecterArray = []
      this.tableDuplicate = []
      this.jsonSended = []
      this.totalizedDate = {
        duplicatesDetected: 0,
        noDuplicity: 0,
        belongGroup: 0
      }
      this.changeDetect.detectChanges();
      this.loadingService.hideLoading();
      
    }, error => {
      this.loadingService.hideLoading();
      this.toastService.displayHTTPErrorToast(error.status, error.error.error);
    })
  }

  private checkHeader(json, header, position?: number) {
    if (json.deliveryPoints.length > 0) {
      for (let key in json.deliveryPoints[0]) {
        if (!this.checkProperty(json.deliveryPoints[0][key], header, key))
          return false;
      }
      return true;
    } else {
      const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                    <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                        <h3>El archivo debe contener al menos un punto de entrega.</h3>
                                    </div>
                            </div>`;
      this.openImportedFileErrorDialog(dialogHTML);
      return false;
    }
  }

  private checkProperty(object, header, keys) {
    if (typeof object === 'object') {
      for (let key in object) {
        if (!this.checkProperty(object[key], header, keys + '.' + key))
          return false;
      }
      return true;
    } else {
      if (!header[keys]) {
        const dialogHTML = `<div style="width: auto; height:auto; display: flex; align-items: center; justify-content: center">
                                    <div style="width: auto; height:auto; display: flex; flex-direction: column;">
                                        <h3>El archivo contiene un campo en la cabecera (${keys}) que no cumple el formato especificado.</h3>
                                        <h3>Pongase en contacto con su gestor del CRM ya que el documento importado es incorrecto.</h3>
                                    </div>
                            </div>`;
        this.openImportedFileErrorDialog(dialogHTML);
        return false;
      } else return true;
    }
  }

  openModalDiscard(selected?: any) {


    let listSelecter = this.listSelecterArray.find((x: any) => x.group === selected);

    const modal = this._modalService.open(ModalGeneralDiscardComponent, {

      backdropClass: 'modal-backdrop-ticket',

      centered: true,

      windowClass: 'modal-cost',

      size: 'md'

    });

    modal.componentInstance.title = this._translate.instant('CLIENTS.DUPLICATE_CONTROL.DISCARD');

    modal.componentInstance.Subtitle = this._translate.instant('CLIENTS.DUPLICATE_CONTROL.ARE_YOU_SURE_YOU_WANT_TO_DROP_THIS_CUSTOMER');

    modal.componentInstance.message = this._translate.instant('CLIENTS.DUPLICATE_CONTROL.ONE_YOU_DISCARD_IT_THIS_CLIENT_WILL_GO_TO_THE_LIST_OF_CLIENTS_WITHOUT_GROUPING');

    modal.componentInstance.accept = this._translate.instant('CLIENTS.DUPLICATE_CONTROL.DISCARD');

    modal.componentInstance.cssStyle = 'btn btn-red-general';

    modal.result.then(
      (data) => {
        if (data) {
          let all = this.jsonSended.discard ? this.jsonSended.discard : [];
          if (this.jsonSended && this.jsonSended.discard && this.jsonSended.discard.length > 0) {
            listSelecter.deliveryPointId.forEach(element => {
              all.push(element)
            });
          } else {
            all = listSelecter.deliveryPointId;
          }
          this.sendProducts({
            ...this.jsonSended,
            discard: all
          })

          //  this.deleteCost(sentAll);

        }
      },
      (reason) => {

      },
    );
  }

  openMergeRecord(group: any) {
    const modal = this._modalService.open(ModalGeneralMergeRecordComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
      windowClass: 'modal-export-routes',

    });

    let listSelecter = this.listSelecterArray.find((x: any) => x.group === group);


    modal.componentInstance.title = this._translate.instant('CLIENTS.DUPLICATE_CONTROL.DISCARD');

    modal.componentInstance.Subtitle = this._translate.instant('CLIENTS.DUPLICATE_CONTROL.ARE_YOU_SURE_YOU_WANT_TO_DROP_THIS_CUSTOMER');

    modal.componentInstance.message = this._translate.instant('CLIENTS.DUPLICATE_CONTROL.ONE_YOU_DISCARD_IT_THIS_CLIENT_WILL_GO_TO_THE_LIST_OF_CLIENTS_WITHOUT_GROUPING');

    modal.componentInstance.accept = this._translate.instant('CLIENTS.DUPLICATE_CONTROL.DISCARD');

    modal.componentInstance.cssStyle = 'btn btn-red-general';

    modal.componentInstance.cssStyle = 'btn btn-red-general';

    modal.componentInstance.dataClient = listSelecter.list;

    modal.componentInstance.deliveryPointId = listSelecter.deliveryPointId;


    modal.result.then(
      (data) => {
        if (data) {

          console.log(listSelecter.deliveryPointId);

          if (this.jsonSended.discard && this.jsonSended.discard.length > 0) {
            listSelecter.deliveryPointId.forEach(element => {
              const index = this.jsonSended.discard.findIndex(x => x === element);
              if (index >= 0) {
                this.jsonSended.discard.splice(index, 1);
              }
            });
          }

          this.listSelecterArray = [];
          this.tableDuplicate = [];
          if(!this.searchBD){
            this.sendProducts(this.jsonSended);
          } else {
            this.searchDuplicates();
          }
          
          //  this.deleteCost(sentAll);

        }
      },
      (reason) => {

      },
    );
  }

  changeSelecter(event: any, item: any, index: any, group: any) {

    if (event) {

      let deliveryPointId = [];
      deliveryPointId.push(item.id);

      //Buscar si el groupo existe
      let find = this.listSelecterArray.find((x: any) => x.group === group);

      let index = this.listSelecterArray.indexOf(find);

      let dataSelect = [];

      dataSelect.push({
        id: item.id,
        name: item.name,
        address: item.address,
        zipCode: item && item.postalCode ? item.postalCode : '',
        population: item && item.population ? item.population : '',
        phone: item.phoneNumber
      });

      if (find != undefined) {

        this.listSelecterArray[index].list.push(dataSelect[0]);
        this.listSelecterArray[index].deliveryPointId.push(deliveryPointId[0]);

      } else {

        this.listSelecterArray.push({
          group: group,
          deliveryPointId: deliveryPointId,
          list: dataSelect
        });

      }

      console.log(this.listSelecterArray, 'this.listSelecterArray')

    } else {

      //Buscar groupo el index y con eso 

      let find = this.listSelecterArray.find((x: any) => x.group === group);

      let index = this.listSelecterArray.indexOf(find);

      this.listSelecterArray[index].list = this.listSelecterArray[index].list.filter((x: any) => x.id != item.id);

      this.listSelecterArray[index].deliveryPointId = this.listSelecterArray[index].deliveryPointId.filter((x: any) => x.id != item.id);

      // si ya no hay nada en list se saca el groupo.

      if (this.listSelecterArray[index].list.length == 0) {

        this.listSelecterArray.splice(index, 1)

      }

    }

  }

  redirectTo() {
    this.router.navigate(['management/clients']);
  }

  desabledBotton(group: any) {

    let existe = this.listSelecterArray.find((x: any) => x.group === group);

    if (existe) {

      return false;

    }

    return true;

  }

  searchDuplicates(){
    this.showTables = false;
    this.showCode = false;
    this.searchBD = true;
    this.listSelecterArray = [];

    this.loading = 'process';

    this.backend
      .get('group_delivery_point_search')
      .pipe(take(1))
      .subscribe(
        (data) => {

          const mapped = Object.entries(data).map(([group, value]) => ({ group, value }));

          this.jsonSended = data;

          mapped.sort((a, b) => {
            if (a.group < b.group) {
              return -1;
            }
            if (a.group > b.group) {
              return 1;
            }
            return 0;
          });

          this.tableDuplicate = mapped;

          this.totalizedReturn(this.tableDuplicate);
                  
          //console.log(this.tableDuplicate, 'this.tableDuplicate');

          this.toastService.displayWebsiteRelatedToast(

            'Archivo cargado satisfactoriamente',

          );

          this.showTables = true;
          this.showCode = true;

          this.loading = 'load';

          this.changeDetect.detectChanges();

        },
        (error) => {

          this.showTables = true;
          this.showCode = true;

          this.loading = 'load';

          this.toastService.displayHTTPErrorToast(error.status, error.error);
        },
      );
  }

  trackByItems(index: number, item: any) { return item.id }

}
