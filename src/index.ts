import { WebSocketServer, WebSocket } from 'ws';
import { Producer, ReconnectingProducerAdapter } from '@umerx/kafkajs-client';

const producer = new ReconnectingProducerAdapter({
    producer: new Producer({
        kafkaConfig: {
            brokers: ['broker:9092'],
            clientId: 'frosttide-command-service',
            connectionTimeout: 30,
            requestTimeout: 30,
            enforceRequestTimeout: true,
            retry: {
                retries: 0,
            },
            // logLevel: logLevel.DEBUG,
        },
        producerConfig: {
            allowAutoTopicCreation: false,
            idempotent: true,
            retry: {
                retries: Number.MAX_SAFE_INTEGER,
            },
        },
        topics: ['frosttide-command-service-output'],
    }),
});

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');

    ws.on('message', (message: string) => {
        console.log(`Received message: ${message}`);
        producer.sendMessage({ key: 'myKey', value: message });
        wss.clients.forEach((client) => {
            client.send(`Server received your message: ${message}`);
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
