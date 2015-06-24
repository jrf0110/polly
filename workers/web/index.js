if ( process.argv.indexOf('--test') > -1 ){
  process.env.NODE_ENV = 'test';
}

require('babel/register');

var cluster   = require('cluster');
var config    = require('../../config');
var utils     = require('../../lib/utils');
var logger    = require('../../lib/logger').create('Web');

if ( cluster.isMaster ){
  utils.range( config.http.concurrency )
    .forEach( function(){
      cluster.fork()
    });
} else {
  require('../../server')({
    logger: logger
  }).listen( config.http.port, function( error ){
    if ( error ) return done( error );

    logger.info( 'Server started on port ' +  config.http.port );
  });
}