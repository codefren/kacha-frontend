export interface Delivery {
    id?: number,
    name: string,
    order: number,
    price: number,
    minTime: number,
    maxTime: number,
    isActive: boolean,
    express: boolean,

}

export class Delivery  implements Delivery  {
	constructor(){
        this.id = 0,
        this.name = '',
        this.order = 0,
        this.price = 0,
        this.minTime = 0,
        this.maxTime = 0,
        this.isActive = false,
        this.express = false
	}
}
export type DP = keyof Delivery;