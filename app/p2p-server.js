const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;

// string of websocket addresses websocket should connect to as a peer
// Split it into an array of all addresses
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pServer {
	constructor(blockchain) {
		this.blockchain = blockchain;
		this.sockets = [];
	}

	// initially create the server 
	listen() {
		const server = new Websocket.Server({ port: P2P_PORT });

		// listens for messages sent to the websocket server
		server.on('connection', socket => this.connectSocket(socket));
		console.log(`Listenting for peer-to-peer connections on: ${P2P_PORT}`);
	}

	connectSocket(socket) {
		this.sockets.push(socket);
		console.log('Socket connected')
	}
}