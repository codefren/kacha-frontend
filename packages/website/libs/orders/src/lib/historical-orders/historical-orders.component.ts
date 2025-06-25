import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'easyroute-historical-orders',
  templateUrl: './historical-orders.component.html',
  styleUrls: ['./historical-orders.component.scss']
})
export class HistoricalOrdersComponent implements OnInit {

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
  this.Router.navigateByUrl('/preferences?option=orders');
}

openImportOrders(){
  console.log('abrir importar historico');
}

}
