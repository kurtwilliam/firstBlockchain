// elliptic provides the core private and public key generation
// apparently it is expensive to perform an elliptic computation
// but we wont get into that rn
const EC = require('elliptic').ec;
// what Bitcoin uses below
const ec = new EC('secp256k1');

class ChainUtil {
	static genKeyPair() {
		return ec.genKeyPair();
	}
}

module.exports = ChainUtil;