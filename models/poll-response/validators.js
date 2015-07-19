var errors = require('../../lib/errors');
var validation = require('../../lib/stampit-validation');

module.exports = require('stampit')()
  .enclose( function(){
    this.addValidator( validation.requiredField( 'poll_id', 'number' ) );
    this.addValidator( validation.requiredField( 'poll_choice_id', 'number' ) );
    this.addValidator( validation.requiredField( 'session_id', 'string' ) );
    this.addValidator( validation.requiredField( 'user_ip', 'string' ) );
  });