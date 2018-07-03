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
}

module.exports = TransactionPool;