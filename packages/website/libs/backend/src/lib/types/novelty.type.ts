export interface Novelty {
    id: number,
    title: string,
    descripcion: string,
    url:string,
    isActive: boolean
  }

  export class Novelty  implements Novelty  {
	constructor(){
        this.id = 0,
        this.title = '',
        this.descripcion = '',
        this.url = '',
        this.isActive = true
	}
}