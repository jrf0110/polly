/**
 * MValue -
 *
 * Returns a function that will evaluate the path at
 * either req/res
 *
 * Usage:
 *
 * app.get('/users/:id'
 * , m.db.where({ id: m.value('req.params.id') })
 * , m.logger.info('Looking up user', m.value('req.params.id') )
 * , m.db.users.findOne()
 * , m.logger.info('Found user', m.value('req.user.id'), m.value('req.user.name') )
 * , m.json( m.value('req.user') )
 * );
 */

var dotty = require('dotty');

module.exports = function( str ){
  var mvalue = function( req, res ){
    var obj = { req: res, res: res };
    return dotty.get( obj, str );
  };

  mvalue.__isMValue = true;

  return mvalue;
};