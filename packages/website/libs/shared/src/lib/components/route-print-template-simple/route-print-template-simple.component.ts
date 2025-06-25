import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import { secondsToDayTimeAsString } from '../../util-functions/day-time-to-seconds';
import { secondsToAbsoluteTime } from '../../util-functions/time-format';
import 'jspdf-autotable';

const PHE = require('print-html-element');

declare const require;
export interface PrintingRoutePoint {
  zone?: string;
  clientName?: string;
  clientId?: string;
  order?: number;
  openTime?: number;
  closeTime?: number;
  deliveryExpectedTime?: number;
  payload?: number;
  driverName?: string;
}

export interface PrintingRoute {
  info: {
    vehicle: string;
  };
  routePoints: PrintingRoutePoint[];
}


@Component({
  selector: 'easyroute-route-print-template-simple',
  templateUrl: './route-print-template-simple.component.html',
  styleUrls: ['./route-print-template-simple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutePrintTemplateSimpleComponent implements OnInit {

  //date: Date = new Date();

  @Output()
  pdfUpdated: EventEmitter<{ url: string; doc: jsPDF }> = new EventEmitter();

  @Input() previewSimple: Boolean;

  @Input() routesSimple: PrintingRoute[];

  zoom: number;

  private pdfUrl: string;
  doc: jsPDF;

  getPdfUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl);
  }

  displayedColumnsSpanish: string[] = [
    'Chófer',
    'Vehículo',
    'Ruta',
    'Cliente',
    'ID del Cliente',
    'Orden',
  ];

  constructor(private changeRef: ChangeDetectorRef, private sanitizer: DomSanitizer) {
    this.sanitizer = sanitizer;
  }

  ngOnInit() {
    this.zoom = 0.35;
    this.createPDF();
  }

  ngOnChanges() {
    this.createPDF();
  }


  createPDF() {

    if (this.routesSimple) {

      this.doc = new jsPDF('P');
      let i = 0;

      const bodyData = [];
      this.routesSimple.forEach((route, index) => {

        let lastDriverChangeRow = 0;

        const rowSpan = route.routePoints.length - lastDriverChangeRow
        route.routePoints.forEach((point, index) => {

          if(index === 0){
            const rowData = [
              { content: point.driverName, rowSpan: index== 0 ? rowSpan : 1 },
              { content: route.info.vehicle, rowSpan: index== 0 ?rowSpan : 1 },
              { content: point.zone },
              { content: point.clientName},
              { content: point.clientId },
              { content: point.order },
            ];
            bodyData.push(rowData);
          } else {
            const rowData = [
              { content: point.zone },
              { content: point.clientName},
              { content: point.clientId },
              { content: point.order },
            ];

            bodyData.push(rowData);
          }
         

        });
      });


      this.doc.autoTable({
        startY: (this.doc && this.doc.lastAutoTable) ? this.doc.lastAutoTable.finalY + 1 : 15,
        theme: 'striped',
        rowPageBreak: 'always',
        showFoot: 'never',
        styles: {
          fontSize: 7,
          halign: 'center',
          overflow: 'linebreak',
          valign: 'middle',
        },
        rowStyles: {
          0: {
            fontStyle: 'bold',
            halign: 'center',
            fillColor: [66, 103, 178],
            textColor: [255, 255, 255],
          },
        }, // Cells in first row centered and blue
        head: [this.displayedColumnsSpanish],
        body: bodyData,
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 50 },
        }, // Establecer ancho diferente para las columnas
      });

      i += 1;

    };

    this.pdfUrl = 'data:application/pdf;base64,' + btoa(this.doc.output());
    this.pdfUpdated.emit({ url: this.pdfUrl, doc: this.doc });
    this.changeRef.detectChanges();
}

savePDF() {
  this.doc.save('rutas' + new Date().toLocaleDateString() + '.pdf');
}

printPDF() {
  const printContents = document.getElementById('print-section').innerHTML;
  if (printContents) PHE.printHtml(printContents);
}

}
