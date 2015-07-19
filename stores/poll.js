import { EventEmitter } from 'events';
import dispatcher from '../lib/dispatcher';
import Poll from '../models/poll/db';

var poll = Poll.create({});

class PollStore extends EventEmitter {
  constructor(){
    super();

    this.dispatcher = dispatcher.register( action => {
      this.logger.debug('action received', action);

      switch( action.type ){
        case 'RECEIVE_POLL':
          poll = action.poll;
          this.emit('change');
        break;
      }
    });
  }

  get(){
    return poll;
  }

  setLogger( logger ){
    this.logger = logger.create('PollStore');
    return this;
  }
}

export default new PollStore();