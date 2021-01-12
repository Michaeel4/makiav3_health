import {Server} from './server';

console.log('Starting server!');

const server = new Server();
setTimeout(async () => {
    await server.start();
}, 0);
