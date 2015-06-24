/**
 * Set the where clause on req.dbQuery calculating any
 * [mvalues](./value.js) along the way
 *
 * Usage:
 *
 * app.get('/users/:id'
 * , m.db.where({ id: m.value('req.query.id') })
 * , m.db.users.findOne()
 * , m.json('user')
 * );
 */

var deepExtend  = require('deep-extend');
var mvalue      = require('./value');
var utils       = require('../../lib/utils');

module.exports = function( clause ){
  return function( req, res, next ){
    deepExtend( req.dbQuery.where, clause );
    return next();
  };
};