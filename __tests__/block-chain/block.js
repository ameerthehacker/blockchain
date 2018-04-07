const Block = require("../../src/block-chain/block");
const { DIFFICULTY } = require("../../config");
const SHA256 = require("crypto-js/sha256");

describe("Block", () => {
  let lastBlock, data, block;

  beforeEach(() => {
    data = "foo";
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  });

  it("should have `data` given as input", () => {
    expect(block.data).toBe(data);
  });

  it("shoud set the `lastHash` value correctly", () => {
    expect(block.lastHash).toBe(lastBlock.hash);
  });

  it("should calculate the `hash` correctly", () => {
    const timestamp = block.timestamp;
    const lastHash = block.lastHash;
    const nonce = block.nonce;
    const data = block.data;
    const hash = SHA256(`${timestamp}${lastHash}${nonce}${data}`).toString();

    expect(block.hash).toBe(hash);
  });

  it("should do the proof of work correctly", () => {
    expect(block.hash.substr(0, DIFFICULTY)).toBe("0".repeat(DIFFICULTY));
  });
});
