const Transaction = require('./wallet/transaction');

// Transaction pool is essentially and queue of to be processed transactions
// for the miners to mine

class TransactionPool {
	constructor() {
		this.transactions = [];
	}

	updateOrAddTransaction(transaction) {
		// we don't want updated transaction from pool to reappear
		// so lets find it's id and see if it exists
		let transactionWithId = this.transactions.find(t => t.id === transaction.id);

		if (transactionWithId) { 
			this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
		} else {
			this.transactions.push(transaction);
		}
	}

	existingTransaction(address) {
		return this.transactions.find(t => t.input.address === address);
	}

	// return array of transactions that are valid
	validTransactions() {
		// must meet following conditions:
		// verify signature of every transaction
		// but we can return a filtered down version, doesn't need
		// to be the whole thing
		return this.transactions.filter(transaction => {
			// total amount of outputs in transaction matches whats in output
			const outputTotal = transaction.outputs.reduce((total, output) => {
				return total + output.amount;
			}, 0);

			// verify output totals
			if (transaction.input.amount !== outputTotal) { 
				console.log(`Invalid transaction from ${transaction.input.address}.`);
				return;
			}

			// verify signature
			if (!Transaction.verifyTransaction(transaction)) {
				console.log(`Invalid Signature from ${transaction.input.address}`);
				return;
			}

			return transaction;
		});
	}
}

module.exports = TransactionPool;