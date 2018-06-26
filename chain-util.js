// elliptic provides the core private and public key generation
// apparently it is expensive to perform an elliptic computation
// but we wont get into that rn
const EC = require('elliptic').ec;
// what Bitcoin uses below
const ec = new EC('secp256k1');
// import hashing function
const SHA256 = require('crypto-js/sha256');

// uuid generates our unique id's.
// different versions of UUID, v1 fits our needs because
// it is timestamp based
const uuidV1 = require('uuid/v1');

class ChainUtil {
	static genKeyPair() {
		return ec.genKeyPair();
	}

	static id() {
		return uuidV1();
	}

	static hash(data) {
		return SHA256(JSON.stringify(data)).toString();
	}

	static verifySignature(publicKey, signature, dataHash) {
		return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
	}
}

module.exports = ChainUtil;