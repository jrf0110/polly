module.exports = function( options ){
  var logger = options.logger.create('Requests');

  return function( req, res, next ){
    req.logger = logger.create('Request');
    return next();
  };
};

['info', 'debug', 'warn', 'error'
].forEach( function( level ){
  module.exports[ level ] = function(){
    var args = [].slice.call( arguments );

    return function( req, res, next ){
      args.forEach( function( arg, i ){
        if ( arg.__isMValue ){
          args[ i ] = arg( req, res );
        }
      });

      req.logger[ level ].apply( req.logger, args );

      return next();
    };
  };
});