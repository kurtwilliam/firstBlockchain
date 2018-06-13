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

	isValidChain(chain) {
		// if first block isn't genesis, return false
		if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

		// If the lastHash or current hash doesn't match, return false
		for (let i=1; i<chain.length;i++){
			const block = chain[i];
			const lastBlock = chain[i-1];

			if (block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block)) {
				return false;
			}
		}

		return true;
	}

	replaceChain(newChain) {
		// check if received chain is not longer than current chain - we want receiving chain to be longer
		// if we always accept the longer chain it resolves the issue of issuing new blocks at the same time - if every chain always selects the longest one it will help keep them the same
		if (newChain.length <= this.chain.length) {
			console.log('received chain is shorter than current chain');
			return;
		} else if (!this.isValidChain(newChain)) {
			console.log('received chain is not valid');
			return;
		}

		console.log('replacing blockchain with new chain');
		this.chain = newChain;
	}
}

module.exports = Blockchain;