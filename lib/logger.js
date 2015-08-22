var transports = [];

if ( process.env.NODE_ENV !== 'test' ){
  transports.push( require('loglog').transports.console({
    maxDataLines: -1
  }));
}

module.exports = require('loglog').create({
  transports: transports
});