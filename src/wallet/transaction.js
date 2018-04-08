const Util = require("../util");
const { MINING_REWARD } = require("../../config");

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
   *
   * @param {Wallet} senderWallet Wallet object of the sender
   * @param {Array} outputs Array of outputs for the transaction
   */
  static createTransactionWithOutputs(senderWallet, outputs) {
    let transaction = new this();
    transaction.outputs.push(...outputs);
    return this.signTransaction(transaction, senderWallet);
  }

  /**
   * Creates a new transaction object
   * @param {Wallet} senderWallet Wallet object of the sender
   * @param {String} recipient Public key of the recipient
   * @param {Number} amount The amount to be transfered
   */
  static createTransaction(senderWallet, recipient, amount) {
    // Check if the sender has enough balance
    if (senderWallet.balance < amount) {
      console.log(`Amount: ${amount} exceeds the balance`);
      return;
    }

    return this.createTransactionWithOutputs(senderWallet, [
      {
        amount: senderWallet.balance - amount,
        address: senderWallet.publicKey
      },
      { amount, address: recipient }
    ]);
  }

  /**
   * Rewards a miner with a predefined amount of cryptocurrency
   * @param {Wallet} blockChainWallet Wallet object of the blockchain itself
   * @param {String} miner Public key of the miner
   */
  static createRewardTransaction(blockChainWallet, miner) {
    return this.createTransactionWithOutputs(blockChainWallet, [
      {
        amount: MINING_REWARD,
        address: miner
      }
    ]);
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
