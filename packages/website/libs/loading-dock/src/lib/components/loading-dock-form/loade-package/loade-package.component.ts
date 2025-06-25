import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'easyroute-loade-package',
  templateUrl: './loade-package.component.html',
  styleUrls: ['./loade-package.component.scss']
})
export class LoadePackageComponent implements OnInit {

  @Input() routeId: any;

  @Input() loadPackage: any;

  @Input() totalLoadPackage: any;
    
  constructor() { }

  ngOnInit() {
    console.log({
      routeId:this.routeId,
      loadPackage:this.loadPackage,
      totalLoadPackage: this.totalLoadPackage
    },'in LoadePackageComponent');
  }

}
