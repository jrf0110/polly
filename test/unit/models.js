var assert = require('assert');

describe('Models', function(){
  describe('Poll', function(){
    var Poll = require('../../models/poll');

    it('.validate() should have no errors', function(){
      var p = Poll.create({
        title: 'Test Poll'
      , choices: [{ title: '1' }, { title: '2' }]
      });

      assert.deepEqual( p.validate(), [] );
    });

    it('.validate() should have INVALID_INPUT error', function(){
      var p = Poll.create({
        title: null
      , choices: [{ title: '1' }, { title: '2' }]
      });

      var errors = p.validate();

      assert.equal( errors.length, 1 );
      assert.equal( errors[0].name, 'INVALID_INPUT' );
    });

    it('.validate() should have INVALID_INPUT error from choice being invalid', function(){
      var p = Poll.create({
        title: 'Test'
      , choices: [{ title: '1' }, {}]
      });

      var errors = p.validate();

      assert.equal( errors.length, 1 );
      assert.equal( errors[0].name, 'INVALID_INPUT' );
    });

    it('.validate() should have TOO_FEW_CHOICES error', function(){
      var p = Poll.create({
        title: 'Test Poll'
      , choices: [{ title: '1' }]
      });

      var errors = p.validate();

      assert.equal( errors.length, 1 );
      assert.equal( errors[0].name, 'TOO_FEW_CHOICES' );
    });
  });

  describe('PollChoice', function(){
    var PollChoice = require('../../models/poll-choice');

    it('.validate()', function(){
      var c = PollChoice.create({ title: 'Blah' });
      var errors = c.validate();
      assert.equal( errors.length, 0 );
    });

    it('.validate() should have INVALID_INPUT error', function(){
      var c = PollChoice.create({});
      var errors = c.validate();
      assert.equal( errors.length, 1 );
      assert.equal( errors[0].name, 'INVALID_INPUT' );
    });
  });
});