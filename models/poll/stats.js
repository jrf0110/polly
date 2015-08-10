module.exports = require('stampit')()
  .state({
    stats: {}
  })
  .methods({
    getTotalVotes: function(){
      return Object
        .keys( this.stats.responses )
        .reduce( function( val, key ){
          return val + this.stats.responses[ key ];
        }.bind( this ), 0 );
    }
  });