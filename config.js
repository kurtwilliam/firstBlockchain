// nonce is a value included in part of the calculation for the hash of the block
// helps miner generate new values with a number of leading 0's
// to match the current difficulty of blockchain
// the more miners there are the higher the difficulty, to keep the rate of adding
// blocks to the blockchain consistent (i.e. 10 mins for bitcoin)
const DIFFICULTY = 3;

// Dynamic mining rate
// To make dynamic mine rate we should compare the timestamps for mining blocks
// if it is mined too quickly, we need to increase the difficulty
// if it is mined too slowly, we need to decrease the difficulty
// We should always strive to reach a set interval for block mining

const MINE_RATE = 3000;
const INITIAL_BALANCE = 500;

// for mining, no output because it's not an actual transaction
// also, input is unique as it identifies blockchain to sign
// not wallet! So we need a special wallet for the blockchain
const MINING_REWARD = 50;

module.exports = { DIFFICULTY, MINE_RATE, INITIAL_BALANCE, MINING_REWARD };