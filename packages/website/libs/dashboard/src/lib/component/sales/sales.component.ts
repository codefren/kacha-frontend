import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'easyroute-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {

  @Input() date: any;

  @Input() filterSelect: string = '';

  @Input() commercialId: string = '';

  @Input() dateFrom: string ='';

  @Input () dateTo: string ='';

  constructor() { }

  ngOnInit() {
  }

}
