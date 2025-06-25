export interface ProductsPrices {
    companyId:number,
    companyProductId: number,
    id: number;
    name: string;
    measureId:number,
    measure: {
        id:number,
        name: string,
        activateEquivalentAmount: boolean;
        equivalentAmount: number;
    };
    price: number,
    quantity: number,
    tax: number,
    taxPercent: number,
    totalPrice: number,
    main?:boolean,
    isActive: boolean,
    equivalencePercent: number, 
    lotCode?: string;
}

export class ProductsPrices  implements ProductsPrices  {
	constructor(){
        this.companyId =0,
        this.companyProductId = 0, 
        this.id = 0;
        this.name = '';
        this.measureId = 0;
        this.measure= {
            id:0,
            name:'',
            activateEquivalentAmount: false,
            equivalentAmount: 0
        };
        this.price = 1;
        this.quantity = 1;
        this.tax = 0,
        this.taxPercent = 0;
        this.totalPrice = 0;
        this.main = false;
        this.isActive = true;
        this.equivalencePercent = 0;
        this.lotCode = '';
	}
}
