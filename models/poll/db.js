var db    = require('../../db');
var utils = require('../../lib/utils');

module.exports = require('stampit')()
  .compose( require('./') )
  .enclose( function(){
    Object.defineProperty( this, 'dal', {
      enumerable: false
    , configurable: false
    , value: db.polls
    });
  })
  .methods({
    fetch: function( options, callback ){
      if ( typeof options === 'function' ){
        callback = options;
        options = {};
      }

      var where = this.getWhereClause();

      var qOptions = utils.extend( {}, this.dal.defaultQueryOptions, options );

      this.dal.findOne( where, qOptions, function( error, result ){
        if ( error ){
          return callback( error );
        }

        utils.extend( this, result );

        return callback( null, this);
      }.bind( this ));
    }

  , fetchStats: function( callback ){
      db.poll_stats.findOne( { poll_id: this.id }, function( error, stats ){
        if ( error ){
          return callback( error );
        }

        this.stats = stats;

        return callback( null, this );
      }.bind( this ) );
    }

  , save: function( data, callback ){
      if ( this.id ){
        this.saveExisting( data, callback );
      } else {
        this.saveNew( data, callback );
      }

      return this;
    }

  , saveNew: function( data, callback ){
      if ( typeof data === 'function' ){
        callback = data;
        data = null;
      }

      var tx = db.dirac.tx.create();

      // Save poll and choices
      utils.async.waterfall([
        tx.begin.bind( tx )
      , function( results, next ){
          tx.polls.insert( this, { returning: ['*'] }, next );
        }.bind( this )
      , function( pollResults, next ){
          var poll = pollResults[0];

          var choices = this.choices.map( function( choice ){
            return utils.extend( { poll_id: poll.id }, utils.pick( choice, 'title', 'body' ) );
          });

          tx.poll_choices.insert( choices, { returning: ['*'] }, function( error, results ){
            return next( error, poll, results );
          });
        }.bind( this )
      , function( poll, choices, next ){
          tx.commit( function( error ){
            if ( error ){
              return next( error );
            }

            poll.choices = choices;
            utils.extend( this, poll );

            return next();
          }.bind( this ) );
        }.bind( this )
      ], function( error ){
        if ( error ){
          tx.rollback();
          return callback( error );
        }

        return callback( null, this );
      }.bind( this ));
    }

  , saveExisting: function( data, callback ){
      if ( typeof data === 'function' ){
        callback = data;
        data = null;
      }

      data = data || this;

      var tx = db.dirac.tx.create();

      tx.begin( function( error ){
        if ( error ){
          tx.rollback();
          return callback( error );
        }

        tx.polls.update( this.getWhereClause(), data, { returning: ['*'] }, function( error, results ){
          if ( error ) return callback( error );

          tx.commit( function( error ){
            utils.extend( this, results[0] );

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

  , remove: function( callback ){
      this.dal.remove( this.getWhereClause(), callback );
    }
  });

module.exports.find = function( where, options, callback ){
  if ( typeof options === 'function' ){
    callback = options;
    options = null;
  }

  options = utils.defaults( options || {}, this.dal.defaultQueryOptions );

  return this.dal.find( where, options, function( error, results ){
    if ( error ) return callback( error );

    var polls = reuslts.map( function( r ){
      return module.exports( r );
    });

    return callback( null, r );
  });
};

// function beforeFind( query, schema, done ){
//   utils.defaults( query, db.polls.defaultQueryOptions );
//   done();
// }

// db.polls.before( 'find', beforeFind );
// db.polls.before( 'findOne', beforeFind );

// db.polls.after( 'find', function( results, query, schema, done ){
//   for ( var i = results.length - 1; i >= 0; i-- ){
//     results[ i ] = Poll.create( results[ i ] );
//   }

//   done();
// });