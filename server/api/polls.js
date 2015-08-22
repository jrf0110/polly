var router          = module.exports = require('express').Router();
var m               = require('../middleware');
var Poll            = require('../../models/poll/db');
var PollResponse    = require('../../models/poll-response/db');
var PollMiddleware  = require('../../models/poll/middleware');

// List Polls
router.get('/polls'
, m.db.pagination()
, PollMiddleware.list()
, m.json( m.value('req.polls') )
);

// Get Poll
router.get('/polls/:id'
, m.logger.info('get /api/polls', m.value('req.params.id'))
, m.db.where({ id: m.value('req.params.id', 'number') })
, PollMiddleware.get()
, m.logger.info('got poll', m.value('req.poll'))
, m.json( m.value('req.poll') )
);

// Create Poll
router.post('/polls'
, PollMiddleware.create()
, function( req, res, next ){
    req.poll.fetchStats( next );
  }
, m.json( m.value('req.poll') )
);

// Vote
router.post('/polls/:id/responses'
  // TODO: Extract some of this to middlewares
, function( req, res, next ){
    req.poll_response = PollResponse.create({
      poll_id:        req.params.id
    , poll_choice_id: req.body.poll_choice_id
    , user_ip:        req.ip
    , session_id:     req.sessionID
    });

    var errors = req.poll_response.validate();

    if ( errors.length ){
      return next( errors[0] );
    }

    req.poll_response.validatePollRestrictions( next );
  }

, function( req, res, next ){
    req.poll_response.save( next );
  }
, PollMiddleware.get()
, m.json( m.value('req.poll') )
);