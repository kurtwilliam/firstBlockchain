const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchain', () => {
	let bc, bc2;

	// Each it method is it's own test. beforeEach sets up the testing environment for all of the it methods - aka makes a blank new blockchain for each it. 
	beforeEach(() => {
		bc = new Blockchain();
		bc2 = new Blockchain();
	});

	it('starts with genesis block', () => {
		console.log(bc);
		expect(bc.chain[0]).toEqual(Block.genesis());
	});

	it('adds a new block', () => {
		const data = 'foo';
		bc.addBlock(data);

		console.log(bc);

		// check to ensure the data is foo
		expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
	});

	it('validates a valid chain', () => {
		bc2.addBlock('foo');

		expect(bc.isValidChain(bc2.chain)).toBe(true);
	});

	it('invalidates a chain with a corrupt genesis block', () => {
		bc2.chain[0].data = 'Bad data';

		expect(bc.isValidChain(bc2.chain)).toBe(false);
	});

	it('invalidates a corrupt chain', () => {
		bc2.addBlock('foo');
		bc2.chain[1].data = 'Not foo';

		expect(bc.isValidChain(bc2.chain)).toBe(false);
	});

	it('replaces the chain with a valid chain', () => {
		bc2.addBlock('goo');

		bc.replaceChain(bc2.chain);
		expect(bc.chain).toEqual(bc2.chain);
	});

	it('does not replace the chain with one of less than or equal to length', () => {
		bc.addBlock('foo');
		bc.replaceChain(bc2.chain);

		expect(bc.chain).not.toEqual(bc2.chain);
	});
});