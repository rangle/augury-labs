// import * as express from 'express';
// import * as http from 'http';
// import * as io from 'socket.io';
import * as WebSocket from 'ws';

// const app = express();
// const httpServer = new http.Server(app);
// const socketServer = io(httpServer);
const port = +process.env.PORT || 8099;

const server = new WebSocket.Server({ port });

server.on('connection', ws => {
  ws.on('message', message => {
    console.log('received: %s', message);
    ws.send(message);
  });

  ws.on('close', () => {
    console.log('client disconnected');
  });
});

console.log(`listening on 0.0.0.0:${port}`);
