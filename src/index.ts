import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');

    ws.on('message', (message: string) => {
        console.log(`Received message: ${message}`);
        wss.clients.forEach((client) => {
            client.send(`Server received your message: ${message}`);
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
