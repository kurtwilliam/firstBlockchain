// miner ties the blockchain and transaction together
class Miner {
	constructor(blockchain, transactionPool, wallet, p2pServer) {
		this.blockchain = blockchain;
		this.transactionPool = transactionPool;
		this.wallet = wallet;
		this.p2pServer = p2pServer;
	}

	// powerful - ties together all engineering functionality
	// we have built up to this point. Grabs transactions
	// from pool, then takes the transactions and create
	// block whos data consists of those transactions. Then
	// tells the p2p server to synchronize chains and include
	// new block with those transactions. then tell transactionPool
	// of all transactions as they are on blockchain
	mine() {
		// grab valid transactions from pool
		const validTransactions	= this.transactionPool.validTransactions();

		// include a reward for the miner
		// create a block consisting of the valid transactions
		// synchronize chians in p2p server
		// clear this miners transaction pool
		// broadcast to every miner to clear their transactionPool
	}
}

module.exports = Miner;