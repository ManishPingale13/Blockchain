const { time } = require("console");
const SHA256 = require("crypto-js/sha256");
const { type } = require("os");
const { Z_BLOCK } = require("zlib");

class Block {
  constructor(index, timestamp, data, prevHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.prevHash = prevHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  calculateHash() {
    return SHA256(
      this.index +
        this.prevHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block Mined " + this.hash);
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
  }
  createGenesisBlock() {
    return new Block(0, "17/12/2020", "This is Data", 0);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.prevHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];

      if (currBlock.hash !== currBlock.calculateHash()) {
        return "Current Hash dosen't Match ";
      }

      if (currBlock.prevHash !== prevBlock.hash) {
        return "Previous Hash Dosen't Match";
      }
    }
    return true;
  }
}

let myCoin = new BlockChain();
console.log("Mining Block 1...")
myCoin.addBlock(new Block(1, "18/12/2020", { amount: 2 }));

console.log("Mining Block 1...")
myCoin.addBlock(new Block(2, "19/12/2020", { amount: 4 }));
