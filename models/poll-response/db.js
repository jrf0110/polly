var db          = require('../../db');
var utils       = require('../../lib/utils');
var validation  = require('../../lib/stampit-validation');

module.exports = require('stampit')()
  .compose( require('./') )
  .compose( require('./poll-restriction-validation') )
  .enclose( function(){
    this.addValidator( validation.requiredField( 'session_id', 'string' ) );
    this.addValidator( validation.requiredField( 'user_ip', 'string' ) );
  })
  .methods({
    dal: db.poll_responses

  , fetch: function( callback ){
      var where = this.getWhereClause();

      this.dal.findOne( where, function( error, result ){
        if ( error ){
          return callback( error );
        }

        return callback( null, module.exports( result ) );
      });
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

      utils.extend( this, data );

      this.dal.insert( this, { returning: ['*'] }, function( error, results ){
        if ( error ) return callback( error );

        utils.extend( this, results[0] );

        return callback( null, this );
      }.bind( this ));
    }

  , saveExisting: function( data, callback ){
      if ( typeof data === 'function' ){
        callback = data;
        data = null;
      }

      data = data || this;

      this.dal.update( this.getWhereClause(), data, { returning: ['*'] }, function( error, results ){
        if ( error ) return callback( error );

        tx.commit( function( error ){
          utils.extend( this, results[0] );

          return callback( error, results );
        });
      }.bind( this ));
    }

  , getWhereClause: function(){
      var where = {};

      if ( this.id ){
        where.id = this.id;
      }

      return where;
    }

  , remove: function( callback ){
      this.dal.remove( this.getWhereClause(), callback );
    }
  });