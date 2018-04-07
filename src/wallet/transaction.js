const Util = require("../util");

class Transaction {
  /**
   * Instantiates a new transaction object
   */
  constructor() {
    this.id = Util.getUID();
    this.input = null;
    this.outputs = [];
  }

  /**
   * Creates a new transaction object
   * @param {Wallet} senderWallet Wallet object of the sender
   * @param {String} recipient Public key of the recipient
   * @param {Number} amount The amount to be transfered
   */
  static createTransaction(senderWallet, recipient, amount) {
    const transaction = new this();

    // Check if the sender has enough balance
    if (senderWallet.balance < amount) {
      console.log(`Amount: ${amount} exceeds the balance`);
      return;
    }
    transaction.outputs.push(
      ...[
        {
          amount: senderWallet.balance - amount,
          address: senderWallet.publicKey
        },
        { amount, address: recipient }
      ]
    );

    return transaction;
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(Util.hash(transaction.outputs))
    };

    return transaction;
  }

  static verifyTransaction(transaction, senderWallet) {
    return Util.verifySignature(
      senderWallet.publicKey,
      transaction.input.signature,
      Util.hash(transaction.outputs)
    );
  }
}

module.exports = Transaction;
