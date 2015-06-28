var errors = require('../../lib/errors');

module.exports = require('stampit')()
  .enclose( function(){
    this.validators.push( titleRequired );
  });

function titleRequired(){
  if ( typeof this.title !== 'string' || this.title.length === 0 ){
    return errors.validation.INVALID_INPUT('title');
  }

  return null;
}