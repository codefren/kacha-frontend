export interface BillInterface {
    id: number,
    companyId: number;
    code?:string,
    total?: number,
    paymentDate: string,
    paymentPlatform: string,
    paymentReference: string,
    isActive: boolean,
    archiveUrl?: string,
    delivery_point?: { 
        id: string;
        name: string
    };
    bill_Payment_Type?: { 
        id: number;
        name: string
    };
    bill_Payment_Status?: { 
        id: number;
        name: string
    };
    bill_charge_type?: { 
        id: number;
        name: string
    };
    user_charged_by?: { 
        id: number;
        name: string;
        surname: string
    };
  }

  export class BillInterface  implements BillInterface  {
	constructor() {
        this.id = 0,
        this.companyId = 0,
        this.code = '',
        this.total = 0,
        this.paymentDate= '';
        this.paymentPlatform= '';
        this.paymentReference= '';
        this.isActive = true,
        this.archiveUrl = '';
        this.delivery_point = {
            id: '',
            name:''
        },
        this.bill_Payment_Type = {
            id: 0,
            name:'',
        },
        this.bill_Payment_Status = {
            id: 0,
            name:'',
        },
        this.bill_charge_type = {
            id: 0,
            name:'',
        },
        this.user_charged_by = {
            id: 0,
            name:'',
            surname: ''
        }
    }
}