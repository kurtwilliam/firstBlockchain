const ChainUtil = require('../chain-util');
const { DIFFICULTY, MINE_RATE } = require('../config');

// 4 main parts of a block on a blockchain - the time of creation, the hash from the last block in the blockchain, the hash, and the data. Use class to make multiple instances
class Block {
	// set initial values
	// timestamp - time when block was created
	// lastHash - hash of previous block in blockchain
	// hash - unique identifier for block, made from other parameters and hashing function
	// data - data we want to be associated with the block
	// nonce - number of leading 0's
	// difficulty - how hard it is to mine block, changes dynamically, for first block set to DIFFICULTY
	constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
		this.timestamp = timestamp;
		this.lastHash = lastHash;
		this.hash = hash;
		this.data = data;
		this.nonce = nonce;
		this.difficulty = difficulty || DIFFICULTY;
	}

	// Make it so we can see in console
	toString() {
		return `Block -
			Timestamp  :${this.timestamp}
			Last Hash  :${this.lastHash.substring(0, 10)}
			Hash       :${this.hash.substring(0, 10)}
			Nonce      :${this.nonce}
			Difficulty :${this.difficulty}
			Data       :${this.data}`;
	}
	
	// initial block on blockchain
	// Static method calls are made directly on the class and are not callable on instances of the class.
	static genesis() {
		return new this('Genesis time', '------', 'f1r57-h45h', [], 0, DIFFICULTY);
	}

	static mineBlock(lastBlock, data) {
		let hash, timestamp;
		const lastHash = lastBlock.hash;
		let { difficulty } = lastBlock;
		let nonce = 0;

		// increase nonce while it doesn't match the difficulty,
		// and generate a new timestamp each time its mined
		// demands node spends computational power to find hash
		do {
			nonce++;
	      timestamp = Date.now();
	      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
	      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);

			// substring gets the first 0 - difficulty values of the hash to check how many 0's there are
			// difficulty is defined dynamically 
    	} while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));
		
		return new this(timestamp, lastHash, hash, data, nonce, difficulty);
	}
 
 	// make a hash for this block using inputs and imported SHA256 module. 
	static hash(timestamp, lastHash, data, nonce, difficulty) {
		return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
	}

	// lets individual block generate a hash
	static blockHash(block) {
		const { timestamp, lastHash, data, nonce, difficulty } = block;

		return Block.hash(timestamp, lastHash, data, nonce, difficulty);
	}

	// Difficulty determines how quickly blocks are added to the chain
	static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty } = lastBlock;
    difficulty = lastBlock.timestamp + MINE_RATE > currentTime ?
      difficulty + 1 : difficulty - 1;
    return difficulty;
  }
}

module.exports = Block;
