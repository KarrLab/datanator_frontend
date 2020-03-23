"use strict";

const io = require('socket.io-client');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const protocol = process.env.HTTPS === "true" ? "https" : "http";
const url = protocol + '://' + HOST + ':' + (DEFAULT_PORT + 1);
const socketClient = io.connect(url);

socketClient.on('connect', () => {
  socketClient.emit('npmStop');
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});
