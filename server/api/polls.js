var router = module.exports = require('express').Router();
var m = require('../middleware');

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