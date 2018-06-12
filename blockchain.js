const Block = require('./block');

class Blockchain {
	constructor() {
		this.chain = [Block.genesis()];
	}

	// first parameter is the last block, just by accessing the last piece of the blockchain
	addBlock(data) {
		const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
		this.chain.push(block);

		return block;
	}
}

module.exports = Blockchain;