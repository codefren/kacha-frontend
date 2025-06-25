export interface Invoice {
    companyId :number,
    id: number,
    invoiceCode: string,
    invoiceDate: Date,
    invoiceTypeId: number,
    invoice_type: {
        id: number,
        name: string,
    },
    price:string,
    tax: string,
    totalPrice:string
}


export class Invoice implements Invoice {
	constructor(){
        this.companyId = 0,
        this.id = 0,
        this.invoiceCode = "",
        this.invoiceTypeId = 0,
        this.invoice_type = {
            id : 0,
            name : ""
        },
        this.price = "",
        this.tax = "",
        this.totalPrice = ""
	}
}
