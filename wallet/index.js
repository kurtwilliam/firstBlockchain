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
	createTransaction(recipient, amount, transactionPool) {
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

	static blockchainWallet() {
		const blockchainWallet = new this();
		blockchainWallet.address = 'blockchain-wallet';
		return blockchainWallet;
	}
}

module.exports = Wallet;