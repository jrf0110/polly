var errors = require('../../lib/errors');
var utils  = require('../../lib/utils');
var Choice = require('../poll-choice');

module.exports = require('stampit')()
  .enclose(function(){
     this.validators.push( titleRequired );
     this.validators.push( minPollChoices );
     this.validators.push( validChoices );
  });

function titleRequired(){
  if ( typeof this.title !== 'string' || this.title.length === 0 ){
    return errors.validation.INVALID_INPUT('title');
  }

  return null;
}

function minPollChoices(){
  if ( this.choices.length < 2 ){
    return errors.validation.TOO_FEW_CHOICES();
  }

  return null;
}

function validChoices(){
  return this.choices
    .map( Choice.create )
    .map( function( choice ){
      return choice.validate();
    })
    .filter( function( error ){
      return [ null, undefined ].indexOf( error ) === -1;
    })
    .filter( function( error ){
      if ( !Array.isArray( error ) ){
        return true;
      }

      return error.length > 0;
    })
    .reduce( utils.flattenArrayReduce, [] );
}