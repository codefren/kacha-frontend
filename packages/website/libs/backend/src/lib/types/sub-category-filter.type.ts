export interface SubCategoryFilter {
    id: number;
    categoryId: number;
    subCategoryId: number;
    code?:string,
    name: string,
    isActive: boolean,

}

export class SubCategoryFilter  implements SubCategoryFilter  {
	constructor(){
        this.id = 0,
        this.categoryId = 0,
        this.subCategoryId = 0,
        this.code ='',
        this.name = '',
        this.isActive = true
	}
}