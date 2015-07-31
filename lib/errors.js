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

module.exports.validation.INVALID_INPUT = function( field, msg, value ){
  var error = {
    name: 'INVALID_INPUT'
  , httpStatus: 403
  , field: field
  , msg: msg || 'Invalid input for ' + field
  };

  if ( value !== undefined){
    error.value = value;
  }

  return error;
};

module.exports.validation.TOO_FEW_CHOICES = function( msg ){
  var error = {
    name:       'TOO_FEW_CHOICES'
  , httpStatus: 403
  , message:    msg || 'You must provide at least 2 choices for your poll'
  };

  return error;
};

module.exports.validation.VOTED_SAME_THING_TWICE = function( msg ){
  var error = {
    name:       'VOTED_SAME_THING_TWICE'
  , httpStatus: 403
  , message:    msg || 'You cannot vote the same choice more than once. How did you even do that? Are you poking around the unofficial api?'
  };

  return error;
};