const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
const uuid = require("uuid/v1");

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
}

module.exports = Util;
