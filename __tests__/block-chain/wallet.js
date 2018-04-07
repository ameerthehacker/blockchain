const Wallet = require("../../src/wallet");
const Transaction = require("../../src/wallet/transaction");

describe("Wallet", () => {
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
  });
});
