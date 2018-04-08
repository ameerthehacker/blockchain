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
    const validTransactions = tp.validTransactions();
    // Add the reward transaction
    validTransactions.push(
      Transaction.createRewardTransaction(
        Wallet.blockChainWallet(),
        this.wallet
      )
    );
    // Add the transactions to the blockchain
    this.blockchain.addBlock(validTransactions);
    // Sync the blockchain
    this.p2pServer.syncChain();
    // Clear all the transactions
    tp.clear();
    this.p2pServer.broadCastClearTransaction();
  }
}
