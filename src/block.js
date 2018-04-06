/**
 * Representation of Block in the blockchain
 */
class Block {
  /**
   *
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
}
