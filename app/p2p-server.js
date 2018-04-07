const WebSocket = require("ws");
const PEERS = process.env.PEERS ? process.env.PEERS.split(",") : [];

class P2Pserver {
  constructor(server, blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
    this.server = server;
  }

  listen() {
    // Connect to the peers
    this.connectToPeers();
    // Start listening on the server port
    const server = this.server;
    const wsServer = new WebSocket.Server({ server });
    wsServer.on("connection", (socket, req) => {
      console.log(
        `Connection accepted from ${req.connection.remoteAddress}:${
          req.connection.remotePort
        }`
      );
      this.connectSocket(socket);
    });
  }

  connectToPeers() {
    PEERS.forEach(PEER => {
      const socket = new WebSocket(PEER);
      socket.onopen = () => {
        this.connectSocket(socket);
        console.log(`Connected to PEER ${PEER}`);
      };
    });
  }

  connectSocket(socket) {
    this.sockets.push(socket);
  }
}

module.exports = P2Pserver;
