module.exports = require('loglog').create('App', {
  transports: [
    require('loglog-dev-tools')()
  ]
});