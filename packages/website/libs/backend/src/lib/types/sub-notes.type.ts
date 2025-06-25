export interface SubNotesInterface {
    id: number,
    companyNoteId: number,
    title:string,
    description: string,
    isActive: boolean,
    isDeleted: boolean,
    created_at: string,
    created_by: number,
    create_by_user: {
        id: number,
        name: string,
        surname: string
    }

  }

  export class SubNotesInterface  implements SubNotesInterface  {
	constructor(){
        this.id = 0,
        this.companyNoteId = 0,
        this.title ='',
        this.description = '',
        this.isActive = true,
        this.isDeleted = false,
        this.created_at = '',
        this.created_by= 0,
        this.create_by_user = {
            id: 0,
            name: '',
            surname: ''
        }
	}
}