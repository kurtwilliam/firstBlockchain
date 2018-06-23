const Blockchain = require('./blockchain');

const bc = new Blockchain();

// create 10 block blockchain
for (let i=0; i<10; i++) {
	console.log(bc.addBlock(`foo ${i}`).toString());
}