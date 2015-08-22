var stampit = require('stampit');
var utils = require('./utils');

module.exports = function( options ){
  options = utils.defaults( options || {}, {
    idField: 'id'
  , extendWithResult: true
  });

  if ( typeof options.baseUrl !== 'string' ){
    throw new Error('Invalid baseUrl');
  }

  return stampit()
    .methods({
      options: options

    , url: function(){
        if ( this.isNew() ){
          return options.baseUrl;
        }

        return [ options.baseUrl, this.getId() ].join('/');
      }

    , isNew: function(){
        return !this.getId();
      }

    , getId: function(){
        return this[ this.options.idField ];
      }

    , fetch: function( callback ){
        var id = this.getId();

        if ( !id ){
          throw new Error('Must provide an id');
        }

        utils.http.get( this.url() )
          .end( function( error, res ){
            if ( error ){
              return this.handleError( error, callback );
            }

            utils.extend( this, res.body );

            return callback( null, this );
          }.bind( this ));
      }

    , save: function( data, callback ){
        if ( this.getId() ){
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

        var doc = utils.extend( {}, this, data );

        utils.http.post( this.url() )
          .send( doc )
          .end( function( error, res ){
            if ( error ){
              return this.handleError( error, callback );
            }

            if ( options.extendWithResult ){
              utils.extend( this, res.body ? res.body : data );
            }

            return callback( null, options.extendWithResult ? this : res.body );
          }.bind( this ));
      }

    , saveExisting: function( data, callback ){
        if ( typeof data === 'function' ){
          callback = data;
          data = null;
        }

        var patch = !!data;
        var req   = utils.http[ patch ? 'patch' : 'put' ]( this.url() );
        var doc   = patch ? data : utils.extend( {}, this, data );

        req.send( doc )
          .end( function( error, res ){
            if ( error ){
              return this.handleError( error, callback );
            }

            if ( options.extendWithResult ){
              utils.extend( this, res.body ? res.body : data );
            }

            return callback( null, options.extendWithResult ? this : res.body );
          }.bind( this ));
      }

    , handleError: function( error, callback ){
        if ( error.response && error.response.body && error.response.body.name ){
          return callback( error.response.body );
        } else {
          return callback( error );
        }
      }
    });
};