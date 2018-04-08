const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require("http");
const HTTP_PORT = process.env.HTTP_PORT || 3000;
const BlockChain = require("../src/block-chain");
const P2Pserver = require("./p2p-server");
const Wallet = require("../src/wallet");
const TransactionPool = require("../src/wallet/transaction-pool");
const bc = new BlockChain();
const wallet = new Wallet();
const tp = new TransactionPool();

app.use(bodyParser.json());

app.get("/blocks", (req, res) => {
  res.json(bc.chain);
});

app.post("/mine", (req, res) => {
  const block = bc.addBlock(req.body.data);
  // Sync the chain with the peers
  p2pServer.syncChain(bc.chain);
  console.log(`New block added: ${block.toString()}`);

  res.redirect("/blocks");
});

app.get("/tp", (req, res) => {
  res.json(tp.transactions);
});

app.post("/tp", (req, res) => {
  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, tp);
  p2pServer.broadCastTransaction(transaction);

  res.redirect("/tp");
});

app.get("/public-key", (req, res) => {
  res.json({ publicKey: wallet.publicKey });
});

const server = http.createServer(app);
const p2pServer = new P2Pserver(server, bc, tp);

p2pServer.listen();
server.listen(HTTP_PORT, () => {
  console.log(`Listening on port ${HTTP_PORT}`);
});
