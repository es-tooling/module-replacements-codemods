var crypto = require('crypto');
console.log(crypto.createHash('md5').update('message').digest('hex'));