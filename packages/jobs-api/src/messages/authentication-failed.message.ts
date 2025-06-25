export interface AuthenticationFailedMessage {
    type: 'authentication_failed';
    payload: {
        code: number;
        message: string;
    };
}
