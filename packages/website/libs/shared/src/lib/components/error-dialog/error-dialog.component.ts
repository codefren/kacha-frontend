import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface DialogError {
    errorDescription: string;
    errorTitle: string;
}

@Component({
    selector: 'app-error-dialog',
    templateUrl: './error-dialog.component.html',
    styleUrls: ['./error-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class ErrorDialogComponent implements OnInit{
    errorDescription: SafeHtml;
    errorTitle: string;
    data: any;

    constructor(
        private readonly dom: DomSanitizer,
        private readonly dialogRef: NgbActiveModal,
    ) { }

    ngOnInit() {

        this.errorDescription = this.dom.bypassSecurityTrustHtml(this.data.errorDescription);
        this.errorTitle = this.data.errorTitle;

    }

    onCancelClick(): void {
        this.dialogRef.close();
    }
}
