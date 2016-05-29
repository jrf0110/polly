var StateController = require('./base');
var Poll = requrie('../models/poll/db');
var ErrorStateController = require('./error');

class PollStateController extends StateController {
  constructor( store ){
    super( store );
    this.errorController = new ErrorStateController( store );
  }

  fetch( id ){
    Poll
      .create({ id })
      .fetch( ( error, poll )=>{
        if ( error ){
          return this.errorController.receive( error );
        }

        return this.receive( poll );
      });
  }

  receive( poll ){
    this.store.data.poll = poll;
    this.emit('change');
  }

  reset(){
    this.store.data.poll = Poll.create();
    this.emit('change');
  }

  save(){

  }
}

module.exports = PollStateController;