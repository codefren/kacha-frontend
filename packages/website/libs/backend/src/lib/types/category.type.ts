export interface CategoryInterface {
    id: number,
    companyId: number;
    code?:string,
    name: string,
    isActive: boolean,
    highlight: boolean,
    valoration?: number,
    images?: { 
      id: number;
      urlimage: string;
      image: string
   }[];
   list?: {
     id: number;
     urlimage: string;
     image: string;
     list?: boolean
   }[]
  }

  export class CategoryInterface  implements CategoryInterface  {
	constructor(){
        this.id = 0,
        this.companyId = 0,
        this.code ='',
        this.name = '',
        this.highlight= false;
        this.isActive = true,
        this.valoration = 0,
        this.images =[];
        this.list = [];
	}
}