var db    = require('../../db');
var utils = require('../../lib/utils');

module.exports = require('stampit')()
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
      if ( this.id ){
        this.saveExisting( callback );
      } else {
        this.saveNew( callback );
      }

      return this;
    }

  , saveNew: function( callback ){
      var tx = db.dirac.tx.create();

      tx.begin( function( error ){
        if ( error ){
          tx.rollback();
          return callback( error );
        }

        tx.polls.insert( this, function( error, results ){
          if ( error ) return callback( error );

          tx.commit( function( error ){
            if ( error ){
              return callback( error );
            }

            utils.extend( this, results[0] );
            console.log('extending with ', results[0], this);

            return callback( error, this );
          }.bind( this ));
        }.bind( this ));
      }.bind( this ));
    }

  , saveExisting: function( callback ){
      var tx = db.dirac.tx.create();

      tx.begin( function( error ){
        if ( error ){
          tx.rollback();
          return callback( error );
        }

        tx.polls.update( this.getWhereClause(), this, { returning: ['*'] }, function( error, results ){
          if ( error ) return callback( error );

          tx.commit( function( error ){
            return callback( error, results );
          });
        }.bind( this ));
      }.bind( this ));
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