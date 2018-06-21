// import hashing function
const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY } = require('../config');

// 4 main parts of a block on a blockchain - the time of creation, the hash from the last block in the blockchain, the hash, and the data. Use class to make multiple instances
class Block {
	// set initial values
	constructor(timestamp, lastHash, hash, data, nonce) {
		this.timestamp = timestamp;
		this.lastHash = lastHash;
		this.hash = hash;
		this.data = data;
		this.nonce = nonce;
	}

	// Make it so we can see in console
	toString() {
		return `Block -
			Timestamp:${this.timestamp}
			Last Hash:${this.lastHash.substring(0, 10)}
			Hash     :${this.hash.substring(0, 10)}
			Nonce    :${this.nonce}
			Data     :${this.data}`;
	}
	
	// initial block on blockchain
	static genesis() {
		return new this('Genesis time', '------', 'f1r57-h45h', [], 0);
	}

	static mineBlock(lastBlock, data) {
		let hash, timestamp;
		const lastHash = lastBlock.hash;
		let nonce = 0;

		// increase nonce while it doesn't match the difficulty,
		// and generate a new timestamp each time its mined
		// demands node spends computational power to find hash
		do {
			nonce ++;
			timestamp = Date.now();
			hash = Block.hash(timestamp, lastHash, data, nonce);

			// substring gets the first 0 - DIFFICULTY values of the hash to check how many 0's there are
		} while(hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));
		

		return new this(timestamp, lastHash, hash, data, nonce);
	}
 
 	// make a hash for this block using inputs and imported SHA256 module. 
	static hash(timestamp, lastHash, data, nonce) {
		return SHA256(`${timestamp}${lastHash}${data}${nonce}`).toString();
	}

	// lets individual block generate a hash
	static blockHash(block) {
		const { timestamp, lastHash, data, nonce } = block;

		return Block.hash(timestamp, lastHash, data, nonce);
	}
}

module.exports = Block;