import { ProductsImage } from "./product-image.type";

export interface ProductsInterface {
    id: number;
    code : string;
    name: string;
    description?: string;
    category: {
        id: number,
        name: string,
        companyId: number,
        isActive: boolean
    },
    price: number;
    taxPercent: number;
    isActive: boolean;
    images: ProductsImage[];
    quantity?: number;
    equivalencePercent?: number; 
    promotion: boolean;
    allowDiscount: boolean;
    startPromotionDate: string;
    endPromotionDate: string;
    showInApp: boolean;
    highlight: boolean;
    updatableFromCompanyParent: boolean;
    valoration: number;
    company_discount_type?:{
        discountPercent?: number
        id?: number
        name?: string
    }
    subCategory?: {
        id?: number,
        name?: string,
        categoryId?: number,
        isActive?: boolean
    }, 
    filters?: any;
    origin: string;
    estimatedWeightPerUnit: number;
    freeField?: string;
    useImageRandom?: boolean;
    showPromotionCountDown?: boolean;
    showPromotionHome?:boolean;
    showPromotionTopCategoryList?:boolean;
    showPromotionBetweenProducts?:boolean;
    showSpecificCategory?:boolean;
    showPromotionCategoryId?:number;
    showPromotionSubCategoryId?: number;
    nextId?: number;
    previousId?:number;
}


export class ProductsInterface  implements ProductsInterface  {
	constructor(){
        this.id = 0;
        this.code='';
        this.name = '';
        this.description = '';
        this.category = {
            id: 0,
            name: '',
            companyId: 0,
            isActive: false
        },
        this.price = 0;
        this.taxPercent = 0;
        this.isActive = true;
        this.images = [];
        this.quantity = 1;
        this.equivalencePercent = 0;
        this.promotion = false;
        this.startPromotionDate = '',
        this.endPromotionDate = '';
        this.showInApp = false;
        this.highlight = false;
        this.updatableFromCompanyParent = true;
        this.valoration = 0;
        this.subCategory = {
            id: 0,
            name: '',
            categoryId: 0,
            isActive: false
        };
        this.company_discount_type = {
            discountPercent: 0,
            id: 0,
            name: ''
        };
        this.filters =[];
        this.origin = '';
        this.estimatedWeightPerUnit = 0;
        this.freeField = '';
        this.useImageRandom = false;
        this.showPromotionCountDown = false;
        this.showPromotionHome = false;
        this.showPromotionTopCategoryList = false;
        this.showPromotionBetweenProducts = false;
        this.showSpecificCategory = false;
        this.showPromotionCategoryId = 0;
        this.nextId = null;
        this.previousId = null;
	}
}
