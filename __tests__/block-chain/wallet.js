const Wallet = require("../../src/wallet");
const Transaction = require("../../src/wallet/transaction");
const TransactionPool = require("../../src/wallet/transaction-pool");

describe("Wallet", () => {
  let senderWallet, recipientWallet, tp, amount;
  beforeEach(() => {
    tp = new TransactionPool();
    senderWallet = new Wallet();
    recipientWallet = new Wallet();
    amount = 100;
  });

  it("should decrease the balance of the sender", () => {
    const transaction = senderWallet.createTransaction(
      recipientWallet.publicKey,
      amount,
      tp
    );
    expect(
      transaction.outputs.find(
        output => output.address === senderWallet.publicKey
      ).amount
    ).toBe(senderWallet.balance - amount);
  });

  it("should update the balance of the sender", () => {
    let transaction = senderWallet.createTransaction(
      recipientWallet.publicKey,
      amount,
      tp
    );
    transaction = senderWallet.createTransaction(
      recipientWallet.publicKey,
      amount,
      tp
    );
    expect(
      transaction.outputs.find(
        output => output.address === senderWallet.publicKey
      ).amount
    ).toBe(senderWallet.balance - 2 * amount);
  });

  it("should not update transaction if the balance is insufficient", () => {
    amount = 50000;
    let transaction = senderWallet.createTransaction(
      recipientWallet.publicKey,
      amount,
      tp
    );
    expect(transaction).toBeUndefined();
  });

  describe("Transaction", () => {
    let senderWallet, recipientWallet;

    beforeEach(() => {
      senderWallet = new Wallet();
      recipientWallet = new Wallet();
    });

    it("should subtract the `amount` from sender's wallet", () => {
      const amount = 100;
      const transaction = Transaction.createTransaction(
        senderWallet,
        recipientWallet.publicKey,
        amount
      );

      expect(
        transaction.outputs.find(
          output => output.address === senderWallet.publicKey
        ).amount
      ).toBe(senderWallet.balance - amount);
    });

    it("should add the `amount` to recipient's wallet", () => {
      const amount = 100;
      const transaction = Transaction.createTransaction(
        senderWallet,
        recipientWallet.publicKey,
        amount
      );

      expect(
        transaction.outputs.find(
          output => output.address === recipientWallet.publicKey
        ).amount
      ).toBe(amount);
    });

    it("should not create transaction if the balance is insufficient", () => {
      const amount = 5000;
      const transaction = Transaction.createTransaction(
        senderWallet,
        recipientWallet.publicKey,
        amount
      );

      expect(transaction).toBeUndefined();
    });

    it("should return true for valid transactions", () => {
      const amount = 50;
      const transaction = Transaction.createTransaction(
        senderWallet,
        recipientWallet.publicKey,
        amount
      );
      Transaction.signTransaction(transaction, senderWallet);

      expect(
        Transaction.verifyTransaction(transaction, senderWallet)
      ).toBeTruthy();
    });

    it("should return false for invalid transactions", () => {
      const amount = 50;
      const transaction = Transaction.createTransaction(
        senderWallet,
        recipientWallet.publicKey,
        amount
      );
      Transaction.signTransaction(transaction, senderWallet);
      // Tamper with the amount
      transaction.outputs[0].amount += 100;

      expect(
        Transaction.verifyTransaction(transaction, senderWallet)
      ).toBeFalsy();
    });

    describe("updates the transaction correctly", () => {
      let transaction, senderWallet, recipientWallet1, amount1, amount2;

      beforeEach(() => {
        amount1 = 50;
        amount2 = 100;

        senderWallet = new Wallet();
        recipientWallet1 = new Wallet();
        recipientWallet2 = new Wallet();
        transaction = Transaction.createTransaction(
          senderWallet,
          recipientWallet1.publicKey,
          amount1
        );
      });

      it("should update the sender's output correctly", () => {
        transaction.update(senderWallet, recipientWallet2.publicKey, amount2);

        expect(
          transaction.outputs.find(
            output => output.address === senderWallet.publicKey
          ).amount
        ).toBe(senderWallet.balance - amount1 - amount2);
      });

      it("should add the recipient's output", () => {
        transaction.update(senderWallet, recipientWallet2.publicKey, amount2);

        expect(
          transaction.outputs.find(
            output => output.address === recipientWallet2.publicKey
          ).amount
        ).toBe(amount2);
      });

      it("should not update transaction for insufficient balance", () => {
        amount2 = 50000;

        expect(
          transaction.update(senderWallet, recipientWallet2.publicKey, amount2)
        ).toBeUndefined();
      });
    });
  });

  describe("Transaction Pool", () => {
    let tp, senderWallet, recipientWallet1, recipientWallet2, transaction;
    const amount = 100;

    beforeEach(() => {
      tp = new TransactionPool();
      senderWallet = new Wallet();
      recipientWallet1 = new Wallet();
      recipientWallet2 = new Wallet();
      transaction = Transaction.createTransaction(
        senderWallet,
        recipientWallet1.publicKey,
        amount
      );
    });

    it("should add the new transaction to the transaction pool", () => {
      tp.upsertTransaction(transaction);

      expect(tp.transactions.find(t => t.id === transaction.id)).toBeTruthy();
    });

    it("should update the old transaction in transaction pool", () => {
      const oldTransaction = JSON.stringify(transaction);
      tp.upsertTransaction(transaction);
      transaction.update(senderWallet, recipientWallet2.address, amount);
      tp.upsertTransaction(transaction);
      const newTransaction = tp.transactions.find(t => t.id === transaction.id);

      expect(JSON.stringify(newTransaction)).not.toBe(oldTransaction);
    });
  });
});
