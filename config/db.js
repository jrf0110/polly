var path = require('path');

module.exports = {
  connectionStr: 'postgres://localhost:5432/polly'
, extensions: [
    'uuid-ossp'
  ]
, fixturesPath: __dirname + '/../db/scripts/fixtures.sql'
};

if ( process.env['NODE_ENV'] === 'test' ){
  module.exports.connectionStr += '_test';
  module.exports.fixturesPath = __dirname + '/../test/fixtures.sql';
}