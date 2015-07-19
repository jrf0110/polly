var PollChoice = require('../poll-choice');

module.exports = require('stampit')()
  .enclose( function(){
    if ( Array.isArray( this.choices ) ){
      this.applyPollChoiceModel();
    }
  })
  .methods({
    applyPollChoiceModel: function(){
      this.choices = this.choices.map( PollChoice.create );
      return this;
    }
  });