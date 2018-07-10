const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');
const { INITIAL_BALANCE } = require('../config');

class Wallet {
	constructor() {
		this.balance = INITIAL_BALANCE;
		this.keyPair = ChainUtil.genKeyPair();
		this.publicKey = this.keyPair.getPublic().encode('hex');
	}

	toString() {
		return `Wallet -
			publicKey: ${this.publicKey.toString()}
			balance  : ${this.balance}
		`
	}

	// generate signature using wallet 
	sign(dataHash) {
		return this.keyPair.sign(dataHash);
	}

	// update pool with transaction, or replace transaction if it already exists
	createTransaction(recipient, amount, blockchain, transactionPool) {
		this.balance = this.calculateBalance(blockchain);

		if (amount > this.balance) {
			console.log(`Amount: ${amount} exceeds current balance: ${this.balance}`);
			return;
		}

		let transaction = transactionPool.existingTransaction(this.publicKey);

		// if the transaction exists update the information else make one!!
		if (transaction) {
			transaction.update(this, recipient, amount);
		} else {
			transaction = Transaction.newTransaction(this, recipient, amount);
			transactionPool.updateOrAddTransaction(transaction);
		}

		return transaction;
	}

	// calculating true balance requires very deeply nested data
	// need most recent outputs, within transaction objects which
	// are in block objects, themselves within a chain, so deep whoa
	calculateBalance(blockchain) {
		let balance = this.balance;
		let transactions = [];
		// look at each blocks data on the blockchain, array of transactions
		blockchain.chain.forEach(block => block.data.forEach(transaction => {
			transactions.push(transaction);
		}));

		// find transactions devoted to this wallets input
		const walletInputTs = transactions
			.filter(transaction => transaction.input.address === this.publicKey);

		let startTime = 0;

		// add outputs that come after most recent transaction
		if (walletInputTs.length > 0) {
			const recentInputT = walletInputTs.reduce(
				// which one has a higher timestamp?
				(prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
			);

			balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
			startTime = recentInputT.input.timestamp;
		}

		transactions.forEach(transaction => {
			if (transaction.input.timestamp > startTime) {
				transaction.outputs.find(output => {
					if (output.address === this.publicKey) {
						balance += output.amount;
					}
				});
			}
		});

		return balance;
	}

	static blockchainWallet() {
		const blockchainWallet = new this();
		blockchainWallet.address = 'blockchain-wallet';
		return blockchainWallet;
	}
}

module.exports = Wallet;