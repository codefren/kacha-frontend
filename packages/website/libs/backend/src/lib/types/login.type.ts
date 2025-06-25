export class Login {

    constructor (
        public grant_type: string,
        public client_id: number,
        public client_secret: string,
        public username: string,
        public password: string
    ) { }

}
