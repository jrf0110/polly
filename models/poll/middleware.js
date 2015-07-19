var Poll    = require('./db');
var utils   = require('../../lib/utils');
var m       = require('../../server/middleware');

var defaultQueryOptions = require('../../db/dals/polls').defaultQueryOptions;

module.exports.list = function( options ){
  return function( req, res, next ){
    m.db.query( defaultQueryOptions )( req, res, utils.noop );
    m.db.query({ hasVoted: { user_ip: req.ip, session_id: req.sessionID } });

    m.db.polls.find()( req, res, function( error ){
      if ( error ) return next( error );

      req.polls = res.locals.polls = res.locals.polls.map( Poll.create );

      return next();
    });
  };
};

module.exports.get = function( options ){
  options = utils.defaults( options || {}, {
    idLookup: 'req.params.id'
  });

  return function( req, res, next ){
    var fetchOptions = {
      hasVoted: { user_ip: req.ip, session_id: req.sessionID }
    };
    
    req.poll = Poll.create({ id: m.value( options.idLookup )( req, res ) });
    req.poll.fetch( fetchOptions, next );
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

