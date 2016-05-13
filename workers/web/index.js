if ( process.argv.indexOf('--test') > -1 ){
  process.env.NODE_ENV = 'test';
}

require('babel/register');

var cluster   = require('cluster');
var config    = require('../../config');
var utils     = require('../../lib/utils');
var logger    = require('../../lib/logger').create('Web');

const concurrency = process.env.WEB_CONCURRENCY || require('os').cpus().length;

if ( cluster.isMaster ){
  utils.range( concurrency )
    .forEach( function(){
      cluster.fork();
    });

  cluster.on( 'exit', function( worker, code, signal ){
    cluster.fork();
  });
} else {
  logger = logger.create(`Worker-${cluster.worker.id}`);

  var server = require('../../server')({
    logger: logger
  });

  process.on('uncaughtException', function( exception ){
    logger.error('Uncaught exception, restarting worker', {
      message: exception.message
    , stack: exception.stack
    });

    cluster.worker.kill();
  });

  server.listen( config.http.port, function( error, done ){
    if ( error ) return done( error );

    logger.info( 'Server started on port ' +  config.http.port );
  });
}