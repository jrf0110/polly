var utils = require('./utils');

module.exports = require('stampit')()
  .enclose(function(){
    this.validators = this.validators || [];
  })
  .methods({
    validate: function(){
      var this_ = this;

      return this.validators
        .map( function( validator ){
          return validator.call( this_ );
        })
        .filter( function( value ){
          return [ undefined, null ].indexOf( value ) === -1;
        })
        .reduce( utils.flattenArrayReduce, [] );
    }
  });