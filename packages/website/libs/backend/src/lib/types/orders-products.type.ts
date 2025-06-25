
export interface OrdersProductsInterface {

        id: number,
        companyClientId: number,
        companyProductId: number,
        orderId: number,
        price: number,
        quantity?: number,
        name:string;
        taxPercent: number,
        tax: number,
        equivalence?: any,
        equivalencePercent?: any,
        isActive: boolean,
        lastPrice?:number,
        customPrice: number,
        observation?: string,
        total?: number;
        haveProduct?:boolean;
        company_product?:{
            categoryId: number,
            code: number,
            companyId: number,
            created_at: string,
            created_by: string,
            deleted_at: string,
            description: string,
            endPromotionDate: string,
            equivalencePercent: number,
            estimatedWeightPerUnit: number,
            highlight: boolean,
            id: number,
            isActive: boolean,
            name: string,
            origin: string,
            promotion: boolean,
            showInApp: boolean,
            startPromotionDate: string,
            subCategoryId: number,
            taxPercent: number
            updatableFromCompanyParent: boolean,
            updated_at: string,
            updated_by: number,
            valoration: number
        },
        company_product_price: {
            id: number,
            companyId: number,
            companyProductId: number,
            measureId: number,
            price: number,
            taxPercent: number,
            tax: number,
            totalPrice: number,
            lotCode?: string,
            company_product: {
                id: number,
                categoryId: number,
                code: string,
                name: string,
                description: string,
                price: number,
                taxPercent: number,
                category: {
                    id: number,
                    companyId: number,
                    name?: string,
                }
            },
        },
        companyClientProductPrice: {
            companyId: number,
            companyClientId: number,
            companyProductId: number,
            measureId: number,
            price?: number,
            taxPercent: number,
            tax: number,
            totalPrice: number,
            isActive: boolean,
            updated_at: string,
            created_at: string,
        },
        measure: {
            id: number,
            name: string
        },
        company_discount_type?:{
            discountPercent?: number
            id?: number
            name?: string
        }

}

export class OrdersProductsInterface  implements OrdersProductsInterface  {
	constructor(){
       
            this.id = 0,
            this.companyClientId = 0,
            this.companyProductId = 0,
            this.orderId = 0,
            this.price = 0,
            this.quantity = 0,
            this.name = '',
            this.taxPercent = 0,
            this.tax = 0,
            this.isActive = true,
            this.lastPrice = 0,
            this.equivalence = 0;
            this.equivalencePercent = 0; 
            this.observation = '';
            this.haveProduct = null;
            this.company_product ={
                categoryId: 0,
                code: 0,
                companyId: 0,
                created_at: '',
                created_by: '',
                deleted_at: '',
                description: '',
                endPromotionDate: '',
                equivalencePercent: 0,
                estimatedWeightPerUnit: 0,
                highlight: false,
                id: 0,
                isActive: false,
                name: '',
                origin: '',
                promotion: false,
                showInApp: false,
                startPromotionDate: '',
                subCategoryId: 0,
                taxPercent: 0,
                updatableFromCompanyParent: false,
                updated_at: '',
                updated_by: 0,
                valoration: 0,
            },
            this.company_product_price = {
                id: 0,
                companyId: 0,
                companyProductId: 0,
                measureId: 0,
                price: 0,
                taxPercent: 0,
                tax: 0,
                totalPrice: 0,
                company_product : {
                    id: 0,
                    categoryId:0,
                    code: '',
                    name: '',
                    description: '',
                    price: 0,
                    taxPercent: 0,
                    category: {
                        id: 0,
                        companyId: 0,
                        name: '',
                    }
                },
            },
            this.companyClientProductPrice = {
                companyId: 0,
                companyClientId: 0,
                companyProductId: 0,
                measureId: 0,
                price: 0,
                taxPercent: 0,
                tax: 0,
                totalPrice: 0,
                isActive: false,
                updated_at: '',
                created_at: ''
            },
            this.measure = {
                id: 0,
                name: ''
            },
            this.company_discount_type = {
                discountPercent: 0,
                id: 0,
                name: ''
            }
	}
}
