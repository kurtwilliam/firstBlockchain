const Block = require('./block');

const block = new Block('foo', 'lasthash', 'hash', 'data');

console.log(block.toString());