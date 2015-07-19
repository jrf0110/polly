module.exports = require('stampit')
  .compose( require('./') )
  .compose( require('../../lib/stampit-rest')({
    baseUrl: '/api/polls'
  }))