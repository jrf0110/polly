var Poll    = require('./db');
var utils   = require('../../lib/utils');
var m       = require('../../server/middleware');

module.exports.get = function( options ){
  options = utils.defaults( options || {}, {
    idLookup: 'req.params.id'
  });

  return function( req, res, next ){
    req.poll = Poll.create({ id: m.value( options.idLookup )( req, res ) });
    req.poll.fetch( next );
  };
};

module.exports.create = function( options ){
  return function( req, res, next ){
    req.poll = Poll.create( req.body );
    var errors = req.poll.validate();

    if ( errors.length ){
      return next( errors[0] );
    }

    req.poll.save( next );
  };
};

module.exports.update = function( options ){
  options = utils.defaults( options || {}, {
    idLookup: 'req.params.id'
  });

  return function( req, res, next ){
    req.poll = req.poll || Poll.create({ id: m.value( options.idLookup )( req, res ) });
    req.poll.save( req.body, next );
  };
};

module.exports.del = function( options ){
  
  return function( req, res, next ){
    req.poll = req.poll || Poll.create({ id: m.value( options.idLookup )( req, res ) });
    req.poll.remove( next );
  };
};