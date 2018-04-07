const SHA256 = require("crypto-js/sha256");
const { DIFFICULTY, MINE_RATE } = require("../../config");

/**
 * Representation of Block in the blockchain
 */
class Block {
  /**
   * Instantiates a new Block object
   * @param {Number} timestamp Timestamp of block creation in millisecond
   * @param {String} hash Hash of the data in the block
   * @param {String} lastHash Hash of the last block in the blockchain
   * @param { Number } nonce Unique number to perform proof of work
   * @param {Object|String|Array|Number} data Actual data that is stored in the block
   */
  constructor(timestamp, hash, lastHash, nonce, data, difficulty = DIFFICULTY) {
    this.timestamp = timestamp;
    this.hash = hash;
    this.lastHash = lastHash;
    this.nonce = nonce;
    this.data = data;
    this.difficulty = difficulty;
  }

  /**
   * Prints the details about the Block object for debugging
   */
  toString() {
    return `Block ->
            Timestamp: ${this.timestamp}
            Hash     : ${this.hash.substr(0, 10)}
            Last Hash: ${this.lastHash.substr(0, 10)}
            Nonce    : ${this.nonce}
            Data     : ${this.data}`;
  }

  /**
   * Create a new Block object to start the chain
   */
  static genesis() {
    const timestamp = Date.now();
    const lastHash = "-";
    const data = [];
    const hash = this.hash(timestamp, lastHash, 0, [], DIFFICULTY);

    return new this(timestamp, hash, lastHash, 0, []);
  }

  /**
   * Create a new Block and add it to the blockchain
   * @param {Block} lastBlock Last block in the blockchain
   * @param {Object} data Actual data to be stored in the new block
   */

  static mineBlock(lastBlock, data) {
    let timestamp,
      nonce = 0,
      hash;
    const lastHash = lastBlock.hash;
    let difficulty = lastBlock.difficulty;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = this.adjustDifficulty(lastBlock, timestamp);
      hash = this.hash(timestamp, lastHash, nonce, data, difficulty);
    } while (hash.substr(0, difficulty) !== "0".repeat(difficulty));

    return new this(timestamp, hash, lastHash, nonce, data, difficulty);
  }

  /**
   * Find the hash for the given data
   * @param {String} timestamp Time of creation of block in milliseconds
   * @param {String} lastHash Hash of the last block in the blockchain
   * @param { Number } nonce Unique number to perform proof of work
   * @param {Object} data Actual data to be stored in the block
   */
  static hash(timestamp, lastHash, nonce, data, difficulty) {
    return SHA256(
      `${timestamp}${lastHash}${nonce}${data}${difficulty}`
    ).toString();
  }

  /**
   * Return the result of hashing the block
   * @param {Block} block The block for which hash is to be calculated
   */
  static hashBlock(block) {
    const { timestamp, lastHash, nonce, data, difficulty } = block;

    return this.hash(timestamp, lastHash, nonce, data, difficulty);
  }

  /**
   *
   * @param {Block} lastBlock Last block in the blockchain
   * @param {String} currentTime Timestamp at which the block was created
   */
  static adjustDifficulty(lastBlock, currentTime) {
    return lastBlock.timestamp + MINE_RATE > currentTime
      ? lastBlock.difficulty + 1
      : lastBlock.difficulty - 1;
  }
}

module.exports = Block;
