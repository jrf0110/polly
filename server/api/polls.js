var router = module.exports = require('express').Router();
var m = require('../middleware');
var Poll = require('../../models/poll/db');

router.get('/polls'
, m.db.pagination()
, m.db.polls.find()
, m.json('polls')
);

router.get('/polls/:id'
, m.db.where({ id: m.value('req.params.id', 'number') })
, m.db.polls.findOne()
, m.json('poll')
);

router.post('/polls'
, function( req, res, next ){
    req.poll = Poll.create( req.body );
    req.poll.save( next );
  }
, m.logger.info( 'Created new Poll', m.value('req.poll') )
, m.json( m.value('req.poll') )
);