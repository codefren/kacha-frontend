import { Message } from 'src/interfaces/message.interface';
import { Ws } from 'src/interfaces/ws.interface';

export function send(ws: Ws, message: Message) {
    return ws.send(JSON.stringify(message), false, true);
}
