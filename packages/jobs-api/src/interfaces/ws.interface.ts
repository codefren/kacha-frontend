import * as uWS from 'uWebSockets.js';

export type Ws = uWS.WebSocket & {
    closed: boolean;
    handled: boolean;
    onClose: (code: number, message: ArrayBuffer) => void;
};
