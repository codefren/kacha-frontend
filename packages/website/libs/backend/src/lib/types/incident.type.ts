export interface Incident {
    id?:number;
    companyId?: number,
    code?: string
    date?: string,
    time?: number,
    clientName?:string,
    contactTypeId?:number,
    title?:string,
    description?:string,
    outScheduleTime?:boolean,
    duration?: number,
    solved?: boolean,
    incidentSolution?:string,
    images?: { 
        id: number;
        urlImage?: string;
        image?: string
     }[];
    
     
}

export class Incident implements Incident {
    constructor() {
        this.id = 0;
        this.companyId = 0,
        this.code = '',
        this.date= '',
        this.time = 0,
        this.clientName = '',
        this.contactTypeId = 0,
        this.title = '',
        this.description = '',
        this.outScheduleTime = false,
        this.duration = 0,
        this.solved = false,
        this.incidentSolution = '',
        this.images = [];
        
    }
}

