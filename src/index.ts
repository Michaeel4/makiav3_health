import { MediaServer, Server } from './server';

console.log('Starting server!');

const server = new Server();
const mediaServer = new MediaServer();
setTimeout(async () => {
    await server.start();
    mediaServer.start();
}, 0);
