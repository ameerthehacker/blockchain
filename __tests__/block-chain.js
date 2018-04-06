const Block = require("../src/block");
const BlockChain = require("../src/block-chain");

describe("BlockChain", () => {
  let bc;

  beforeEach(() => {
    bc = new BlockChain();
  });

  it("should add data to the block chain", () => {
    const data = "foo";
    bc.addBlock(data);

    expect(bc.chain[bc.chain.length - 1].data).toBe(data);
  });
});
