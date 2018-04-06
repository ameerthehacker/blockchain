const SHA256 = require("crypto-js/sha256");

/**
 * Representation of Block in the blockchain
 */
class Block {
  /**
   * Instantiates a new Block object
   * @param {Number} timestamp Timestamp of block creation in millisecond
   * @param {String} hash Hash of the data in the block
   * @param {String} lastHash Hash of the last block in the blockchain
   * @param {Object|String|Array|Number} data Actual data that is stored in the block
   */
  constructor(timestamp, hash, lastHash, data) {
    this.timestamp = timestamp;
    this.hash = hash;
    this.lastHash = lastHash;
    this.data = data;
  }

  /**
   * Prints the details about the Block object for debugging
   */
  toString() {
    return `Block ->
            Timestamp: ${this.timestamp}
            Hash     : ${this.hash.substr(0, 10)}
            Last Hash: ${this.lastHash.substr(0, 10)}
            Data     : ${this.data}`;
  }

  /**
   * Create a new Block object to start the chain
   */
  static genesis() {
    const timestamp = Date.now();
    const lastHash = "-";
    const data = [];
    const hash = this.hash(timestamp, lastHash, []);

    return new this(timestamp, hash, lastHash, []);
  }

  /**
   * Create a new Block and add it to the blockchain
   * @param {Block} lastBlock Last block in the blockchain
   * @param {Object} data Actual data to be stored in the new block
   */
  static mineBlock(lastBlock, data) {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash = this.hash(timestamp, lastHash, data);

    return new this(timestamp, hash, lastHash, data);
  }

  /**
   * Find the hash for the given data
   * @param {String} timestamp Time of creation of block in milliseconds
   * @param {String} lastHash Hash of the last block in the blockchain
   * @param {Object} data Actual data to be stored in the block
   */
  static hash(timestamp, lastHash, data) {
    return SHA256(`${timestamp}${lastHash}${data}`).toString();
  }
}

module.exports = Block;
