import {
    Component,
    Inject,
    Input,
    OnInit,
    EventEmitter,
    Output,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
declare const require;
const PHE = require('print-html-element');
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { first } from 'rxjs/operators';
import { autoTable } from 'jspdf-autotable';
import { DomSanitizer } from '@angular/platform-browser';
import { secondsToDayTimeAsString } from '../../util-functions/day-time-to-seconds';
import { secondsToAbsoluteTime } from '../../util-functions/time-format';

// import { SettingsService } from '../../settings/settings.service';
// d'aquest service en pillarem l'array de booleans que ara estan aqui hardcodejats

/* Interfas extensa */
export interface PrintingRoutePoint {
    zone?: string;
    clientName?: string;
    clientId?: string;
    order?: number;
    openTime?: number;
    closeTime?: number;
    deliveryExpectedTime?: number;
    payload?: number;
}

export interface PrintingRoute {
    info: {
        vehicle: string;
        zone: string;
        deliveryPoints: string;
        totalPayload: string;
        travelDistance: string;
        totalTime: string;
        travelTime: string;
        vehicleWaitTime: string;
        avgDelayTime: string;
        avgWaitTime: string;
        routeStartTime: string;
        routeEndTime?: string;
    };
    routePoints: PrintingRoutePoint[];
}

@Component({
    selector: 'app-route-print-template',
    templateUrl: './route-print-template.component.html',
    styleUrls: ['./route-print-template.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutePrintTemplateComponent implements OnInit {
    // Other required info
    /*@Input() */ date: Date = new Date();

    @Output()
    pdfUpdated: EventEmitter<{ url: string; doc: jsPDF }> = new EventEmitter();

    @Input() preview: Boolean;

    // Print settings
    @Input() sumupPage: {
        totalDeliveryPoints: number;
        totalPayload: number;
        totalDistance: number;
        totalTime: number;
        travelTime: number;
        vehicleWaitTime: number;
        avgDelayTime: number;
        avgWaitTime: number;
    };

    sumupPageSpanish: String[] = [
        'Número de puntos de entrega',
        'Carga total',
        'Distancia total',
        'Tiempo total',
        'Tiempo total en circulación',
        'Tiempo de espera de los vehículos',
        'Retraso medio por punto de entrega',
        'Tiempo promedio de las diferencias de apertura',
    ];

    routeSpecsSpanish: String[] = [
        'Ruta',
        'Número de puntos de entrega',
        'Carga total',
        'Distancia total',
        'Tiempo total',
        'Tiempo total en circulación',
        'Tiempo de espera del vehículo',
        'Retraso medio por punto de entrega',
        'Tiempo promedio de las diferencias de apertura',
        'Hora de salida del almacén (inicio de la ruta)',
        'Hora esperada de retorno al almacén (fin de la ruta)',
    ];

    @Input() routes: PrintingRoute[];

    zoom: number;

    private pdfUrl: string;
    doc: jsPDF;
    getPdfUrl() {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl);
    }

    // displayedColumns sera enviat directament des del servei
    displayedColumns: string[] = [
        'zone',
        'clientName',
        'clientId',
        'order',
        'openTime',
        'closeTime',
        'deliveryExpectedTime',
        'payload',
    ];
    displayedColumnsSpanish: string[] = [
        'Ruta',
        'Cliente',
        'ID del Cliente',
        'Orden',
        'Hora de apertura',
        'Hora de cierre',
        'Hora prevista entrega',
        'Carga',
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
        if (this.routes && this.sumupPage) {
            this.doc = new jsPDF();
            this.doc.autoTable({
                startY: 90,
                halign: 'center',
                rowPageBreak: 'avoid',
                pageBreak: 'avoid',
                theme: 'plain',
                styles: {
                    fontSize: 25,
                    fontStyle: 'bold',
                },
                body: [
                    ['  ', 'Informe de Rutas', '  '],
                    ['  ', new Date().toLocaleDateString(), '  '],
                ],
            });
            this.doc.autoTable({
                startY: this.doc.lastAutoTable.finalY + 20,
                halign: 'center',
                rowPageBreak: 'avoid',
                pageBreak: 'avoid',
                theme: 'plain',
                styles: {
                    fontSize: 12,
                    overflow: 'linebreak',
                },
                body: [
                    [this.sumupPageSpanish[0], this.sumupPage['totalDeliveryPoints']],
                    [
                        this.sumupPageSpanish[1],
                        this.sumupPage['totalPayload'] + ' unidades',
                    ],
                    [
                        this.sumupPageSpanish[2],
                        parseFloat((+this.sumupPage['totalDistance'] / 1000).toFixed(2)) +
                            ' km',
                    ],
                    [
                        this.sumupPageSpanish[3],
                        secondsToAbsoluteTime(+this.sumupPage['totalTime']),
                    ],
                    [
                        this.sumupPageSpanish[4],
                        secondsToAbsoluteTime(+this.sumupPage['travelTime']),
                    ],
                    [
                        this.sumupPageSpanish[5],
                        secondsToAbsoluteTime(+this.sumupPage['vehicleWaitTime']),
                    ],
                    [
                        this.sumupPageSpanish[6],
                        secondsToAbsoluteTime(+this.sumupPage['avgDelayTime']),
                    ],
                    [
                        this.sumupPageSpanish[7],
                        secondsToAbsoluteTime(+this.sumupPage['avgWaitTime']),
                    ],
                ],
            });
            //let finalY = this.doc.lastAutoTable.finalY + 150;
            let i = 0;
            this.doc.addPage();
            this.routes.forEach((route, index) => {
                i +=1;
                /*this.doc.autoTable({
                    theme: 'plain',
                    halign: 'right',
                    rowPageBreak: 'avoid',
                    pageBreak: 'avoid',
                    showFoot: 'never',
                    styles: {
                        fontSize: 8,
                        lineHeight: 8,
                        overflow: 'linebreak',
                    },
                    columnStyles: {
                        0: {
                            cellWidth: 7,
                            fontStyle: 'bold',
                            halign: 'right',
                        },
                        1: {
                            cellWidth: 3,
                            fontStyle: 'normal',
                            halign: 'left',
                        },
                    },
                    body: []
                });*/
                this.doc.setFontSize(14);
                this.doc.setFontStyle('bold');
                this.doc.text(
                    'RUTA ' + (index + 1),
                    20,
                    25,
                );
                this.doc.setFontStyle('bold');
                this.doc.setFontSize(10);
                this.doc.text(
                    'VEHÍCULO: ' + route.info.vehicle,
                    20,
                    15,
                );
                this.doc.autoTable({
                    startY: 30,
                    theme: 'striped',
                    rowPageBreak: 'avoid',
                    showFoot: 'never',
                    styles: {
                        fontSize: 7,
                        halign: 'center',
                        overflow: 'linebreak',
                    },
                    rowStyles: {
                        0: {
                            fontStyle: 'bold',
                            halign: 'center',
                            fillColor: [66, 103, 178],
                            textColor: [255, 255, 255],
                        },
                    }, // Cells in first row centered and blue
                    //margin: { top: 10 },
                    head: [this.displayedColumnsSpanish],
                    body: route.routePoints.map(point => [
                        point.zone,
                        point.clientName,
                        point.clientId,
                        point.order,
                        point.openTime ? secondsToDayTimeAsString(point.openTime) : 'Libre',
                        point.closeTime
                            ? secondsToDayTimeAsString(point.closeTime)
                            : 'Libre',
                        secondsToDayTimeAsString(point.deliveryExpectedTime),
                        point.payload,
                    ]),
                });
                // finalY = this.doc.lastAutoTable.finalY + 25;
                if( i < this.routes.length)
                    this.doc.addPage();
            });
            this.pdfUrl = 'data:application/pdf;base64,' + btoa(this.doc.output());
            this.pdfUpdated.emit({ url: this.pdfUrl, doc: this.doc });
            this.changeRef.detectChanges();
        }
    }

    savePDF() {
        this.doc.save('rutas' + new Date().toLocaleDateString() + '.pdf');
    }
    printPDF() {
        const printContents = document.getElementById('print-section').innerHTML;
        if (printContents) PHE.printHtml(printContents);
    }
}
