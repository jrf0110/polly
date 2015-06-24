var stampit = require('stampit');

module.exports = function( dal ){
  return stampit()
    .methods({
      fetch: function( callback ){
        if ( !this.id ){
          throw new Error('Cannot fetch object without `id`');
        }
      }
    });
};