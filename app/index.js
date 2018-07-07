const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

// Use port 3001 if other one isn't available.
const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
	res.json(bc.chain);
});

app.post('/mine', (req, res) => {
	const block = bc.addBlock(req.body.data);
	console.log(`New Block Added: ${block.toString()}`);

	// sync chains after every addition of a new block
	p2pServer.syncChains();

	res.redirect('/blocks');
});

// Get transactions from transaction pool
app.get('/transactions', (req, res) => {
	res.json(tp.transactions);
});

// Create transaction for transaction pool
app.post('/transact', (req, res) => {
	const { recipient, amount } = req.body;
	const transaction = wallet.createTransaction(recipient, amount, tp);

	// after we create transaction broadcast new transaction object
	p2pServer.broadcastTransaction(transaction);

	res.redirect('/transactions');
});

app.get('/mine-transactions', (req, res) => {
	const block = miner.mine();
	console.log(`New block added: ${block.toString()}`);
	res.redirect('/blocks');
});

// get request for public key, so you know..
// users can make transactions
app.get('/public-key', (req, res) => {
	res.json({ publicKey: wallet.publicKey });
});

app.listen(HTTP_PORT, () => console.log(`listening on port ${HTTP_PORT}`));
p2pServer.listen();