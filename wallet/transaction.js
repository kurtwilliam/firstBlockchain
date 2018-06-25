const ChainUtil = require('../chain-util');

class Transaction {
	constructor() {
		this.id = ChainUtil.id();
		this.input = null;
		this.outputs = [];
	}

	static newTransaction(senderWallet, recepientAddress, amount) {
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

		return transaction;
	}
}

module.exports = Transaction;