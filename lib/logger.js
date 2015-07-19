var transports = [];

if ( process.env.NODE_ENV !== 'test' ){
  transports.push( require('loglog').transports.console() );
}

module.exports = require('loglog').create({
  transports: transports
});