module.exports = require('stampit')()
  .state({

  })
  .compose( require('../../lib/stampit-validation') )
  .compose( require('./validators') );