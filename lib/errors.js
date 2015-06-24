module.exports = {};

module.exports.http = {};

module.exports.http.INTERNAL_SERVER_ERROR = function( msg, original ){
  var error = {
    name:       'INTERNAL_SERVER_ERROR'
  , httpStatus: 500
  , message:    msg || 'An unknown error occured'
  , stack:      new Error().stack
  };

  if ( original ){
    error.original = original;
  }

  return error;
};