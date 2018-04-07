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
}

console.log(new Wallet().toString());

module.exports = Wallet;
