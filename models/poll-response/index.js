var validation = require('../../lib/stampit-validation');

module.exports = require('stampit')()
  .state({

  })
  .compose( require('../../lib/stampit-validation') )
  .compose( require('./validators') )
  .enclose( function(){
    this.addValidator( validation.requiredField( 'poll_id', 'number' ) );
    this.addValidator( validation.requiredField( 'poll_choice_id', 'number' ) );
  });