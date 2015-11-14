module.exports = {
  env:          process.env.NODE_ENV || 'dev'
, db:           require('./db')
, http:         require('./http')
};