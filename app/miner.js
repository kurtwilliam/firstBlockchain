const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');

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
		// include a reward for the miner
		const validTransactions	= this.transactionPool.validTransactions();
		validTransactions.push(
			Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
		);

		// create a block consisting of the valid transactions
		const block = this.blockchain.addBlock(validTransactions);

		// synchronize chains in p2p server
		this.p2pServer.syncChains();

		// clear this miners transaction pool
		this.transactionPool.clear();

		// broadcast to every miner to clear their transactionPool
		this.p2pServer.broadcastClearTransactions();

		return block;
	}
}

module.exports = Miner;
