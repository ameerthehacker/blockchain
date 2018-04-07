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
    const { timestamp, lastHash, nonce, data, difficulty } = block;
    const hash = SHA256(
      `${timestamp}${lastHash}${nonce}${data}${difficulty}`
    ).toString();

    expect(block.hash).toBe(hash);
  });

  it("should do the proof of work correctly", () => {
    expect(block.hash.substr(0, block.difficulty)).toBe(
      "0".repeat(block.difficulty)
    );
  });

  it("should decrease the difficulty for slowly mined blocks", () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 36000)).toBe(
      block.difficulty - 1
    );
  });

  it("should raise the difficulty for slowly mined blocks", () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 1)).toBe(
      block.difficulty + 1
    );
  });
});
