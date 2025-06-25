export interface NotesInterface {
    id: number,
    name: string,
    description: string,
    isActive: boolean,
    isDeleted: boolean,
    userId: number;
    user: {
      id: number,
      name : string,
      surname: string
    }
  }

  export class NotesInterface  implements NotesInterface  {
	constructor(){
        this.id = 0,
        this.name = '',
        this.description = '',
        this.isActive = true,
        this.isDeleted = false,
        this.user = {
          id: 0,
          name : '',
          surname: ''
        }
	}
}