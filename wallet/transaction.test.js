const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Transaction', () => {
	// setup test variables, before each test reset values
	let transaction, wallet, recipient, amount;

	beforeEach(() => {
		wallet = new Wallet();
		amount = 50;
		recipient = 'r3c1p13nt';
		transaction = Transaction.newTransaction(wallet, recipient, amount);
	});

	it('outputs the `amount` subtracted from the wallet balance', () => {
		// find the transaction with the matching key, and ensure it's amount matches 
		expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount);
	});

	it('outputs the `amount` added to the recipient', () => {
		expect(transaction.outputs.find(output => output.address === recipient).amount).toEqual(amount);
	});

	describe('transacting with an amount that exceeds the balance', () => {
		beforeEach(() => {
			// increase amount of transaction then make new transaction with this amount
			amount = 500000;
			transaction = Transaction.newTransaction(wallet,recipient,amount);
		});

		it('does not create the transaction', () => {
			expect(transaction).toEqual(undefined);
		});
	});
});