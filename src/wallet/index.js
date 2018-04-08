const { INITIAL_BALANCE } = require("../../config");
const Util = require("../util");
const Transaction = require("./transaction");

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

  /**
   * Create or update a transaction in a transaction pool
   * @param {String} recipient Public Key of the recipient
   * @param {Number} amount Amount to be transfered to the recipient
   * @param {TransactionPool} tp Transaction Poll object to which transactions are to be added
   */
  createTransaction(recipient, amount, tp, blockchain) {
    let balance = this.calculateBalance(blockchain);
    if (balance != 0) {
      this.balance = balance;
    }

    if (this.balance < amount) {
      console.log(`Amount: ${amount} exceeds the balance`);
      return;
    }

    let transaction = tp.getTransaction(this.publicKey);
    if (transaction) {
      transaction.update(this, recipient, amount);
    } else {
      transaction = Transaction.createTransaction(this, recipient, amount);
      tp.upsertTransaction(transaction);
    }

    return transaction;
  }

  /**
   * Creates a wallet object for the blockchain
   */
  static blockChainWallet() {
    return new this();
  }

  /**
   * Calculates a user's balance from the blockchain
   * @param {BlockChain} blockchain The BlockChain object
   */
  calculateBalance(blockchain) {
    let balance = 0;
    let transactions = [];

    blockchain.chain.forEach(block =>
      block.data.forEach(transaction => transactions.push(transaction))
    );

    let walletInputTransactions = transactions.filter(transaction => {
      if (transaction.input.address == this.publicKey);
    });

    let startTime = 0;
    if (walletInputTransactions.length > 0) {
      let recentTransaction = walletInputTransactions.reduce((prev, cur) => {
        return prev.input.timestamp > cur.input.timestamp ? prev : cur;
      });

      balance += recentTransaction.input.amount;
      startTime = recentTransaction.input.timestamp;
    }

    transactions.forEach(transaction => {
      if (transaction.input.timestamp > startTime) {
        let output = transaction.outputs.find(
          output => output.address === this.publicKey
        );
        if (output) {
          balance += output.amount;
        }
      }
    });

    return balance;
  }
}

module.exports = Wallet;
