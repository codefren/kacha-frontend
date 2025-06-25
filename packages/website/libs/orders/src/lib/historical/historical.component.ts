import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'easyroute-historical',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.scss']
})
export class HistoricalComponent implements OnInit {


  constructor(
    private Router: Router,
  ) { }

  ngOnInit() {
  }

  openPdf(){
    console.log('abrir descargar productos');
}

openImportProducts(){
    console.log('abrir importar productos');
}

redirectOrder(){
    this.Router.navigate(['orders/orders-list']);
}

redirectPreparations(){
    this.Router.navigate(['orders/preparation']);
}
openSetting(){
  this.Router.navigateByUrl('/preferences?option=order');
}
openImportOrders(){
  console.log('importar historico');
}
}
