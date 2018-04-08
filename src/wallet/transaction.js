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
    let transaction = new this();

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

    return this.signTransaction(transaction, senderWallet);
  }

  /**
   * Signs a transaction using the senders public key
   * @param {Transaction} transaction The transaction that is to be signed
   * @param {Wallet} senderWallet The wallet of the sender
   */
  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(Util.hash(transaction.outputs))
    };

    return transaction;
  }

  /**
   * Verifies whether a transaction object is valid or not
   * @param {Transaction} transaction The transaction that is to be verified
   * @param {Wallet} senderWallet The wallet of the sender
   */
  static verifyTransaction(transaction) {
    return Util.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      Util.hash(transaction.outputs)
    );
  }

  /**
   * Update the current transactions by adding new outputs
   * @param {Wallet} senderWallet The sender's wallet object
   * @param {String} recipient Recipient's public key
   * @param {Number} amount The amount to be transfered
   */
  update(senderWallet, recipient, amount) {
    const senderOutput = this.outputs.find(
      output => output.address === senderWallet.publicKey
    );

    if (senderOutput.amount < amount) {
      console.log(`Amount: ${amount} exceeds the balance`);
      return;
    }

    senderOutput.amount -= amount;
    this.outputs.push({
      amount,
      address: recipient
    });

    return Transaction.signTransaction(this, senderWallet);
  }
}

module.exports = Transaction;
