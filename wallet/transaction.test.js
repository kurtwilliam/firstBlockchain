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
		console.log(wallet, transaction)
		expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount);
	});

	it('outputs the `amount` added to the recipient', () => {
		expect(transaction.outputs.find(output => output.address === recipient).amount).toEqual(amount);
	});

	it('input value matches the balance of the wallet', () => {
		expect(transaction.input.amount).toEqual(wallet.balance);
	});

	it('validates a valid transaction', () => {
		expect(Transaction.verifyTransaction(transaction)).toBe(true);
	});

	it('invalidates a corrupt transaction', () => {
		transaction.outputs[0].amount = 50000;
		expect(Transaction.verifyTransaction(transaction)).toBe(false);
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

	describe('and updating a transaction', () => {
		let nextAmount, nextRecipient;

		beforeEach(() => {
			// increase amount of transaction then make new transaction with this amount
			nextAmount = 20;
			nextRecipient = 'n3xt-4ddr355'
			transaction = transaction.update(wallet,nextRecipient,nextAmount);
		});

		it('subtracts the amount from the sender\'s output', () => {
			expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount - nextAmount);
		});

		it('outputs an amount for the next recipient', () => {
			expect(transaction.outputs.find(output => output.address === nextRecipient).amount).toEqual(nextAmount);
		});
	});
});