const { INITIAL_BALANCE } = require("../../config");
const Util = require("../util");

class Wallet {
  /**
   * Instantiates a new wallet class
   */
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = Util.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }

  /**
   * Prints the string representation of object for debugging
   */
  toString() {
    return `Wallet ->
            Balance   : ${this.balance}
            Public Key: ${this.publicKey.toString()}`;
  }

  /**
   * Signs hashed data with the wallet's keypair
   * @param {String} hash Hashed data that is to be signed
   */
  sign(hash) {
    return this.keyPair.sign(hash);
  }
}

module.exports = Wallet;
