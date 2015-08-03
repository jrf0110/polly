module.exports = require('stampit')
  .compose( require('./') )
  .compose( require('../../lib/stampit-rest')({
    baseUrl: '/api/polls'
  , url: function(){
      var url = [ this.options.baseUrl, this.poll_id, 'responses' ];

      if ( this.isNew() ){
        return url.join('/');
      }

      url.push( this.identifier() );

      return url.join('/');
    }
  }))
  .methods({

  })