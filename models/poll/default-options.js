var utils = require('../../lib/utils');

module.exports = require('stampit')()
  .enclose(function(){
    this.options = utils.defaults(
      this.options || {}, module.exports.defaultOptions
    );
  });

module.exports.defaultOptions = {
  multipleVotesPerUser: false
, multipleVotesPerIP:   false
};