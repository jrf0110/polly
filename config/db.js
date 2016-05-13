var path = require('path');

module.exports = {
  connectionStr: process.env['DATABASE_URL'] || 'postgres://localhost:5432/polly'
, extensions: [
    'uuid-ossp'
  , 'hstore'
  ]
, fixturesPath: __dirname + '/../db/scripts/fixtures.sql'
};

if ( process.env['NODE_ENV'] === 'test' ){
  module.exports.connectionStr += '_test';
  module.exports.fixturesPath = __dirname + '/../test/fixtures.sql';
}