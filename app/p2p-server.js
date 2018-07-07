const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;

// string of websocket addresses websocket should connect to as a peer
// Split it into an array of all addresses
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPES = {
	chain: 'CHAIN',
	transaction: 'TRANSACTION',
	clear_transactions: 'CLEAR_TRANSACTIONS'
};

class P2pServer {
	constructor(blockchain, transactionPool) {
		this.blockchain = blockchain;
		this.transactionPool = transactionPool;
		this.sockets = [];
	}

	// initially create the server 
	listen() {
		const server = new Websocket.Server({ port: P2P_PORT });

		this.connectToPeers();

		// listens for messages sent to the websocket server
		server.on('connection', socket => this.connectSocket(socket));
		console.log(`Listenting for peer-to-peer connections on: ${P2P_PORT}`);
	}

	connectToPeers() {
		peers.forEach(peer => {
			// peer might look like ws://localhost:5001
			const socket = new Websocket(peer);

			socket.on('open', () => this.connectSocket(socket));
		});
	}

	connectSocket(socket) {
		this.sockets.push(socket);
		console.log('Socket connected');

		this.messageHandler(socket);

		this.sendChain(socket);
	}

	messageHandler(socket) {
		socket.on('message', message => {
			const data = JSON.parse(message);
			// synchronize blockchains and keep data up to date
			switch(data.type){
				case MESSAGE_TYPES.chain:
					this.blockchain.replaceChain(data.chain);
					break;
				case MESSAGE_TYPES.transaction:
					this.transactionPool.updateOrAddTransaction(data.transaction);
					break;
				case MESSAGE_TYPES.clear_transactions:
					this.transactionPool.clear();
					break;
			}

			this.blockchain.replaceChain(data);
		})
	}

	sendChain(socket) {
		socket.send(JSON.stringify({ 
			type: MESSAGE_TYPES.chain, 
			chain: this.blockchain.chain
		}));
	}

	sendTransaction(socket, transaction) {
		socket.send(JSON.stringify({
			type: MESSAGE_TYPES.transaction,
			transaction
		}));
	}

	// send this helper function to every connected chain
	// keeps all chains synced
	syncChains() {
		this.sockets.forEach(socket => this.sendChain(socket));
	}

	broadcastTransaction(transaction) {
		this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
	}

	broadcastClearTransactions() {
		this.sockets.forEach(socket => socket.send(JSON.stringify({
			type: MESSAGE_TYPES.clear_transactions
		})));
	}
}

module.exports = P2pServer;