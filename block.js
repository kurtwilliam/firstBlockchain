// import hashing function
const SHA256 = require('crypto-js/sha256');

// 4 main parts of a block on a blockchain - the time of creation, the hash from the last block in the blockchain, the hash, and the data. Use class to make multiple instances
class Block {
	// set initial values
	constructor(timestamp, lastHash, hash, data) {
		this.timestamp = timestamp;
		this.lastHash = lastHash;
		this.hash = hash;
		this.data = data;
	}

	// Make it so we can see in console
	toString() {
		return `Block -
			Timestamp:${this.timestamp}
			Last Hash:${this.lastHash.substring(0, 10)}
			Hash 		:${this.hash.substring(0, 10)}
			Data 		:${this.data}`;
	}
	
	// initial block on blockchain
	static genesis() {
		return new this('Genesis time', '------', 'f1r57-h45h', []);
	}

	static mineBlock(lastBlock, data) {
		const timestamp = Date.now();
		const lastHash = lastBlock.hash;
		const hash = Block.hash(timestamp, lastHash, data);

		return new this(timestamp, lastHash, hash, data);
	}
 
 	// make a hash for this block using inputs and imported SHA256 module. 
	static hash(timestamp, lastHash, data) {
		return SHA256(`${timestamp}${lastHash}${data}`).toString();
	}
}

module.exports = Block;