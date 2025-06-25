export interface Partners {
    id?: number,
    name?: string,
    cif?: string,
    email?: string,
    phone?: string,
    address?:string,
    population?: string,
    postalCode?: string,
    email_user?: string,
    name_user?: string,
    surname?: string,
    phone_user?: string,
    password?: string,
    password_confirmation?:string,
    isActive? : boolean,
    user?:{
        email?: string,
        id?: number,
        last_login_at?: string,
        name?: string,
        surname?: string,
        partnerId?: number,
        phone?: string
       
    }
  }

  export class Partners  implements Partners  {
	constructor(){
        this.id = 0,
        this.name = '',
        this.cif = '',
        this.email = '',
        this.phone = '',
        this.address = '',
        this.population = '',
        this.postalCode = '',
        this.email_user = '',
        this.name_user = '',
        this.surname = '',
        this.phone_user = '',
        this.password = '',
        this.password_confirmation = '',
        this.isActive = true,
        this.user = {
            email: '',
            id: 0,
            last_login_at: 'string',
            name: '',
            surname: '',
            partnerId: 0,
            phone: ''
           
        }
	}
}