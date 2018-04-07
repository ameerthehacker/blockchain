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
  });
});
