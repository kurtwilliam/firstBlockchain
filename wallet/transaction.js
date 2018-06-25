const ChainUtil = require('../chain-util');

class Transaction {
	constructor() {
		this.id = ChainUtil.id();
		this.input = null;
		this.outputs = [];
	}

	// recipient is recipient address
	static newTransaction(senderWallet, recipient, amount) {
		const transaction = new this();

		if (amount > senderWallet.balance) {
			console.log(`Amount: ${amount} exceededs balance`);
			return;
		}

		// 2 parts to transaction: one to sender returns remaining balance and publicKey,
		// one to recipient with amount of transaction and the receiver of currency
		transaction.outputs.push(...[
			{ amount: senderWallet.balance - amount, address: senderWallet.publicKey },
			{ amount, address: recipient }
		]);
		Transaction.signTransaction(transaction, senderWallet);

		return transaction;
	}

	static signTransaction(transaction,senderWallet) {
		transaction.input = {
			timestamp: Date.now(),
			amount   : senderWallet.balance,
			address  : senderWallet.publicKey,
			signature: senderWallet.sign(ChainUtil.hash(transaction.outputs)),
		}
	}
}

module.exports = Transaction;