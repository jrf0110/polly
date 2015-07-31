var PollResponse = require('../poll-response');

module.exports = require('stampit')()
  .state({
    title:    null
  , choices:  []
  })
  .compose( require('../../lib/stampit-validation') )
  .compose( require('./default-options') )
  .compose( require('./apply-poll-choice-model') )
  .compose( require('./validators') )
  .compose( require('./labels') )
  .methods({
    
  });