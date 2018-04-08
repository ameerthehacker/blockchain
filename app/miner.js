const Wallet = require("../src/wallet");
const Transaction = require("../src/wallet/transaction");

class Miner {
  constructor(blockchain, wallet, p2pServer, tp) {
    this.blockchain = blockchain;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
    this.tp = tp;
  }

  mine() {
    // Get the valid transactions
    const validTransactions = this.tp.validTransactions();
    // Add the reward transaction
    if (validTransactions.length > 0) {
      validTransactions.push(
        Transaction.createRewardTransaction(
          Wallet.blockChainWallet(),
          this.wallet
        )
      );
      // Add the transactions to the blockchain
      const block = this.blockchain.addBlock(validTransactions);
      // Sync the blockchain
      this.p2pServer.syncChain();
      // Clear all the transactions
      this.tp.clear();
      this.p2pServer.broadCastClearTransaction();

      return block;
    }
  }
}

module.exports = Miner;
