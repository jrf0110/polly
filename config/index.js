module.exports = {
  env:          process.env.NODE_ENV || 'development'
, db:           require('./db')
, http:         require('./http')
, s3:           require('./s3')
, cdn:          require('./cdn')
};