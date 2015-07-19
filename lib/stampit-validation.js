var utils = require('./utils');
var errors = require('./errors');

module.exports = require('stampit')()
  .enclose( function(){
    var validators = [];

    this.validate = function(){
      var this_ = this;

      return validators
        .map( function( validator ){
          return validator.call( this_ );
        })
        .filter( function( value ){
          return [ undefined, null ].indexOf( value ) === -1;
        })
        .reduce( utils.flattenArrayReduce, [] );
    }.bind( this );

    this.addValidator = function( validator ){
      validators.push( validator );
      return this;
    }.bind( this );
  });

module.exports.requiredField = function( field, type ){
  type = type || 'string';

  return function(){
    var invalid = false;
    switch ( type ){
      case "number":
        invalid = isNaN( +this[ field ] );
      break;

      default:
        invalid = typeof this[ field ] !== type;
      break;
    }

    return invalid ? errors.validation.INVALID_INPUT( field ) : null;
  };
};