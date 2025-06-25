import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'easyroute-douwload-package',
  templateUrl: './douwload-package.component.html',
  styleUrls: ['./douwload-package.component.scss']
})
export class DouwloadPackageComponent implements OnInit {

  @Input() routeId: any;

  @Input() downloadPackage: any;

  @Input() totalDownloadPackage: any;
    
  constructor() { }

  ngOnInit() {
    console.log({
      routeId: this.routeId,
      downloadPackage: this.downloadPackage,
      totalDownloadPackage:this.totalDownloadPackage
    }, 'in DouwloadPackageComponent')
  }

}
