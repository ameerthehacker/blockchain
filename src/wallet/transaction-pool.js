const Transaction = require("./transaction");

class TransactionPool {
  /**
   * Instantiates a new Transaction Pool object
   */
  constructor() {
    this.transactions = [];
  }

  /**
   * Update or insert a transaction into the transaction pool
   * @param {Transaction} transaction Transaction object that is to be updated or added to the pool
   */
  upsertTransaction(transaction) {
    const transactionWithId = this.transactions.find(
      t => t.id === transaction.id
    );

    if (transactionWithId) {
      this.transactions[
        this.transactions.indexOf(transactionWithId)
      ] = transaction;
    } else {
      this.transactions.push(transaction);
    }

    return this;
  }

  /**
   * Gets a transaction with given public key
   * @param {String} address Public key of the sender
   */
  getTransaction(address) {
    return this.transactions.find(t => t.input.address === address);
  }

  /**
   * Returns all valid transactions in the transaction pool
   */
  validTransactions() {
    const validTransactions = this.transactions.filter(transaction => {
      let outputTotal = transaction.outputs.reduce((total, output) => {
        return total + output.amount;
      }, 0);

      if (outputTotal !== transaction.input.amount) {
        console.log(`Invalid transaction from ${transaction.input.address}`);
        return;
      }

      if (!Transaction.verifyTransaction(transaction)) {
        console.log(`Invalid signature from ${transaction.input.address}`);
        return;
      }

      return transaction;
    });

    return validTransactions;
  }

  /**
   * Clears all the transactions in the transaction pool
   */
  clear() {
    this.transactions = [];
  }
}

module.exports = TransactionPool;
