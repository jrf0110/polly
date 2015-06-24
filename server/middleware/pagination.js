var utils = require('lodash');

module.exports = function( options ){
  options = utils.defaults( options || {}, {
    offsetField:  'offset'
  , limitField:   'limit'
  , defaultOffset: 0
  , defaultLimit:  30
  });

  return function( req, res, next ){
    var offset  = req.query[ options.offsetField ];
    var limit   = req.query[ options.limitField ];

    req.dbQuery.offset = offset !== undefined ? +offset : options.defaultOffset;
    req.dbQuery.limit = limit !== undefined ? +limit : options.defaultLimit;

    return next();
  };
};