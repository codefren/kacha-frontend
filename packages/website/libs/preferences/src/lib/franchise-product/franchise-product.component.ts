import { Component, OnInit } from '@angular/core';
import { FranchisePreferences } from '@optimroute/backend';
import { PreferencesFacade } from '@optimroute/state-preferences';
import { Observable } from 'rxjs';

@Component({
  selector: 'easyroute-franchise-product',
  templateUrl: './franchise-product.component.html',
  styleUrls: ['./franchise-product.component.scss']
})
export class FranchiseProductComponent implements OnInit {

  franchisePreferences$: Observable<FranchisePreferences>;
  

  constructor(
    private facade: PreferencesFacade,

  ) { }

  ngOnInit() {

    this.facade.loadFranchisesPreferences();

    this.franchisePreferences$ = this.facade.franchisePreferences$;

  }

  toggleProduct(key: any, value: any) {

    this.facade.toggleFranchisePreference(key, value);
    
  }

}
