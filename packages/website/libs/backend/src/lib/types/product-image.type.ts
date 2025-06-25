export interface ProductsImage {

    companyProductId: number;
    id: number;
    image: string;
    main: boolean;
}

export class ProductsImage  implements ProductsImage  {
	constructor(){
        this.companyProductId = 0;
        this.id = 0;
        this.image = '';
        this.main = false;
	}
}
