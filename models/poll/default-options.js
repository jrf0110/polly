var utils = require('../../lib/utils');

module.exports = require('stampit')()
  .enclose(function(){
    this.options = utils.defaults(
      this.options || {}, module.exports.defaultOptions
    );
  });

module.exports.defaultOptions = {
  numberOfVotesPerPoll:   1
, multipleSessionsPerIp:  false
};