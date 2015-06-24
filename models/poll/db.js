var db    = require('../../db');
var utils = require('../../lib/utils');

module.exports = stampit()
  .compose( require('./') )
  .methods({
    fetch: function( callback ){
      var where = this.getWhereClause();

      db.polls.findOne( where, db.polls.defaultQueryOptions, function( error, result ){
        if ( error ){
          return callback( error );
        }

        return callback( null, module.exports( result ) );
      });
    }

  , save: function( callback ){
      var where = this.getWhereClause();

      db.polls.update( this, where, callback );
    }

  , getWhereClause: function(){
      var where = {};

      if ( this.id ){
        where.id = this.id;
      } else if ( this.edit_token ){
        where.edit_token = this.edit_token;
      } else {
        throw new Error('Cannot fetch record without `id` or `edit_token`');
      }

      return where;
    }
  });

module.exports.find = function( where, options, callback ){
  if ( typeof options === 'function' ){
    callback = options;
    options = null;
  }

  options = utils.defaults( options || {}, db.polls.defaultQueryOptions );

  return db.polls.find( where, options, function( error, results ){
    if ( error ) return callback( error );

    var polls = reuslts.map( function( r ){
      return module.exports( r );
    });

    return callback( null, r );
  });
};