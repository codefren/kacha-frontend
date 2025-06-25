export interface SubCategoryInterface {
    id: number,
    categoryId: number;
    code?:string,
    name: string,
    linked: boolean,
    isActive: boolean,

}

export class SubCategoryInterface  implements SubCategoryInterface  {
	constructor(){
        this.id = 0,
        this.categoryId = 0,
        this.code ='',
        this.name = '',
        this.linked = false,
        this.isActive = true
	}
}