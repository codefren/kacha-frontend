export interface Pagination {
    count: number,
    current_page: number,
    links: {
        previous: string,
        next: string
    },
    per_page: number,
    total: number,
    total_pages: number
}


export class Pagination implements Pagination {
	constructor(){
        this.count = 0,
        this.current_page = 0,
        this.links = {
          previous: '',
          next: ''
        },
        this.per_page = 0,
        this.total = 0,
        this.total_pages = 0
	}
}