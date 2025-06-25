export class RefreshToken {

    constructor (
        public grant_type: string,
        public client_id: number,
        public client_secret: string,
        public refresh_token: string,
    ) { }

}
