const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
const uuid = require("uuid/v1");
const SHA256 = require("crypto-js/sha256");

class Util {
  /**
   * Generate a private public keypair
   */
  static genKeyPair() {
    return ec.genKeyPair();
  }

  /**
   * Returns a universal unique constant
   */
  static getUID() {
    return uuid();
  }

  /**
   * Returns the has of a JavaScript object
   * @param {Object} data The data to be hashed
   */
  static hash(data) {
    return SHA256(data);
  }
}

module.exports = Util;
