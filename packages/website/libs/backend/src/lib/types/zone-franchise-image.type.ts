export interface ZoneFranchiseImage {

    id: number,
    urlimage: string,
    zoneId: number,
    image?:string,
}

export class ZoneFranchiseImage  implements ZoneFranchiseImage  {
	constructor(){
        this.id = 0,
        this.urlimage= '',
        this.zoneId = 0,
        this.image =''
	}
}
