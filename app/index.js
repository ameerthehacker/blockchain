const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require("http");
const HTTP_PORT = process.env.HTTP_PORT || 3000;
const BlockChain = require("../src/block-chain");
const P2Pserver = require("./p2p-server");
const bc = new BlockChain();

app.use(bodyParser.json());

app.get("/blocks", (req, res) => {
  res.json(bc.chain);
});

app.post("/mine", (req, res) => {
  const block = bc.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);

  res.redirect("/blocks");
});

const server = http.createServer(app);
const p2pServer = new P2Pserver(server, bc);

p2pServer.listen();
server.listen(HTTP_PORT, () => {
  console.log(`Listening on port ${HTTP_PORT}`);
});
