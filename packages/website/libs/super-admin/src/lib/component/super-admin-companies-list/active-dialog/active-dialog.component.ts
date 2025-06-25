import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'easyroute-active-dialog',
  templateUrl: './active-dialog.component.html',
  styleUrls: ['./active-dialog.component.scss']
})
export class ActiveDialogComponent implements OnInit {
  now: Date;
  data: any;

  constructor(public activeModal: NgbActiveModal){
  }

  ngOnInit() {
  }

}
