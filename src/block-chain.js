const Block = require("./block");

class BlockChain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(data) {
    const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
    this.chain.push(block);

    return block;
  }

  isValid(chain) {
    // Check the hash of the genesis block
    if (Block.hashBlock(chain[0]) !== chain[0].hash) {
      return false;
    }
    // Check whether the other blocks have correct lasthash and hash values
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];

      if (
        block.lastHash !== lastBlock.hash ||
        block.hash !== Block.hashBlock(block)
      ) {
        return false;
      }
    }

    return true;
  }
}

module.exports = BlockChain;
