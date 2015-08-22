module.exports = require('stampit')
  .compose( require('./') )
  .compose( require('../../lib/stampit-rest')({
    baseUrl: '/api/polls'
    // Since the response comes back with the Poll object
    // do not extend instances with res.body
  , extendWithResult: false
  }))
  .methods({
    url: function(){
      var url = [ this.options.baseUrl, this.poll_id, 'responses' ];

      if ( this.isNew() ){
        return url.join('/');
      }

      url.push( this.identifier() );

      return url.join('/');
    }
  });