var hstore  = require('pg-hstore')();

module.exports = {
  hstore: function( val ){
    return hstore.stringify( val );
  }
};