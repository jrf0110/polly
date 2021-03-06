var errors = require('../../lib/errors');

module.exports = function( options ){
  return function( error, req, res, next ){

    if ( error instanceof Error ){
      console.error( error );
    } else {
      console.log( error );
    }

    req.logger.error( error );

    if ( !error.httpStatus ){
      error = errors.http.INTERNAL_SERVER_ERROR( null, error );
    }

    res.status( error.httpStatus );

    if ( req.headers['Content-Type'] === 'application/json' ){
      res.json( error );
    } else {
      res.send( error );
    }
  };
};