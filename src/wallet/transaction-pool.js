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

  getTransaction(address) {
    return this.transactions.find(t => t.input.address === address);
  }
}

module.exports = TransactionPool;
