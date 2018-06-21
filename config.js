// nonce is a value included in part of the calculation for the hash of the block
// helps miner generate new values with a number of leading 0's
// to match the current difficulty of blockchain
// the more miners there are the higher the difficulty, to keep the rate of adding
// blocks to the blockchain consistent (i.e. 10 mins for bitcoin)
const DIFFICULTY = 4;

module.exports = { DIFFICULTY };