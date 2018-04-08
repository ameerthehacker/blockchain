const WebSocket = require("ws");
const PEERS = process.env.PEERS ? process.env.PEERS.split(",") : [];
const MESSAGE_TYPES = {
  chain: "CHAIN",
  transaction: "TRANSACTION"
};

class P2Pserver {
  constructor(server, bc, transactionPool) {
    this.bc = bc;
    this.sockets = [];
    this.server = server;
    this.transactionPool = transactionPool;
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
    this.messageHandler(socket);
    this.sendChain(socket);
  }

  sendChain(socket) {
    socket.send(
      JSON.stringify({ type: MESSAGE_TYPES.chain, chain: this.bc.chain })
    );
  }

  syncChain(chain) {
    this.sockets.forEach(socket => this.sendChain(socket));
  }

  sendTransaction(socket, transaction) {
    socket.send(
      JSON.stringify({ type: MESSAGE_TYPES.transaction, transaction })
    );
  }

  broadCastTransaction(transaction) {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }

  messageHandler(socket) {
    socket.on("message", message => {
      message = JSON.parse(message);

      switch (message.type) {
        case MESSAGE_TYPES.chain:
          this.bc.replaceChain(message.chain);
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.upsertTransaction(message.transaction);
          break;
      }
    });
  }
}

module.exports = P2Pserver;
