// import { sandboxOf } from 'angular-playground';
// import { ErrorDialogComponent } from '@optimroute/shared';
// import {
//     MatDialog,
//     MatDialogModule,
//     MatButtonModule,
//     MatIconModule,
//     MatToolbarModule,
//     MAT_DIALOG_DEFAULT_OPTIONS,
// } from '@angular/material';
// import { DomSanitizer } from '@angular/platform-browser';
// import { Component } from '@angular/core';

// @Component({
//     selector: 'app-dialog-test',
//     template: '<button mat-button (click)="openDialog()">Click Me!</button>',
// })
// export class DialogTestComponent {
//     constructor(private dialog: MatDialog, private dom: DomSanitizer) {
//         this.openDialog();
//     }

//     openDialog(): void {
//         this.dialog.open(ErrorDialogComponent, {
//             data: {
//                 errorDescription: `<h1 class='mat-display-1'>Hola mundo </h1>`,
//                 errorTitle: 'Marianooooo',
//             },
//         });
//     }
// }

// const sandBoxConfig = {
//     declarations: [ErrorDialogComponent, DialogTestComponent],
//     imports: [MatDialogModule, MatButtonModule, MatIconModule, MatToolbarModule],
//     entryComponents: [ErrorDialogComponent],
//     providers: [
//         {
//             provide: MAT_DIALOG_DEFAULT_OPTIONS,
//             useValue: {
//                 hasBackdrop: false,
//                 maxWidth: '80vw',
//                 minWidth: '500px',
//             },
//         },
//     ],
// };

// export default sandboxOf(DialogTestComponent, sandBoxConfig).add('default', {
//     template: `<app-dialog-test></app-dialog-test>`,
// });
