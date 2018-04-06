const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const HTTP_PORT = process.env.HTTP_PORT || 3000;
const BlockChain = require("../src/block-chain");
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

app.listen(HTTP_PORT, () => {
  console.log(`Listening on port ${HTTP_PORT}`);
});
