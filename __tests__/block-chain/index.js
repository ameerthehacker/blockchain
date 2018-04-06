const Block = require("../../src/block-chain/block");
const BlockChain = require("../../src/block-chain/index");

describe("BlockChain", () => {
  let bc1, bc2;

  beforeEach(() => {
    bc1 = new BlockChain();
    bc2 = new BlockChain();
  });

  it("should add data to the block chain", () => {
    const data = "foo";
    bc1.addBlock(data);

    expect(bc1.chain[bc1.chain.length - 1].data).toBe(data);
  });

  it("should return true for `valid` blockchain", () => {
    expect(bc1.isValid(bc2.chain)).toBeTruthy();
  });

  it("should return false if the `genesis` block is tampered", () => {
    bc2.chain[0].data = "bar";

    expect(bc1.isValid(bc2.chain)).toBeFalsy();
  });

  it("should return false if the `lastHash` in a block is invalid", () => {
    bc2.addBlock("foo");
    bc2.chain[1].lastHash = "bar";

    expect(bc1.isValid(bc2.chain)).toBeFalsy();
  });

  it("should return false if the `hash` in a block is invalid", () => {
    bc2.addBlock("foo");
    bc2.chain[1].hash = "bar";

    expect(bc1.isValid(bc2.chain)).toBeFalsy();
  });

  it("should reject the new chain if newchain length is <= current chain length", () => {
    bc1.replaceChain(bc2.chain);
    expect(bc1.chain).toEqual(bc1.chain);

    bc1.addBlock("foo");
    bc1.replaceChain(bc2.chain);
    expect(bc1.chain).toEqual(bc1.chain);
  });

  it("should accept the new chain if newchain length is > current chain length", () => {
    bc2.addBlock("bar");
    bc1.replaceChain(bc2.chain);
    expect(bc1.chain).toEqual(bc2.chain);
  });
});
