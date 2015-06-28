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

module.exports.validation = {};

module.exports.validation.INVALID_INPUT = function( field, msg ){
  return {
    name: 'INVALID_INPUT'
  , httpStatus: 403
  , field: field
  , msg: msg || 'Invalid input for ' + field
  };
};

module.exports.validation.TOO_FEW_CHOICES = function( msg ){
  var error = {
    name:       'TOO_FEW_CHOICES'
  , httpStatus: 403
  , message:    msg || 'An unknown error occured'
  };

  return error;
};